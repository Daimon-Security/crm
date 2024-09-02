import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleCredit } from './entities/sale-credit.entity';
import { Brackets, IsNull, Like, Repository } from 'typeorm';
import { SaleCreditCreateDto } from './dto/sale-credit-create-dto';
import { Sale } from 'src/sale/entities/sale.entity';
import { CreditHistoryCreateDto } from 'src/credit/dto/credit-history-create-dto';
import { PaymentType, StatusCredit, StatusCreditHistory, StatusPayment } from 'src/credit/enum';
import { addDays, addMonths, format, parseISO, subDays, subMonths } from 'date-fns';
import { User } from 'src/user/entities/user.entity';
import { Client } from 'src/client/entities/client.entity';
import { es } from 'date-fns/locale';
import { SaleCreditHistory } from './entities/sale-credit-history.entity';
import { PaymentDetailCreateDto } from 'src/credit/dto/payment-detaill-create-dto';
import { PaymentDetailSaleCredit } from './entities/payment-detail-sale-credit.entity';
import { getDateStartEnd } from 'src/common/get-date-start-end';
import { CreditListDto } from 'src/credit/dto/credit-list.dto';
import { CreditHistoryDto } from 'src/credit/dto/credit-history-dto';
import { PaymentDetailDto } from 'src/credit/dto/payment-detail-dto';
import { CollectionDto } from 'src/credit/dto/collection-dto';
import { CreditEditDto } from 'src/credit/dto/credit-edit-dto';
import { PaymentDetail } from 'src/credit/entities/payment-detail.entity';
import { Cash } from 'src/cash/entities/cash.entity';
import { CashService } from 'src/cash/cash.service';
import { ExpenseCreateDto, ExpenseType } from 'src/cash/dto/expense-create-dto';
import { CreditTransactionCreateDto } from 'src/cash/dto/credit-transaction-create-dto';
import { TransactionType } from 'src/cash/dto/enum';
import { CreditTransactionDetail } from 'src/cash/entities/credit-transaction-detail.entity';
import { CreditTransaction } from 'src/cash/entities/credit-transaction.entity';
import { CreditTransactionDto } from 'src/cash/dto/credit-transactions-dto';

@Injectable()
export class SaleCreditService {
    constructor(
        @InjectRepository(SaleCredit)
        private saleCreditRepository: Repository<SaleCredit>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
        @InjectRepository(SaleCreditHistory)
        private saleCreditHistoryRepository: Repository<SaleCreditHistory>,
        @InjectRepository(PaymentDetailSaleCredit)
        private paymentDetailSaleCreditRepository: Repository<PaymentDetailSaleCredit>,
        @InjectRepository(Cash)
        private cashRepository: Repository<Cash>,
        private readonly cashService: CashService,
        @InjectRepository(CreditTransactionDetail)
        private creditTransactionDetailRepository: Repository<CreditTransactionDetail>,
        @InjectRepository(CreditTransaction)
        private creditTransactionRepository: Repository<CreditTransaction>
    ) { }


    async create(creditCreateDto: SaleCreditCreateDto, userId: number, sale: Sale, saleDetails: any) {
        console.log("saleDetails: ", saleDetails);
        var response = { success: false }
        var lastCash = await this.cashRepository.findOne({ order: { id: 'DESC' } });
        if (!lastCash || lastCash.closingDate != null) {
            lastCash = (await this.cashService.openCash()).cash;
        }
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        const saleId = sale.id;
        const dateFirstPayment = parseISO(creditCreateDto.firstPayment);
        const debtCollector = await this.userRepository.findOne(creditCreateDto.debtCollectorId);
        const client = await this.clientRepository.findOne(creditCreateDto.clientId);
        const payments = creditCreateDto.paymentsDetail;;
        var createCredit = new SaleCredit();
        createCredit.userId = userId;
        createCredit.client = client;
        createCredit.debtCollector = debtCollector;
        createCredit.paymentFrequency = creditCreateDto.paymentFrequency;
        createCredit.interestRate = creditCreateDto.interestRate;
        createCredit.status = StatusCredit.active;
        createCredit.numberPayment = creditCreateDto.numberPayment;
        createCredit.information = '';
        createCredit.typeCurrency = creditCreateDto.typeCurrency;
        createCredit.commission = creditCreateDto.commission;
        createCredit.sale = sale;
        createCredit.downPayment = creditCreateDto.downPayment;
        createCredit.detail = saleDetails[0].productName;
        const credit = this.saleCreditRepository.create(createCredit);
        const creditSaved = await this.saleCreditRepository.save(credit);
        if (creditSaved) await this.createTransaction(creditSaved, lastCash, creditCreateDto.principal, user);
        const creditId = creditSaved.id;
        if (creditSaved.downPayment > 0) {

            const creditTransactionCreateDto = new CreditTransactionCreateDto(client,
                creditSaved, lastCash, creditSaved.downPayment, 'Venta - Anticipo', TransactionType.downPayment, user, true);
            const responseSavedTrasaction = await this.cashService.createTransaction(creditTransactionCreateDto);
        }
        const newCreditHistory: CreditHistoryCreateDto = {
            date: new Date(creditCreateDto.date),
            principal: creditCreateDto.principal,
            interest: creditCreateDto.principal * creditCreateDto.interestRate / 100,
            credit: creditSaved,
            firstPayment: parseISO(creditCreateDto.firstPayment),
            payDay: this.getDayString(dateFirstPayment),
            payment: creditCreateDto.payment,
            status: StatusCreditHistory.current,
            accounted: false,
            commissionPaymentDetail: null,
            balance: creditCreateDto.balance

        };
        const creditHistorySaved = await this.addCreditHistory(newCreditHistory);
        const creditHistoryId = creditHistorySaved.id;
        if (creditHistorySaved) {
            await this.addPaymentDetail(payments, creditHistorySaved, creditSaved);
            return response.success = true;
        }

        return response;
    }

    private async addCreditHistory(creditHistory: CreditHistoryCreateDto) {
        const newCreditHistory = this.saleCreditHistoryRepository.create(creditHistory);
        return await this.saleCreditHistoryRepository.save(newCreditHistory);
    }


