import React , {useEffect,useState} from 'react'
import {Row,Col} from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'

export const Notification = ({children}) => {
    const [show, setShow] = useState(false);
    useEffect( () =>{
        setShow(true);
    },[show])

    return (
        <Row>
        <Col xs={6} className="">
        <Alert variant="info" onClose={() => setShow(false)} dismissible>
            {children}
        </Alert>
        </Col>
        </Row>
    );
}