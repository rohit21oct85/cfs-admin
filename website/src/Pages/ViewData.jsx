import React, {useContext,useState, useEffect} from 'react'
import './mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'

import useGeneratePassword from '../hooks/useGeneratePassword'

import {AuthContext} from '../context/AuthContext';
import {ErrorContext} from '../context/ErrorContext';
import {Notification} from '../components/Notification';

export default function ViewData() {
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
        },[errorState.error, errorState.success]);
    const [formData, setFormData] = useState({});
    useEffect(() => {
        setFormData({...formData, password: ''});
    },[params.id, params.method, params.module]);
    const handelChange = async (e) => {
        const data = e.target.value;
        setFormData({...formData, [e.target.name]: data});
    }
    

    const handleSubmit = async () => {
        let response = null;
        if(formData.password == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Enter password to view this resource'});
        }else{
            if(formData.password === 'wrongpassword'){
                history.push(`/master-module/password/${params.rmodule}/${params.id}`);
            }else{
                errorDispatch({type: 'SET_ERROR', payload: "you have entered a Wrong Password"});    
            }
        }
    }    
return (
    <>
    {state.isLoggedIn && errorDispatch &&   (
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2 style={{ textTransform: 'uppercase'}}>{params.method} Data</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/${params.module}`} className="btn btn-sm dark">
                        <span className="fa fa-arrow-left"></span>
                        </Link>
                        </div>

                        <div className="col-md-12 no-gutter p-0 mt-2">
                        {errorState.error && ( 
                            <Notification>{errorState.error}</Notification>
                        )}
                            
                        {errorState.success && ( 
                            <Notification>{errorState.success}</Notification>
                        )}
                        <Form autoComplete="off" className="col-md-6 p-0">
                            <Form.Group method="POST">
                                <Form.Label>View Password </Form.Label>
                                <Form.Control 
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    onChange={handelChange}
                                    onKeyDown={ 
                                    (event) => {
                                            if(event.key === 'Enter'){
                                                event.preventDefault()
                                            }
                                        }
                                    } 
                                    placeholder="Enter Password to view this Resource"/>
                            </Form.Group>
                            
                            <Form.Group className="mt-3">
                                <Button 
                                onClick={handleSubmit}
                                className="btn dark btn-sm">
                                    View Resource
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
