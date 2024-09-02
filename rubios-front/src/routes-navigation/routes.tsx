import Navbar from "../components/navbar/navbar";
import Home from '../components/home/home';
import CreditList, { PersonalCreditList } from '../components/personal-credit/personal-credit-list';
import { Route, Routes, createBrowserRouter } from "react-router-dom";
import PersonalCreditCreate from '../components/personal-credit/personal-credit-create';
import { PersonalCreditEdit } from '../components/personal-credit/personal-credit-edit';
import UserList from "../components/user/user-list";
import UserCreate from "../components/user/user-create";
import UserEdit from "../components/user/user-edit";
import Login from "../components/login/login";
import { useAppSelector } from "../redux/hooks/hooks";
import { RootState } from '../redux/store/store';
import ClientList from "../components/client/client-list";
import ClientCreate from "../components/client/client-create";
import ClientEdit from "../components/client/client-edit";
import CategoriesList from "../components/categories/categories-list";
import { CategoryCreate } from "../components/categories/category-create";
import CategoryEdit from "../components/categories/category-edit";
import ProductCreate from "../components/product/product-create";
import ProductList from "../components/product/product-list";
import ProductEdit from "../components/product/product-edit";
import ProductDetail from '../components/product/product-detail';
import { InventoryEdit } from "../components/product/inventary-edit";
import  DetailsChargesAndAccountedCollectionsTotal  from "../components/accountability-collections/charges-accounted-collections-list";
import  CollectionsAccountDetail from "../components/accountability-collections/collections-to-account-detail";
import { CommissionsTotalDebtCollector } from "../components/commissions/commissions-list-debt-Collector";
import CommissionsCreditsDetail from "../components/commissions/commission-credit-detail";
import CollectionsAccountedHistory from "../components/accountability-collections/collections-accounted-history";
import CommissionsHistoryList from "../components/commissions/commissions-history-list";
import SaleCreate from "../components/sale/sale-create";
import SaleCancel from "../components/sale/sale-cancel";
import SaleList from "../components/sale/sale-list";
import SaleDetail from "../components/sale/sale-detail";
import SaleCreditList from "../components/sale-credit/sale-credit-list";
import { SaleCreditEdit } from "../components/sale-credit/sale-credit-edit";
import PersonalCreditMyCollections from "../components/personal-credit/personal-credit-my-collections";
import SaleCreditMyCollections from "../components/sale-credit/sale-credit-my-collections";
import { LoanCapitalReport } from "../components/reports/loan-capital-report";
import Reports from "../components/reports/report";
import Cash from "../components/cash/cash";
import MonthlyCreditReport from "../components/reports/monthly-credit-report";
import CreditsDebtCollectorReport from "../components/reports/credits-debtcollector-report";
import MonthlyCreditAmountReport from "../components/reports/monthly-credit-amount-report";
import ProductsReport from "../components/reports/products-report";
import PersonalCreditPaid from "../components/personal-credit/personal-credit-paid";
import UnpaidClients from "../components/reports/unpaid-clients";
import ExpiredCreditReport from "../components/reports/expired-credits-report";
import UnpaidTotalsReport from "../components/reports/unpaid-totals-report";