    private async addPaymentDetail(paymentsDetail: PaymentDetailCreateDto[], creditHistorySaved: SaleCreditHistory, credit: SaleCredit) {
        if (paymentsDetail.length > 0) {
            for (let i = 0; i < paymentsDetail.length; i++) {
                var detail = new PaymentDetailSaleCredit();
                detail.payment = paymentsDetail[i].payment;
                detail.paymentDueDate = new Date(paymentsDetail[i].paymentDueDate);
                detail.paymentDate = (paymentsDetail[i].paymentDate) ? new Date(paymentsDetail[i].paymentDate) : null;
                detail.creditHistory = creditHistorySaved;
                detail.actualPayment = (paymentsDetail[i].paymentDate) ? paymentsDetail[i].payment : 0.00;
                detail.balance = (paymentsDetail[i].status == StatusPayment.cancelled) ? parseFloat(((creditHistorySaved.payment * credit.numberPayment) - paymentsDetail[i].payment * (i + 1)).toFixed(2))
                    : (i == 0) ? parseFloat((creditHistorySaved.payment * credit.numberPayment).toFixed(2)) : parseFloat((await this.getBalanceLastPaymentDetailCancelled(creditHistorySaved.id)));
                detail.paymentType = PaymentType.paymentInstallments;
                detail.isNext = ((i == 0 && paymentsDetail[i].status == StatusPayment.active) || (paymentsDetail[i].status == StatusPayment.active && paymentsDetail[i - 1].status == StatusPayment.cancelled)) ? true : false;
                detail.numberPayment = (i + 1).toString();
                const paymentDetail = this.paymentDetailSaleCreditRepository.create(detail);
                const responsePaymentDetail = await this.paymentDetailSaleCreditRepository.save(paymentDetail);
            };
        } else {
            for (let i = 0; i < credit.numberPayment; i++) {
                var detail = new PaymentDetailSaleCredit();
                detail.payment = creditHistorySaved.payment;
                detail.paymentDueDate = (i == 0) ? new Date(creditHistorySaved.firstPayment) : this.getNextPaymenteDate(credit.paymentFrequency, i, creditHistorySaved.firstPayment);
                detail.paymentDate = null;
                detail.actualPayment = 0.00;
                detail.creditHistory = creditHistorySaved;
                detail.balance = parseFloat((creditHistorySaved.payment * credit.numberPayment).toFixed(2));
                detail.paymentType = PaymentType.paymentInstallments;
                detail.isNext = (i == 0) ? true : false;
                detail.numberPayment = (i + 1).toString();
                const paymentDetail = this.paymentDetailSaleCreditRepository.create(detail);
                const responsePaymentDetail = await this.paymentDetailSaleCreditRepository.save(paymentDetail);
            };
        }

    }

    private async getBalanceLastPaymentDetailCancelled(id: number) {
        const result = await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentDetail')
            .where('paymentDetail.sale_credit_history_id = :id', { id })
            .orderBy('paymentDetail.paymentDueDate', 'DESC') // Ordenar por fecha de forma descendente
            .getOne(); // Obtener solo un registro (el último)
        // console.log("result payment balance: ", result);
        return result.balance.toString();
    }

    private getNextPaymenteDate(frequency: string, periodNumber: number, firstPayment: Date): Date {
        switch (frequency) {
            case 'Un pago':
                return firstPayment;
            case 'Semanal':
                return addDays(firstPayment, 7 * periodNumber);
            case 'Quincenal':
                return addDays(firstPayment, 15 * periodNumber);
            case 'Mensual':
                return addMonths(firstPayment, 1 * periodNumber);
            default:
                throw new Error('Frecuencia de pago no válida.');
        }
    }

    private getDayString(date: Date) {
        return format(date, 'EEEE', { locale: es });
    }

    async annulSaleCredit(saleId: number) {
        console.log("saleId: ", saleId);
        var response = { success: false, error: '' };
        const saleCredit = await this.saleCreditRepository.createQueryBuilder('saleCredit')
            .leftJoinAndSelect('saleCredit.sale', 'sale')
            .where('sale.id = :id', { id: saleId })
            .getOne()
            ;
        console.log("saleCredit: ", saleCredit);
        saleCredit.status = StatusCredit.annulled;
        const updateCredit = await this.saleCreditRepository.save(saleCredit);
        if (updateCredit) response.success = true;
        return response;
    }

    async getAll(id: number) {
        var referenceDate = new Date();
        var argentinaTime = referenceDate;
        // new Date(referenceDate.setHours(referenceDate.getHours() - 3));
        //const startDate = new Date(referenceDate.setMonth(referenceDate.getMonth() - 1));
        //const rangeDates = getDateStartEnd(startDate, argentinaTime);
        const rangeDates = { startDate: subMonths(argentinaTime, 1), endDate: argentinaTime };
        const user = await this.userRepository.findOne({ where: { id: id }, relations: ['role'] });
        // console.log("usuario encontrado: ", user);
        const conditions = new Brackets((qb) => {
            if (user.role.name == 'admin') {
                //console.log("estoy en admin")
                qb.where('creditHistory.date BETWEEN :startDate AND :endDate', {
                    startDate: rangeDates.startDate,
                    endDate: rangeDates.endDate,
                })
            } else {
                //console.log("estoy en debt")
                qb.where('credit.debtCollector.id = :user AND creditHistory.date BETWEEN :startDate AND :endDate', {
                    user: user.id,
                    startDate: rangeDates.startDate,
                    endDate: rangeDates.endDate,
                })
            }
        })
        var credits = [];
        credits = await this.saleCreditRepository
            .createQueryBuilder('credit')
            .leftJoinAndSelect('credit.creditHistory', 'creditHistory')
            .where(conditions)
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .leftJoinAndSelect('credit.client', 'client')
            //.leftJoinAndSelect('credit.creditHistory', 'creditHistory')
            .orderBy('creditHistory.date', 'DESC')
            .addOrderBy('creditHistory.id', 'DESC')
            .getMany();

        //console.log("credits: ", credits);
        const creditsDto = credits.map(credit => {
            const creditList = { ...new CreditListDto(credit), type: 2 };
            return creditList;
        })

        return creditsDto;
    }


    async getByClient(client: number, userId: number) {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        if (client) {
            var credits = [];
            if (user.role.name == 'admin') {
                credits = await this.getByClientAdminRole(client);
            } else {
                credits = await this.getByClientDebtCollectorRole(client, userId)
            }
            const creditsDto = this.getCreditsListDto(credits);
            return creditsDto;
        } else {
            return this.getAll(userId);
        }

    }

    private async getByClientAdminRole(client: number) {
        return await this.saleCreditRepository.createQueryBuilder('credit')
            .leftJoinAndSelect('credit.client', 'client')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .leftJoinAndSelect('credit.creditHistory', 'creditHistory')
            .where('credit.client.id = :client', { client })
            .addOrderBy('creditHistory.date', 'DESC')
            .getMany();
    }

    private async getByClientDebtCollectorRole(client: number, userId: number) {
        return await this.saleCreditRepository.createQueryBuilder('credit')
            .leftJoinAndSelect('credit.client', 'client')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .leftJoinAndSelect('credit.creditHistory', 'creditHistory')
            .where('credit.client.id = :client AND credit.debtCollector.id = :userId', { client, userId })
            .addOrderBy('creditHistory.date', 'DESC')
            .getMany();
    }

    private getCreditsListDto(credits: SaleCredit[]): CreditListDto[] {
        return credits.map(credit => {
            const creditList = { ...new CreditListDto(credit), type: 2 };
            return creditList;
        })
    }

