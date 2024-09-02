import { Col, Container, Row } from "react-bootstrap";
import { Outlet, RouterProvider, useNavigate } from "react-router-dom";
import RouterNavigation from '../../routes-navigation/routes';
import { MenuNavBar } from "../navbar/navbar";

export const Layout = () => {

    
    return (
        <Container fluid>
            <MenuNavBar/>
            <Outlet />
        </Container >
    );
}

export default Layout;