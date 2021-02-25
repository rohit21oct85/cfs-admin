import React, {useContext,useState, useEffect} from 'react'
import './mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../Helper/ApiHelper.jsx';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

import {AuthContext} from '../context/AuthContext';

export default function DeleteData() {

    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    const [formData, setFormData] = useState('');
    const handelChange = async (e) => {
        const data = e.target.value;
        setFormData({...formData, [e.target.name]: data});
    }

    const handleSubmit = async () => {
        console.log(formData);
    }
    useEffect(() => {
        console.log(params)
    },[params.id, params.method, params.module]);

return (
    <>
    {state.isLoggedIn &&  (
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Delete Data</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/${params.module}`} className="btn btn-sm dark">
                        <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
                        </Link>
                        </div>
                        <div className="col-md-12 no-gutter p-0 mt-2">
                        
                        <Form autoComplete="off" className="col-md-6 p-0">
                            <Form.Group method="POST">
                                <Form.Label>Delete Password </Form.Label>
                                <Form.Control 
                                    name="del_password"
                                    autoComplete="off"
                                    onChange={handelChange}
                                    onKeyDown={ 
                                    event => {
                                            if(event.key === 'Enter'){
                                                event.preventDefault()
                                            }
                                        }
                                    } 
                                    placeholder="Enter Password to delete this Resource"/>
                            </Form.Group>
                            
                            <Form.Group className="mt-3">
                                <Button 
                                onClick={handleSubmit}
                                className="btn dark btn-sm">
                                    Delete Resource
                                </Button>
                            </Form.Group>
                        </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
        
    )}  
    </>

)
}