    async getById(id: string) {
        const credit = await this.saleCreditRepository.findOne({ where: { id: id }, relations: ['debtCollector', 'client', 'creditHistory', 'creditHistory.paymentsDetail'] });
        if (!credit) {
            throw new NotFoundException(`No se encontró el crédito con el id: ${id}`);
        };
        const creditHistory = credit.creditHistory[credit.creditHistory.length - 1];
        const paymentsDetailDto = creditHistory.paymentsDetail.map(x => {
            return new PaymentDetailDto(x, creditHistory.interest)
        });

        return { ...new CreditEditDto(credit, paymentsDetailDto), type: 2 };
    }

    async getCreditsHistory(id: string) {
        const creditsHistory = await this.saleCreditHistoryRepository.find({
            where: { credit: id }, order: {
                date: 'DESC',
                id: 'DESC'
            }
        });
        const creditsHistoryDto = creditsHistory.map(credit => {
            return new CreditHistoryDto(credit);
        });

        //console.log("creditsHistoryDto: ", creditsHistoryDto);
        return creditsHistoryDto;
    }

    async getPaymentsDetail(id: number): Promise<PaymentDetailDto[]> {
        const credit = await this.saleCreditHistoryRepository.findOne({ where: { id }, relations: ['credit', 'paymentsDetail'] });
        //console.log("credit: ", credit);
        const paymentsDetail = credit.paymentsDetail.sort((a, b) => {
            if (a.paymentDueDate.getTime() !== b.paymentDueDate.getTime()) {
                return a.paymentDueDate.getTime() - b.paymentDueDate.getTime();
            } else {
                return a.id - b.id;
            }
        })
            .map(x => {
                return new PaymentDetailDto(x, credit.interest);
            });
        return paymentsDetail;
    }


    async update(id: number, credit: any) {
        console.log("credit a editar: ", credit);
        var response = { success: false };
        const debtCollector = await this.userRepository.findOne(credit.debtCollectorId);
        var creditSaved = await this.saleCreditRepository.findOne(credit.id);
        const creditHistorySaved = await this.saleCreditHistoryRepository.findOne({ where: { credit: id, status: 1 }, relations: ['credit', 'paymentsDetail'] });
        creditSaved.numberPayment = credit.numberPayment;
        creditSaved.paymentFrequency = credit.paymentFrequency;
        creditSaved.debtCollector = debtCollector;
        creditSaved.information = credit.information;
        creditSaved.typeCurrency = credit.typeCurrency;
        creditSaved.status = parseInt(`${StatusCredit[credit.status]}`);
        creditSaved.commission = credit.commission;
        creditSaved.interestRate = credit.interestRate;
        const updateCreditSaved = await this.saleCreditRepository.save(creditSaved);
        const updateCreditHistorySaved = await this.updateCreditHistory(creditHistorySaved, credit);
        if (credit.paymentsDetail && credit.status == 'active') await this.updatePaymentsDetail(id, credit.paymentsDetail);
        if (updateCreditSaved) response.success = true;
        return response;
        //return null;
    }

    private async updateCreditHistory(creditHistory: SaleCreditHistory, credit: any) {
        console.log("balance: ", credit.balance);
        creditHistory.date = parseISO(credit.date);
        creditHistory.principal = credit.principal;
        creditHistory.interest = credit.principal * credit.interestRate / 100;
        creditHistory.firstPayment = parseISO(credit.firstPayment);
        creditHistory.payDay = this.getDayString(new Date(credit.firstPayment));
        creditHistory.payment = credit.payment;
        creditHistory.status = StatusCredit[credit.status as string];
        creditHistory.accounted = false;
        creditHistory.balance = (!credit.balance) ? creditHistory.balance : credit.balance;
        return await this.saleCreditHistoryRepository.save(creditHistory);
    }

    private async updatePaymentsDetail(creditId: number, paymentsDetail: PaymentDetailCreateDto[]) {
        console.log('updatePaymentsDetail: ');
        var response = { success: false, error: '' };
        const creditHistory = await this.saleCreditHistoryRepository.findOne({ where: { credit: creditId, status: 1 }, relations: ['credit', 'paymentsDetail'] });
        console.log('creditHistory update: ', creditHistory);
        if (creditHistory.paymentsDetail.length > 0) {
            for (const payment of creditHistory.paymentsDetail) {
                const responseDelete = await this.deletePayment(payment.id);
                if (responseDelete.affected > 0) response.success = true;
            };
        } else {
            response.success = true;
        }
        if (response.success) {
            const responseUpdatePayments = await this.addPaymentDetail(paymentsDetail, creditHistory, creditHistory.credit);
        }
    }

    private async deletePayment(id: number) {
        return await this.paymentDetailSaleCreditRepository.delete(id);
    }

    async searchCredits(
        status: string,
        user: string,
        currency: string,
        frequency: string,
        start: Date,
        end: Date) {
        //console.log("user service: ", user);
        const conditions = new Brackets((qb) => {
            qb.where('creditHistory.date BETWEEN :startDate AND :endDate', {
                startDate: start,
                endDate: end,
            })
            if (currency != 'all') {
                qb.andWhere('credit.typecurrency = :currency', {
                    currency
                })
            }
            if (status != 'all') {
                qb.andWhere('credit.status = :status', {
                    status
                })
            }
            if (frequency != 'all') {
                qb.andWhere('credit.paymentFrequency = :frequency', {
                    frequency
                })
            }
        })

        var credits: any;
        if (user == 'all') {
            // console.log("buscando por todos");
            credits = await this.searchCreditsByConditions(conditions);
        } else {
            credits = await this.searchCreditsByConditionsByUser(conditions, parseInt(user));
            // console.log("credits: ", credits);
        };
        const creditsDto = this.getCreditsListDto(credits);

        //console.log("creditos activos: ", creditsDto);
        return creditsDto;
    }

