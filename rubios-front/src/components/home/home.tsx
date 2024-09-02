import { Col, Row } from 'react-bootstrap';
import '../styles.css';

export const Home = () => {
    return (
        <>
            <Row className='d-flex justify-content-center align-items-center'>
                <Col lg={12} xs={9} className='d-flex justify-content-center mt-5'>
                    <img src={require('../../assets/logo2.jpg')} alt="Logo" height="300"  width={300} />
                </Col>
            </Row>
            <Row className='d-flex justify-content-center'>
                <Col className="logo-text text-center" lg={4}>Rubio's</Col>
            </Row>
        </>
    )
}

export default Home;