import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../../role/entities/role.entity';
import { Credit } from 'src/credit/entities/credit.entity';
import { CreditTransaction } from 'src/cash/entities/credit-transaction.entity';
import { SaleCredit } from 'src/sale-credit/entities/sale-credit.entity';
import { Revenue } from 'src/cash/entities/revenue.entity';
import { Expense } from 'src/cash/entities/expense.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  lastName: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column()
  userName: string;

  @Column()
  refreshToken: string;

  @ManyToOne(() => Role, (role: Role) => role.users)
  @JoinColumn({ name: 'role' }) // Nombre de la columna que contiene la clave foránea a la tabla Role
  role: Role;

  @OneToMany(() => Credit, (credit) => credit.debtCollector)
  credits: Credit[];

  @OneToMany(() => SaleCredit, (credit) => credit.debtCollector)
  saleCredits: SaleCredit[];

  @OneToMany(() => CreditTransaction, (transaction) => transaction.user)
  transactions: CreditTransaction[];

  @OneToMany(() => Revenue, (revenue) => revenue.user)
  revenues: Revenue[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

}