    async searchCreditsByConditionsByUser(conditions: any, user: number) {
        return await this.saleCreditRepository.createQueryBuilder('credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .leftJoinAndSelect('credit.client', 'client')
            .leftJoinAndSelect('credit.creditHistory', 'creditHistory')
            .where(conditions)
            .andWhere('credit.debtCollector_Id = :user', { user })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            .andWhere('credit.debtCollector_Id = :user', { user })
            .orderBy('creditHistory.date', 'DESC')
            .getMany();
    }

    async searchCreditsByConditions(conditions: any) {
        //console.log("condiciones: ", conditions);
        return await this.saleCreditRepository.createQueryBuilder('credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .leftJoinAndSelect('credit.client', 'client')
            .leftJoinAndSelect('credit.creditHistory', 'creditHistory')
            .where(conditions)
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            .orderBy('creditHistory.date', 'DESC')
            .getMany();

    };


    async getCollectionsByDate(userId: number, dateQuery: string) {
        const dateCurrentLocalObject = new Date();
        var argentinaTime = new Date(dateQuery);
        const dayType = (this.areDatesEqual(argentinaTime, dateCurrentLocalObject)) ? 'current' : 'not-current';
        // argentinaTime = new Date(argentinaTime.setHours(argentinaTime.getHours() - 3));
        const startDate = getDateStartEnd(argentinaTime, argentinaTime).startDate;
        const endDate = getDateStartEnd(argentinaTime, argentinaTime).endDate;
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        if (user.role.name == "admin") {
            return await this.getCollectionsByDayAdmin(startDate, endDate, dayType);
        } else {
            return await this.getCollectionsByDayDebtCollector(userId, startDate, endDate, dayType);
        }

    }

    async getCollectionsByDayAdmin(startDate: Date, endDate: Date, day: string) {
        var collections = await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            .andWhere(this.getConditionsFilterByDay(startDate, endDate, day))
            .orWhere('paymentsDetail.paymentDate BETWEEN :startDate AND :endDate AND credit.status != :status', {
                startDate,
                endDate,
                status: StatusCredit.annulled
            })
            .leftJoinAndSelect('credit.client', 'client')
            .orderBy('paymentsDetail.paymentDueDate', 'ASC')
            .addOrderBy('creditHistory.date', 'ASC')
            .getMany();

        //console.log("cobranzas obtenidas: ", collections);

        const collectionsDto = collections.map(payment => {
            return new CollectionDto(payment);
        })
        return collectionsDto
    }

    async getCollectionsByDayDebtCollector(userId: number, startDate: Date, endDate: Date, day: string) {
        var collections = await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            .andWhere('credit.debtCollector.id = :userId', { userId })
            .andWhere(this.getConditionsFilterByDay(startDate, endDate, day))
            .andWhere('credit.debtCollector.id = :userId', { userId })
            .orWhere('paymentsDetail.paymentDate BETWEEN :startDate AND :endDate AND credit.status != :status', {
                startDate,
                endDate,
                status: StatusCredit.annulled
            })
            .andWhere('credit.debtCollector.id = :userId', { userId })
            .leftJoinAndSelect('credit.client', 'client')
            .orderBy('paymentsDetail.paymentDueDate', 'ASC')
            .addOrderBy('creditHistory.date', 'ASC')
            .getMany();


        const collectionsDto = collections.map(collection => {
            return new CollectionDto(collection);
        });

        console.log("cobranzas obtenidas: ", collectionsDto);
        return collectionsDto;
    }

    private getConditionsFilterByDay(startDate: Date, endDate: Date, day: string) {
        if (day == 'current') {
            //  console.log("estoy en current");
            return new Brackets((qb) => {
                qb.orWhere('paymentsDetail.paymentDueDate BETWEEN :startDate AND :endDate AND credit.status != :status', {
                    startDate,
                    endDate,
                    status: StatusCredit.annulled
                })
                    .orWhere(
                        '(paymentsDetail.paymentDueDate <= :startDate AND paymentsDetail.paymentDate IS NULL AND credit.status != :status)',
                        { startDate, status: StatusCredit.annulled }
                    )
                    .orWhere('paymentsDetail.paymentDate BETWEEN :startDate AND :endDate AND credit.status != :status', {
                        startDate,
                        endDate,
                        status: StatusCredit.annulled
                    })
            })
        } else {
            console.log("estoy en not-current");
            return new Brackets((qb) => {
                qb.orWhere('paymentsDetail.paymentDueDate BETWEEN :startDate AND :endDate', {
                    startDate,
                    endDate,
                })
            })
        }
    };

    private areDatesEqual(start: Date, end: Date) {
        return (
            start.getFullYear() === end.getFullYear() &&
            start.getMonth() === end.getMonth() &&
            start.getUTCDate() === end.getUTCDate()
        );
    }


    async searchCollections(
        userId: string,
        statusCredit: string,
        currency: string,
        user: string,
        start: Date,
        end: Date,
        statusPayment: string
    ) {
        const startDate = getDateStartEnd(start, end).startDate;
        const endDate = getDateStartEnd(start, end).endDate;
        const userLogged = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        const collections = await this.getCollectionsByUserRole(userLogged, statusCredit, currency, user, startDate, endDate, statusPayment);
        const collectionsDto = collections.map(collection => {
            return new CollectionDto(collection);
        })
        return collectionsDto
    }

    private async getCollectionsByUserRole(userLogged: User,
        statusCredit: string,
        currencyType: string,
        user: string,
        startDate: Date,
        endDate: Date,
        statusPayment: string) {
        const areDateEqual = this.areDatesEqual(startDate, endDate);
        const currency = (currencyType == 'all') ? ['peso', 'dolar'] : [currencyType];
        var collections: any;
        if (userLogged.role.name == "admin") {
            if (user == 'all') {
                collections = await this.searchCollectionsByConditions(statusCredit, currency, startDate, endDate, statusPayment, areDateEqual);
            } else {
                collections = await this.searchCollectionsByUserByConditions(statusCredit, currency, parseInt(user), startDate, endDate, statusPayment, areDateEqual);

            };
        } else {
            console.log("entrando por aqui 1");
            collections = await this.searchCollectionsByUserByConditions(statusCredit, currency, parseInt(userLogged.id), startDate, endDate, statusPayment, areDateEqual);

        }
        return collections;
    }

    async searchCollectionsByConditions(statusCredit: string, currency: string[], startDate: Date, endDate: Date, statusPayment: string, areDateEqual: boolean) {
        return await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .leftJoinAndSelect('credit.client', 'client')
            .where(this.getConditionsFilterCollections(statusCredit, currency, startDate, endDate, statusPayment, areDateEqual))
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id AND creditHistory.status = 1')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            .orWhere('creditHistory.sale_credit_id = credit.id AND creditHistory.status = 2 AND paymentsDetail.paymentType = 2 AND paymentsDetail.paymentDate BETWEEN :startDate AND :endDate AND credit.typeCurrency IN (:...currency)', { currency, startDate, endDate })
            .orderBy('paymentsDetail.paymentDueDate', 'ASC')
            .getMany();
    }

    async searchCollectionsByUserByConditions(statusCredit: string, currency: string[], user: number, startDate: Date, endDate: Date, statusPayment: string, areDateEqual: boolean) {
        return await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id AND creditHistory.status = 1')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            .leftJoinAndSelect('credit.client', 'client')
            .andWhere('credit.debtCollector.id = :user', { user })
            .andWhere(this.getConditionsFilterCollections(statusCredit, currency, startDate, endDate, statusPayment, areDateEqual))
            .orWhere('creditHistory.sale_credit_id = credit.id AND creditHistory.status = :status AND paymentsDetail.paymentType = :type AND paymentsDetail.paymentDate BETWEEN :startDate AND :endDate AND credit.debtCollector.id = :user AND credit.typeCurrency IN (:...currency)', { status: 2, type: '2', user, currency, startDate, endDate })
            .orderBy('paymentsDetail.paymentDueDate', 'ASC')
            .getMany();
    }

    private getConditionsFilterCollections(statusCredit: string, currency: string[], startDate: Date, endDate: Date, statusPayment: string, areDateEqual: boolean) {
        console.log("estado de credito: ", statusCredit);
        const commonConditions = qb2 => {
            qb2.andWhere('credit.typeCurrency IN (:...currency)', { currency });
            if (statusPayment == 'canceled') qb2.andWhere('paymentsDetail.paymentDate IS NOT NULL');
            if (statusPayment == 'active') qb2.andWhere('paymentsDetail.paymentDate IS NULL');

        }
        var conditions: any;
        if (statusCredit == StatusCredit.active.toString()) {
            conditions = new Brackets((qb) => {
                if (areDateEqual) {
                    console.log("estoy en son iguales: ", areDateEqual);
                    qb.where(
                        qb2 => {
                            qb2.where(
                                '(paymentsDetail.paymentDueDate <= :startDate AND paymentsDetail.paymentDate IS NULL)',
                                { startDate }
                            );
                            commonConditions(qb2);
                            qb2.andWhere('credit.status = :statusCredit', { statusCredit })
                            qb2.orWhere('paymentsDetail.paymentDate BETWEEN :startDate AND :endDate', {
                                startDate,
                                endDate,
                            })
                            commonConditions(qb2)
                            qb2.orWhere(
                                '(paymentsDetail.paymentDueDate >= :startDate AND paymentsDetail.paymentDueDate <= :endDate)',
                                { startDate, endDate }
                            );
                            commonConditions(qb2);
                            qb2.andWhere('credit.status = :statusCredit', { statusCredit })
                        }
                    )
                } else {
                    qb.where(
                        qb2 => {
                            qb2.orWhere('paymentsDetail.paymentDueDate BETWEEN :startDate AND :endDate', {
                                startDate,
                                endDate,
                            })
                            commonConditions(qb2)
                        }
                    )
                }
            });
        } else {
            console.log("soy no activo");
            conditions = new Brackets((qb) => {
                qb.where(
                    qb2 => {
                        qb2.orWhere('paymentsDetail.paymentDueDate BETWEEN :startDate AND :endDate', {
                            startDate,
                            endDate,
                        })
                        commonConditions(qb2)
                    }
                )
            })
        }
        return conditions;

    }


    async getCollectionsByClient(client: number, userId: number, date: string) {
        const dateCurrentLocalObject = new Date();
        var argentinaTime = new Date(date);
        const dayType = (this.areDatesEqual(argentinaTime, dateCurrentLocalObject)) ? 'current' : 'not-current';
        // argentinaTime = new Date(argentinaTime.setHours(argentinaTime.getHours() - 3));
        const startDate = getDateStartEnd(argentinaTime, argentinaTime).startDate;
        const endDate = getDateStartEnd(argentinaTime, argentinaTime).endDate;
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        if (client) {
            var collections = [];
            if (user.role.name == 'admin') {
                collections = await this.getCollectionsByClientAdminRole(client, startDate, endDate, dayType);
            } else {
                collections = await this.getCollectionsByClientDebtCollectorRole(client, startDate, endDate, dayType, userId)
            }
            const collectionsDto = collections.map(collection => {
                return new CollectionDto(collection);
            })
            return collectionsDto
        } else {
            return this.getCollectionsByDate(userId, date);
        }

    }

    private async getCollectionsByClientAdminRole(client: number, startDate: Date, endDate: Date, day: string) {
        return await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            //.andWhere(this.getConditionsFilterByDay(startDate, endDate, day))
            .andWhere('credit.client.id = :client', { client })
            .orWhere('paymentsDetail.paymenttype  = :type AND credit.client.id = :client', {
                type: 2,
                client
            })
            .addOrderBy('paymentsDetail.paymentDueDate', 'ASC')
            .addOrderBy('creditHistory.date', 'ASC')
            .leftJoinAndSelect('credit.client', 'client')
            .getMany();
    }

    private async getCollectionsByClientDebtCollectorRole(client: number, startDate: Date, endDate: Date, day: string, userId: number) {
        return await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('MAX(creditHistory.id)')
                    .from(SaleCreditHistory, 'creditHistory')
                    .where('creditHistory.sale_credit_id = credit.id')
                    .getQuery();
                return `creditHistory.id = ${subQuery}`;
            })
            //.andWhere(this.getConditionsFilterByDay(startDate, endDate, day))
            .andWhere('credit.debtCollector.id = :userId AND credit.client.id = :client', { userId, client })
            .orWhere('paymentsDetail.paymentType  = :type AND credit.client.id = :client AND credit.debtCollector.id = :userId', {
                type: 2,
                client,
                userId
            })
            .leftJoinAndSelect('credit.client', 'client')
            .addOrderBy('paymentsDetail.paymentDueDate', 'ASC')
            .addOrderBy('creditHistory.date', 'ASC')
            .getMany();
    };

