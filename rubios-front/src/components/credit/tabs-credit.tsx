import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, NavItem, NavLink, TabContent, TabPane } from "react-bootstrap";
 
interface TabsCreditOptionsProps{
    active: string,
    setActive: (active:string)=> void;
}

export const TabsCreditOptions = ({active, setActive}: TabsCreditOptionsProps) => {
    const [activeTab, setActiveTab] = useState(active);                                         
    const toggleTab = (tab: any) => {
      if (activeTab !== tab) {
        setActiveTab(tab);
        setActive(tab);
      }
    };
  
    return (
      <div className="mb-2">
        <Nav className="row d-flex">
          <NavItem className={`col-4 justify-content-center align-items-center d-flex border border-1 cursor-hand ${activeTab === 'history' ? 'active bg-secondary' : 'bg-transapent'}`}
          onClick={() => toggleTab('history')}
          >
            <NavLink              
            >
              <h5 className={`d-none d-lg-block ${activeTab === 'history' ? 'text-white' : 'text-dark'}`}>Historial Renovaciones</h5>
              <h6 className={`d-lg-none ${activeTab === 'history' ? 'text-white' : 'text-dark'}`}>Historial</h6>
            </NavLink>
          </NavItem>
          <NavItem className={`col-4 justify-content-center align-items-center d-flex border border-1 cursor-hand ${activeTab === 'transactions' ? 'active bg-secondary' : 'bg-transapent'}`}
          onClick={() => toggleTab('transactions')}
          >
            <NavLink
            >
               <h5 className={`d-none d-lg-block ${activeTab === 'transactions' ? 'text-white' : 'text-dark'}`}>Transacciones</h5>
               <h6 className={`d-lg-none ${activeTab === 'transactions' ? 'text-white' : 'text-dark'}`}>Transacc.</h6>              
            </NavLink>
          </NavItem>
          <NavItem className={`col-4 justify-content-center align-items-center d-flex border border-1 cursor-hand ${activeTab === 'paymentBhavior' ? 'active bg-secondary' : 'bg-transapent'}`}
          onClick={() => toggleTab('paymentBhavior')}>
            <NavLink
            >
              <h5 className={`d-none d-lg-block ${activeTab === 'paymentBhavior' ? 'text-white' : 'text-dark'}`}>Comportamiento de pago</h5>
               <h6 className={`d-lg-none ${activeTab === 'paymentBhavior' ? 'text-white' : 'text-dark'}`}>Comportam.</h6>  
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  };
  
  export default TabsCreditOptions;