import React, {useContext,useState, useEffect} from 'react'
import './mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../Helper/ApiHelper.jsx';

import useGeneratePassword from '../hooks/useGeneratePassword'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

import {AuthContext} from '../context/AuthContext';
import {AdminContext} from '../context/AdminContext';
import {ErrorContext} from '../context/ErrorContext';
import {Notification} from '../components/Notification';

export default function DeleteData() {
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {dispatch: adminDispatch} = useContext(AdminContext);
    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    const [formData, setFormData] = useState('');
    
    useEffect(() => {
        setFormData({...formData, id: params.id, method: params.method, module: params.module, password: ''});
    },[params.id, params.method, params.module]);

    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
        },[errorState.error, errorState.success]);
        
        const handelChange = async (e) => {
            const data = e.target.value;
            setFormData({...formData, [e.target.name]: data});
        }
    const {randomPassword} = useGeneratePassword();

    const handleSubmit = async () => {
        let response = null;
        if(formData.password == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Enter password to delete this resource'});
        }else{
            response = await api.post('/master-delete/check-password',formData);
            console.log(response.data);
            if(response.data.status === true){
                await api.del(`/${formData.module}/${formData.method}/${formData.id}`);
                const id = response.data.data;
                const changePasswordData = {'module_password': randomPassword, 'module_plain_password': randomPassword};
                await api.patch(`/master-delete/update/${id}`,changePasswordData);
                const path = formData.module;
                history.push(`/${path}`);
            }else{
                errorDispatch({type: 'SET_ERROR', payload: response.data.message});    
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
                        <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
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
                                <Form.Label>Delete Password </Form.Label>
                                <Form.Control 
                                    name="password"
                                    autoComplete="off"
                                    onChange={handelChange}
                                    onKeyDown={ 
                                    (event) => {
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