    async registerTrasactionAndPayment(id: number, paymentAmount: number, userId: number) {
        var response = { success: false, collection: {} };

        var lastCash = await this.cashRepository.findOne({ order: { id: 'DESC' } });
        if (!lastCash || lastCash.closingDate != null) {
            lastCash = (await this.cashService.openCash()).cash;
        }
        var payment = await this.paymentDetailSaleCreditRepository.createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.client', 'client')
            .leftJoinAndSelect('credit.debtCollector', 'debtCollector')
            .where('paymentsDetail.id = :id', { id })
            .getOne();
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        var concept = (paymentAmount > payment.payment) ? 'Pago de multiples cuotas' : 'Pago de cuota';
        const transaction = await this.registerCreditTransaction(paymentAmount, payment, user, lastCash, concept, TransactionType.payment);
        const responseRegister: any = await this.registerPayment(payment, paymentAmount, transaction, user.role.name);
        console.log("responseRegisterPayment: ", responseRegister);
        if (responseRegister.success) response.success = true;
        return response;
    }

    private async registerPayment(payment: PaymentDetailSaleCredit, paymentAmount: number, transaction: CreditTransaction | null, role: string) {
        var response = { success: false, error: '' };
        payment.paymentDate = new Date();
        payment.actualPayment = (paymentAmount <= payment.payment) ? paymentAmount : payment.payment;
        payment.isNext = false;
        const paymentPending = payment.payment - paymentAmount;
        //if (role == 'admin') payment.transactionId = transactionId;
        const saved = await this.paymentDetailSaleCreditRepository.save(payment);
        var creditTransactionDetail = new CreditTransactionDetail();
        creditTransactionDetail.creditTransaction = transaction;
        creditTransactionDetail.paymentId = payment.id;
        creditTransactionDetail.paymentDueDate = payment.paymentDueDate;
        creditTransactionDetail.paymentDate = payment.paymentDate;
        creditTransactionDetail.payment = payment.payment;
        creditTransactionDetail.actualPayment = payment.actualPayment;
        const responseSaved = await this.creditTransactionDetailRepository.save(creditTransactionDetail);
        if (saved) {
            response.success = true;
            //response.collection = new CollectionDto(saved);
            const creditHistoryUpdate = await this.updateBalanceCreditHistory(payment.creditHistory.id, payment.actualPayment);
            if (creditHistoryUpdate) {
                if (paymentPending > 0) {
                    await this.addPendingPayment(paymentPending, payment.creditHistory, payment.paymentDueDate, payment.numberPayment, payment.id);

                } else {
                    if (payment.creditHistory.credit.numberPayment != 1) await this.updateStatusIsNextPayment(payment.id, true, payment.creditHistory.id);
                    if (paymentPending < 0) {
                        const paymentNext = await this.getPaymentNext(creditHistoryUpdate.id);
                        console.log("paymentNext: ", paymentNext);
                        if (paymentNext) await this.registerPayment(paymentNext, -paymentPending, transaction, role);
                    }
                }
                response.success = true;
            }
        }
        return response;
    }

