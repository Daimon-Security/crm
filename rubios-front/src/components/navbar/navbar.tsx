import { Button, Modal, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { MdOutlineLogin } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { login, logout } from '../../redux/slices/auth-slice';
import { RootState } from '../../redux/store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setLoggedUser } from '../../redux/slices/user-slice';
import { lastCash } from '../../redux/slices/cash-slice';
import ModalCustomMessage from '../custom-message/modal-custom-message';
import Loading from '../common/loading';
import { MessageSystemCash } from '../common/message-system-cash';

export const MenuNavBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticate, token } = useAppSelector((state: RootState) => state.auth);
  const { userName, userRole } = useAppSelector((state: RootState) => state.users);
  const { opening, isLoading, message, cash } = useAppSelector((state: RootState) => state.cash);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const name = "Rubio's v:2.36"
  //const name = "Finan v:2.27"
  const handleToggleMenu = () => {
    setMenuExpanded(!menuExpanded);
  };

  const handleLogout = () => {
    dispatch(logout());
    setMenuExpanded(false);
  }

  function displayMessageCash() {
    if (!opening) setShowMessage(true);
  }

  function closeMessage() {
    setShowMessage(false);
  }



  useEffect(() => {
    if (!isAuthenticate && !token) {
      dispatch(lastCash());
      const loggedUser = JSON.parse(window.localStorage.getItem('loggedUser') || '{}')
      if (loggedUser && Object.keys(loggedUser).length != 0) {
        dispatch(login(loggedUser));
        dispatch(setLoggedUser({ userName: loggedUser.userName, role: loggedUser.role }));
      } else {

        navigate('/login');
      }
    }
  }, [userName, token, isAuthenticate])

  return (
    <>
      <Navbar expand="lg"
        className="bg-body-tertiary shadow p-3 mb-4 bg-white rounded d-flex justify-content-between fw-bold"
        expanded={menuExpanded} >
        <Navbar.Brand href="/" className="d-none d-lg-block">
          {/* Logo para vista web */}
          <img src={require('../../assets/logo2.jpg')} alt="Logo" height="30" />{name}
        </Navbar.Brand>
        <Container className={`${isAuthenticate ? 'd-block' : 'd-none'}`}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='me-3' onClick={handleToggleMenu} />
          <Navbar.Brand href="/" className="mx-end d-lg-none ms-3">
            {/* Logo para vista de teléfono móvil */}
            <img src={require('../../assets/logo2.jpg')} alt="Logo" height="30" />{name}</Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <div className='d-lg-none d-block mt-2'>
                <Nav.Link>Hola, {userName}</Nav.Link>
                <Nav.Link href="·"><hr></hr></Nav.Link>
              </div>
              {userRole == 'admin' ? <Nav.Link href="/cash">Caja</Nav.Link> : ('')}
              {userRole == 'admin' ? <Nav.Link href="/users">Usuarios</Nav.Link> : ('')}
              {userRole == 'admin' ? <NavDropdown title="Clientes" id="basic-nav-dropdown">
                <NavDropdown.Item href="/clients/1">Por Créditos</NavDropdown.Item>
                <NavDropdown.Item href="/clients/2">Por Ventas</NavDropdown.Item>
              </NavDropdown> : ('')}
              <NavDropdown title="Créditos" id="basic-nav-dropdown">
                <NavDropdown.Item href={`${opening ? '/personal-credit-list' : ''}`} onClick={displayMessageCash}>Personales</NavDropdown.Item>
                <NavDropdown.Item href={`${opening ? '/sale-credits' : ''}`} onClick={displayMessageCash}>Venta</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Cobranzas" id="basic-nav-dropdown">
                <NavDropdown.Item href={`${opening ? '/personal-credit-my-collections' : ''}`} onClick={displayMessageCash}>A cobrar Personales</NavDropdown.Item>
                <NavDropdown.Item href={`${opening ? '/sale-credit-my-collections' : ''}`} onClick={displayMessageCash}>A cobrar por Venta</NavDropdown.Item>
              </NavDropdown>
              {userRole == 'admin' ? <NavDropdown title="Productos" id="basic-nav-dropdown">
                <NavDropdown.Item href="/products">Productos</NavDropdown.Item>
                <NavDropdown.Item href="/categories">Categorías</NavDropdown.Item>
              </NavDropdown> : ('')}
              {userRole == 'admin' ? <NavDropdown title="Rendiciones" id="basic-nav-dropdown">
                <NavDropdown.Item href={`${opening ? '/charges-collections/1' : ''}`} onClick={displayMessageCash}>Créditos Personales</NavDropdown.Item>
                <NavDropdown.Item href={`${opening ? '/charges-collections/2' : ''}`} onClick={displayMessageCash}>Créditos por Venta</NavDropdown.Item>
              </NavDropdown> : ('')}
              {userRole == 'admin' ? <NavDropdown title="Comisiones" id="basic-nav-dropdown">
                <NavDropdown.Item href={`${opening ? '/commissions/1' : ''}`} onClick={displayMessageCash}>Créditos Personales</NavDropdown.Item>
                <NavDropdown.Item href={`${opening ? '/commissions/2' : ''}`} onClick={displayMessageCash}>Créditos por Venta</NavDropdown.Item>
              </NavDropdown> : ('')}
              {userRole == 'admin' ? <Nav.Link href={`${opening ? '/sales' : ''}`} onClick={displayMessageCash}>Ventas</Nav.Link> : ('')}
              {userRole == 'admin' ? <NavDropdown title="Informes" id="basic-nav-dropdown">
                <NavDropdown.Item href="/reports">Estadisticas</NavDropdown.Item>
                <NavDropdown.Item href="/monthly-credit-report">Créditos por mes</NavDropdown.Item>
                <NavDropdown.Item href="/monthly-credit-amount-report">Cantidad prestada por mes</NavDropdown.Item>
                <NavDropdown.Item href="/credits-debtcollector-report">Créditos por cobrador</NavDropdown.Item>
                <NavDropdown.Item href="/expired-credits-report">Créditos vencidos</NavDropdown.Item>
                <NavDropdown.Item href="/products-report">Productos más vendidos</NavDropdown.Item>
                <NavDropdown.Item href="/unpaid-clients">Clientes morosos</NavDropdown.Item>
                <NavDropdown.Item href="/unpaid-totals">Totales a cobrar</NavDropdown.Item>
              </NavDropdown> : ('')}
              <div className='d-lg-none d-block'>
                <Nav.Link href="·"><hr></hr></Nav.Link>
                {/* <Nav.Link href="#">Mi cuenta</Nav.Link> */}
                <Nav.Link onClick={handleLogout}>Cerrar sesión <MdOutlineLogin /></Nav.Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
        {isAuthenticate ? (
          <div className='px-5'>
            <NavDropdown title={`Hola, ${userName}`} id="basic-nav-dropdown" className={`d-none d-lg-block d-md-block ${isAuthenticate ? 'd-block' : 'd-none'}`}>
              {/* <NavDropdown.Item href="#action/3.2">
          Mi cuenta
        </NavDropdown.Item> */}
              {/* <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          <NavDropdown.Divider /> */}
              <hr className="dropdown-divider d-lg-none"></hr>
              <NavDropdown.Item onClick={handleLogout}>
                Cerrar sesión <MdOutlineLogin />
              </NavDropdown.Item>
            </NavDropdown>
          </div>)
          : ('')}
        <Navbar.Brand href="/" className={`d-flex justify-content-center ${!isAuthenticate ? 'd-block d-lg-none' : 'd-none'}`}>
          <img src={require('../../assets/logo2.jpg')} alt="Logo" height="30" />{name}</Navbar.Brand>
        {/* <Nav.Link href="/login" className={`${!isAuthenticate ? 'd-block' : 'd-none'}`} >
          <button type='button' className='btn btn-outline-primary btn-sm'>Ingresar</button>
        </Nav.Link> */}
      </Navbar>

      <MessageSystemCash showMessage={showMessage} isLoading={isLoading} cash={cash} message={message} closeMessage={closeMessage}/>
    </>

  );
}

export default MenuNavBar;