export const RouterNavigation = () => {
    const { userRole } = useAppSelector((state: RootState) => state.users);
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/personal-credit-list" element={<PersonalCreditList />} />
            {userRole == 'admin' ? <Route path="/personal-credit-create" element={<PersonalCreditCreate/>} />: ('')}
            {userRole == 'admin' ? <Route path="/personal-credit/:id/edit" element={<PersonalCreditEdit />} />: ('')}
            <Route path="/personal-credit-my-collections" element={<PersonalCreditMyCollections />} />
            <Route path="/personal-credit-my-paid" element={<PersonalCreditPaid />} />
            {userRole == 'admin' ? <Route path="/users" element={<UserList />} /> : ('')}
            {userRole == 'admin' ? <Route path="/user-create" element={<UserCreate />} />: ('')}
            {userRole == 'admin' ? <Route path="/user/:id/edit" element={<UserEdit />} />: ('')}
            {userRole == 'admin' ? <Route path="/clients/:type" element={<ClientList />} />: ('')}
            {userRole == 'admin' ? <Route path="/client-create/:type" element={<ClientCreate />} />: ('')}
            {userRole == 'admin' ? <Route path="/client-edit/:type/:id" element={<ClientEdit />} />: ('')}
            {userRole == 'admin' ? <Route path="/categories" element={<CategoriesList />} />: ('')}
            {userRole == 'admin' ? <Route path="/category-create" element={<CategoryCreate />} />: ('')}
            {userRole == 'admin' ? <Route path="/category/:id/edit" element={<CategoryEdit />} />: ('')}
            {userRole == 'admin' ? <Route path="/products" element={<ProductList />} />: ('')}
            {userRole == 'admin' ? <Route path="/product-create" element={<ProductCreate />} />: ('')}
            {userRole == 'admin' ? <Route path="/product/:id/edit" element={<ProductEdit />} />: ('')}
            {userRole == 'admin' ? <Route path="/product/:id/detail" element={<ProductDetail />} />: ('')}
            {userRole == 'admin' ? <Route path="/product/:id/edit-inventory" element={<InventoryEdit />} />: ('')}
            {userRole == 'admin' ? <Route path="/charges-collections/:type" element={<DetailsChargesAndAccountedCollectionsTotal />} />: ('')}
            {userRole == 'admin' ? <Route path="/collections/:type/:id/detail/:previous" element={<CollectionsAccountDetail />} />: ('')}
            {userRole == 'admin' ? <Route path="/collections-accounted/:type/:id/history" element={<CollectionsAccountedHistory />} />: ('')}
            {userRole == 'admin' ? <Route path="/commissions/:type" element={<CommissionsTotalDebtCollector />} />: ('')}
            {userRole == 'admin' ? <Route path="/commissions/:type/:id/detail" element={<CommissionsCreditsDetail />} />: ('')}
            {userRole == 'admin' ? <Route path="/commissions/:type/:id/history" element={<CommissionsHistoryList />} />: ('')}
            {userRole == 'admin' ? <Route path="/sale-create" element={<SaleCreate />} />: ('')}
            {userRole == 'admin' ? <Route path="/sale/:id/cancel" element={<SaleCancel />} />: ('')}
            {userRole == 'admin' ? <Route path="/sales" element={<SaleList />} />: ('')}
            {userRole == 'admin' ? <Route path="/sale/:id/detail" element={<SaleDetail />} />: ('')}
            <Route path="/sale-credits" element={<SaleCreditList />} />
            {userRole == 'admin' ? <Route path="/sale-credit/:id/edit" element={<SaleCreditEdit />} />: ('')}
            <Route path="/sale-credit-my-collections" element={<SaleCreditMyCollections />} />
            {userRole == 'admin' ? <Route path="/loan-principal-report" element={<LoanCapitalReport />} />: ('')}
            {userRole == 'admin' ? <Route path="/reports" element={<Reports />} />: ('')}
            {userRole == 'admin' ? <Route path="/monthly-credit-report" element={<MonthlyCreditReport />} />: ('')}
            {userRole == 'admin' ? <Route path="/monthly-credit-amount-report" element={<MonthlyCreditAmountReport />} />: ('')}            
            {userRole == 'admin' ? <Route path="/credits-debtcollector-report" element={<CreditsDebtCollectorReport />} />: ('')}
            {userRole == 'admin' ? <Route path="/expired-credits-report" element={<ExpiredCreditReport />} />: ('')}
            {userRole == 'admin' ? <Route path="/products-report" element={<ProductsReport />} />: ('')}
            {userRole == 'admin' ? <Route path="/unpaid-clients" element={<UnpaidClients />} />: ('')}
            {userRole == 'admin' ? <Route path="/unpaid-totals" element={<UnpaidTotalsReport />} />: ('')}
            
            {userRole == 'admin' ? <Route path="/cash" element={<Cash />} />: ('')}
            <Route path="/login" element={<Login />} />
        </Routes>
    )
}

export default RouterNavigation;