    private async getPaymentNext(crediHistoryId: number) {
        const payment = await this.paymentDetailSaleCreditRepository.createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .where('paymentsDetail.sale_credit_history_id = :id AND paymentsDetail.isNext = :isNext', { id: crediHistoryId, isNext: true })
            .getOne();
        console.log("payment siguiente: ", payment);
        return payment;
    }

    private async registerCreditTransaction(paymentAmount: number, payment: PaymentDetail, user: User, lastCash: Cash, concept: string, transactionType: TransactionType) {
        const accounted = (user.role.name == 'admin') ? true : false;
        const creditTransactionCreateDto = new CreditTransactionCreateDto(payment.creditHistory.credit.client,
            payment.creditHistory.credit, lastCash, paymentAmount, concept, transactionType, user, accounted);
        const responseSavedTrasaction = await this.cashService.createTransaction(creditTransactionCreateDto);
        return responseSavedTrasaction;
    }

    private async addPendingPayment(paymentPending: number, creditHistory: SaleCreditHistory, date: Date, numberPayment: string, paymentId: number) {
        var payment = new PaymentDetail();
        payment.payment = paymentPending;
        payment.paymentDueDate = addDays(date, 1);
        payment.paymentDate = null;
        payment.paymentType = PaymentType.paymentInstallments;
        payment.accountabilityDate = null;
        payment.creditHistory = creditHistory;
        payment.recoveryDateCommission = null;
        payment.actualPayment = 0.00;
        payment.isNext = true;
        payment.balance = creditHistory.balance;
        payment.numberPayment = (numberPayment.includes('P')) ? numberPayment : numberPayment + ' - P';
        payment.paymentId = paymentId;
        const responseAdd = await this.paymentDetailSaleCreditRepository.save(payment);
        console.log("response add payment pending: ", responseAdd);
    }

    private async updateStatusIsNextPayment(paymentId: number, isNext: boolean, id: number) {
        try {
            const creditHistory = await this.saleCreditHistoryRepository.findOne({ where: { id }, relations: ['paymentsDetail', 'paymentsDetail.creditHistory'], order: { id: 'ASC' } });

            const payments = creditHistory.paymentsDetail.sort((a, b) => {
                if (a.paymentDueDate.getTime() !== b.paymentDueDate.getTime()) {
                    return a.paymentDueDate.getTime() - b.paymentDueDate.getTime();
                }
            });

            const paymentCurrent = payments.find(x => x.id == paymentId);
            const indexPaymentCurrent = payments.findIndex(x => x.id == paymentId);
            if (indexPaymentCurrent != -1) {
                var paymentNext = payments[indexPaymentCurrent + 1];
                if (!paymentNext) {
                    const paymentPreviousIndex = payments.findIndex(x => x.paymentDate.toISOString().substr(0, 10) === subDays(paymentCurrent.paymentDueDate, 1).toISOString().substr(0, 10) && parseFloat(x.payment.toString()) == parseFloat(paymentCurrent.payment.toString()) + parseFloat(x.actualPayment.toString()) && x.creditHistory.id == paymentCurrent.creditHistory.id);
                    if (paymentPreviousIndex != -1) paymentNext = payments[paymentPreviousIndex + 1];
                    await this.setNextPayment(paymentNext, isNext);
                } else {
                    await this.setNextPayment(paymentNext, isNext);
                }
            }
        } catch (err) {
            console.log("Error al establecer proximo pago: ", err);
        }
    }

    private async setNextPayment(paymentNext: PaymentDetail, isNext: boolean) {
        paymentNext.isNext = isNext;
        console.log("payment siguiente: ", paymentNext);
        const responseUpdatePayment = await this.paymentDetailSaleCreditRepository.save(paymentNext);
        console.log("response establecer siguiente pago: ", responseUpdatePayment);

    }

    private async updateBalanceCreditHistory(id: number, paymentAmount: number) {
        var creditHistory = await this.saleCreditHistoryRepository.findOne({ where: { id }, relations: ['credit'] });
        if (creditHistory) {
            creditHistory.balance = creditHistory.balance - paymentAmount;
            const creditHistoryUpdate = await this.saleCreditHistoryRepository.save(creditHistory);
            if (creditHistoryUpdate.balance == 0) {
                this.cancelCredit(creditHistory.credit.id);
            } else {
                this.setStatusActiveCredit(creditHistory.credit.id);
            };
            creditHistory = creditHistoryUpdate;
        };

        return creditHistory;
    }

    private async setStatusActiveCredit(id: number) {
        const credit = await this.saleCreditRepository.findOne(id);
        if (credit) {
            credit.status = StatusCredit.active;
            await this.saleCreditRepository.save(credit);
        }
    }

    private async cancelCredit(id: number) {
        var credit = await this.saleCreditRepository.findOne(id);
        if (credit) {
            credit.status = StatusCredit.canceled;
            await this.saleCreditRepository.save(credit);
        }
    }

    async cancelRegisteredPayment(id: number, userId: number) {
        var response = { success: false, collection: {} };
        var lastCash = await this.cashRepository.findOne({ order: { id: 'DESC' } });
        if (!lastCash || lastCash.closingDate != null) {
            lastCash = (await this.cashService.openCash()).cash;
        }
        var payment = await this.paymentDetailSaleCreditRepository.findOne({ where: { id }, relations: ['creditHistory', 'creditHistory.credit', 'creditHistory.credit.client'] });
        console.log("payment here: ", payment)
        const isPartialPayment = parseFloat(payment.payment.toString()) > parseFloat(payment.actualPayment.toString());
        const actualPayment = payment.actualPayment;
        const amountPaymentPartial = parseFloat((payment.payment - payment.actualPayment).toFixed(2));
        const paymentDate = addDays(payment.paymentDueDate, 1);
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        var concept = 'Cancelación pago de cuota';
        const transaction = await this.registerCreditTransaction(actualPayment, payment, user, lastCash, concept, TransactionType.cancellationPayment);
        var creditTransactionDetail = new CreditTransactionDetail();
        creditTransactionDetail.creditTransaction = transaction;
        creditTransactionDetail.paymentId = payment.id;
        creditTransactionDetail.paymentDueDate = payment.paymentDueDate;
        creditTransactionDetail.paymentDate = payment.paymentDate;
        creditTransactionDetail.payment = payment.payment;
        creditTransactionDetail.actualPayment = payment.actualPayment;
        const responseSaved = await this.creditTransactionDetailRepository.save(creditTransactionDetail);
        payment.actualPayment = 0.00;
        payment.paymentDate = null;
        payment.isNext = true;
        const saved = await this.paymentDetailSaleCreditRepository.save(payment);
        if (saved) {
            response.success = true;
            console.log("amountPaymentPartial: ", amountPaymentPartial);
            console.log("paymentDate: ", paymentDate);
            console.log("isPartialPayment: ", parseFloat(payment.payment.toString()) > parseFloat(payment.actualPayment.toString()));
            if (isPartialPayment) {
                const paymentPartial = await this.paymentDetailSaleCreditRepository.findOne({ where: { paymentId: id } })
                console.log("paymentPartial: ", paymentPartial);
                await this.paymentDetailSaleCreditRepository.delete(paymentPartial.id);
            } else {
                if (payment.creditHistory.credit.numberPayment != 1) await this.updateStatusIsNextPayment(payment.id, false, payment.creditHistory.id);
            }
            const creditHistoryUpdate = await this.updateBalanceCreditHistory(payment.creditHistory.id, (-actualPayment));
        }
        return response;
    }


    async registerCancellationInterestPrincipal(id: number, paymentAmount: number, firstPayment: any, userId: number) {
        var lastCash = await this.cashRepository.findOne({ order: { id: 'DESC' } });
        if (!lastCash || lastCash.closingDate != null) {
            lastCash = (await this.cashService.openCash()).cash;
        }
        let deletePaymentDetail = false;
        var response = { success: false, collection: {} };
        const paymentDetail = await this.paymentDetailSaleCreditRepository
            .createQueryBuilder('paymentsDetail')
            .leftJoinAndSelect('paymentsDetail.creditHistory', 'creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .leftJoinAndSelect('credit.client', 'client')
            .where('paymentsDetail.id = :id', { id })
            .getOne();

        console.log("paymentDetail: ", paymentDetail);
        if (!paymentDetail) {
            throw new NotFoundException(`No se encontro el pago con el id: ${id}`);
        };
        const lastUpdateCreditHistory: any = paymentDetail.creditHistory;
        var principal = parseFloat(lastUpdateCreditHistory.principal);
        if (paymentAmount <= parseFloat(lastUpdateCreditHistory.interest)) {
            principal = principal + (parseFloat(lastUpdateCreditHistory.interest) - paymentAmount)
        } else {
            principal = principal - (paymentAmount - parseFloat(lastUpdateCreditHistory.interest));
        };
        if (paymentDetail.creditHistory.credit.paymentFrequency == 'Un pago') deletePaymentDetail = true;
        var interest = principal * paymentDetail.creditHistory.credit.interestRate / 100;
        const newFirstPayment = new Date(firstPayment);
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        var concept = (paymentAmount > paymentDetail.creditHistory.interest) ? 'Pago de interés y reducción de capital' :
            ((paymentAmount == paymentDetail.creditHistory.interest) ? 'Pago de interés' : 'Pago de interés y capitalización de intereses');
        const transaction = await this.registerCreditTransaction(paymentAmount, paymentDetail, user, lastCash, concept, TransactionType.paymentInterest);
        var newCreditHistory: CreditHistoryCreateDto = {
            date: new Date(),
            principal: principal,
            interest: interest,
            credit: paymentDetail.creditHistory.credit,
            firstPayment: newFirstPayment,
            payDay: this.getDayString(newFirstPayment),
            payment: (principal + interest) / paymentDetail.creditHistory.credit.numberPayment,
            status: StatusCreditHistory.current,
            accounted: false,
            commissionPaymentDetail: null,
            balance: principal + interest
        };
        var payments = [];
        var newPaymentDetail = new PaymentDetailSaleCredit();
        newPaymentDetail.payment = paymentAmount;
        newPaymentDetail.paymentDate = new Date();
        newPaymentDetail.paymentDueDate = paymentDetail.paymentDueDate;
        newPaymentDetail.creditHistory = paymentDetail.creditHistory;
        newPaymentDetail.balance = 0.00;
        newPaymentDetail.accountabilityDate = null;
        newPaymentDetail.recoveryDateCommission = null;
        newPaymentDetail.actualPayment = paymentAmount;
        newPaymentDetail.paymentType = PaymentType.cancellationInterest;
        newPaymentDetail.isNext = false;
        // newPaymentDetail.cash = lastCash;
        console.log("new payment: ", newPaymentDetail);
        console.log("newCreditHistory: ", newCreditHistory);
        const creditHistorySaved = await this.addCreditHistory(newCreditHistory);
        await this.applySurchargeToNewCreditHIstory(paymentDetail.creditHistory.id, creditHistorySaved.id);
        const payment = await this.newPaymentDetail(newPaymentDetail);
        var creditTransactionDetail = new CreditTransactionDetail();
        creditTransactionDetail.creditTransaction = transaction;
        creditTransactionDetail.paymentId = payment.id;
        creditTransactionDetail.paymentDueDate = payment.paymentDueDate;
        creditTransactionDetail.paymentDate = payment.paymentDate;
        creditTransactionDetail.payment = payment.payment;
        creditTransactionDetail.actualPayment = payment.actualPayment;
        const responseSaved = await this.creditTransactionDetailRepository.save(creditTransactionDetail);
        console.log("creditHistorySaved: ", creditHistorySaved);
        if (creditHistorySaved) {
            lastUpdateCreditHistory.status = StatusCreditHistory.notCurrent;
            await this.saleCreditHistoryRepository.save(lastUpdateCreditHistory);
            this.addPaymentDetail(payments, creditHistorySaved, paymentDetail.creditHistory.credit);
            response.success = true;

        }
        if (deletePaymentDetail) await this.paymentDetailSaleCreditRepository.delete(paymentDetail.id);
        return response;
    }

    private async applySurchargeToNewCreditHIstory(creditHistoryIdPrevious: number, creditHistoryIdCurrent: number) {
        const paymentsDetail = await this.paymentDetailSaleCreditRepository.find({
            where: {
                creditHistory: creditHistoryIdPrevious,
                paymentDate: IsNull(),
                numberPayment: Like('%Recargo%')
            },
            relations: ['creditHistory']
        });
        const creditHistory = await this.saleCreditHistoryRepository.findOne({ where: { id: creditHistoryIdCurrent } });
        if (paymentsDetail.length > 0 && creditHistory) {
            var totalSurcharges = 0;
            for (const payment of paymentsDetail) {
                payment.creditHistory = creditHistory;
                await this.paymentDetailSaleCreditRepository.save(payment);
                totalSurcharges = totalSurcharges + parseFloat(payment.payment.toString());
            }
            creditHistory.balance = parseFloat(creditHistory.balance.toString()) + totalSurcharges;
            await this.saleCreditHistoryRepository.save(creditHistory);
        }
    }

    async cancelRegisteredPaymentInterest(id: number, userId: number) {
        var response = { success: false, collection: {} };
        var lastCash = await this.cashRepository.findOne({ order: { id: 'DESC' } });
        if (!lastCash || lastCash.closingDate != null) {
            lastCash = (await this.cashService.openCash()).cash;
        }
        var payment = await this.paymentDetailSaleCreditRepository.findOne({ where: { id }, relations: ['creditHistory', 'creditHistory.credit', 'creditHistory.credit.client'] });
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
        var concept = 'Cancelación pago de interés';
        const transaction = await this.registerCreditTransaction(payment.payment, payment, user, lastCash, concept, TransactionType.cancellationPaymentInterest);
        var creditTransactionDetail = new CreditTransactionDetail();
        creditTransactionDetail.creditTransaction = transaction;
        creditTransactionDetail.paymentId = payment.id;
        creditTransactionDetail.paymentDueDate = payment.paymentDueDate;
        creditTransactionDetail.paymentDate = payment.paymentDate;
        creditTransactionDetail.payment = payment.payment;
        creditTransactionDetail.actualPayment = payment.actualPayment;
        const responseSavedTransaction = await this.creditTransactionDetailRepository.save(creditTransactionDetail);
        console.log("responseSavedTransaction: ", responseSavedTransaction);
        payment.payment = payment.creditHistory.payment;
        payment.paymentDueDate = payment.creditHistory.firstPayment;
        payment.paymentType = 1;
        payment.actualPayment = 0.00;
        payment.paymentDate = null;
        payment.isNext = true;
        const responseUpdatePayment = await this.paymentDetailSaleCreditRepository.save(payment);
        const creditId = payment.creditHistory.credit.id;
        const removeCreditHistoryRenewed = await this.removeCreditHistoryRenewed(creditId);
        if (removeCreditHistoryRenewed) await this.updateStatusCreditHistory(creditId);
        const saved = await this.paymentDetailSaleCreditRepository.save(payment);
        if (responseSavedTransaction && responseUpdatePayment && saved) response.success = true;
        return response;
    }

    async removeCreditHistoryRenewed(id: number) {
        const creditHistory = await this.saleCreditHistoryRepository.createQueryBuilder('creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .where('creditHistory.status =:status AND credit.id =:id', { status: 1, id })
            .orderBy('creditHistory.date', 'DESC')
            .getOne();
        const responseRemoveCreditHistoryRenewed = await this.saleCreditHistoryRepository.delete(creditHistory.id);
        console.log("responseRemoveCreditHistoryRenewed: ", responseRemoveCreditHistoryRenewed);
        return responseRemoveCreditHistoryRenewed;
    }

    async updateStatusCreditHistory(id: number) {
        const creditHistory = await this.saleCreditHistoryRepository.createQueryBuilder('creditHistory')
            .leftJoinAndSelect('creditHistory.credit', 'credit')
            .where('creditHistory.status =:status AND credit.id =:id', { status: 2, id })
            .orderBy('creditHistory.date', 'DESC')
            .getOne();
        console.log("creditHistory: ", creditHistory);
        creditHistory.status = 1;
        const responseUpdateCreditHistory = await this.saleCreditHistoryRepository.save(creditHistory);
        console.log("responseUpdateCreditHistory: ", responseUpdateCreditHistory);

    }

    private async createTransaction(credit: SaleCredit, cash: Cash, amount: number, user: User) {
        var newTransaction = new CreditTransactionCreateDto(credit.client, credit, cash, amount, 'Crédito Venta', TransactionType.credit, user, true);
        const response = await this.cashService.createTransaction(newTransaction);
        return response;
    }

    private async newPaymentDetail(newPaymentDetail: PaymentDetailSaleCredit) {
        const paymentDetail = this.paymentDetailSaleCreditRepository.create(newPaymentDetail);
        return await this.paymentDetailSaleCreditRepository.save(paymentDetail);
    }

    async getTransactions(id: number) {
        const transactions = await this.creditTransactionRepository.createQueryBuilder('creditTransactions')
            .leftJoinAndSelect('creditTransactions.client', 'client')
            .leftJoinAndSelect('creditTransactions.saleCredit', 'credit')
            .where('creditTransactions.sale_credit_id = :id', { id })
            .getMany();
        //console.log("transactions: ", transactions);
        return transactions.sort((a, b) => {
            if (a.date.getTime() !== b.date.getTime()) {
                return b.date.getTime() - a.date.getTime();
            }
        }).map(x => {
            return new CreditTransactionDto(x, x.saleCredit);
        })
    }

    async reschedulePayment(id: number, newDate: Date) {
        const payment = await this.paymentDetailSaleCreditRepository.findOne(id);
        if (payment) {
            payment.paymentDueDate = newDate;
            await this.paymentDetailSaleCreditRepository.save(payment);
        }
    }

    async addPaymentSurcharge(id: number, payment: number, paymentDueDate: any) {
        var response = { success: true, error: '' }
        const creditHistory = await this.saleCreditHistoryRepository.findOne(id);
        var detail = new PaymentDetail();
        detail.payment = payment;
        detail.paymentDueDate = new Date(paymentDueDate);
        detail.paymentDate = null;
        detail.creditHistory = creditHistory;
        detail.actualPayment = 0.00;
        detail.paymentType = PaymentType.paymentInstallments;
        detail.isNext = false;
        detail.numberPayment = 'Recargo';
        const paymentDetail = this.paymentDetailSaleCreditRepository.create(detail);
        const responsePaymentDetail = await this.paymentDetailSaleCreditRepository.save(paymentDetail);
        console.log("guardando recargo: ", responsePaymentDetail);
        if (responsePaymentDetail) {
            await this.updateBalanceCreditHistory(id, -payment);
            response.success = true;
        }
        return response;
    }

    async updatePayment(id: number, payment: number, concept: string, userId: number) {
        var response = { success: false, error: '' };
        console.log("concept: ", concept);
        if (concept == 'cuota') {
            const cancelPaymentResponse = await this.cancelRegisteredPayment(id, userId);
            console.log("cancelPaymentResponse: ", cancelPaymentResponse);
            if (cancelPaymentResponse) {
                const registerResponse = await this.registerTrasactionAndPayment(id, payment, userId);
                console.log("registerResponse: ", registerResponse);
                if (registerResponse.success) response.success = true;
            }
        } else {
            const credit = (await this.paymentDetailSaleCreditRepository.findOne({ where: { id }, relations: ['creditHistory', 'creditHistory.credit'] }));
            console.log("credit: ", credit);
            const creditHistory = await this.saleCreditHistoryRepository.findOne({ where: { credit: credit.creditHistory.credit.id, status: 1 } });
            console.log("creditHistory: ", creditHistory);
            const firstPayment = creditHistory.firstPayment;
            const cancelPaymentInterestResponse = await this.cancelRegisteredPaymentInterest(id, userId);
            console.log("cancelPaymentInterestResponse: ", cancelPaymentInterestResponse);
            if (cancelPaymentInterestResponse) {
                const registerResponse = await this.registerCancellationInterestPrincipal(id, payment, firstPayment, userId);
                console.log("registerResponse: ", registerResponse);
                if (registerResponse.success) response.success = true;
            }
        }

        return response;
    }

}
