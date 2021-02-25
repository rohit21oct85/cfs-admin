import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios'
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';
import {SubjectContext} from '../../context/SubjectContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

export default function CreateAdmin() {
    const history = useHistory();
    const params = useParams();
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {state: sState, dispatch: sDispatch} = useContext(SubjectContext);

    const [formData, setFormData] = useState("");

    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        if(formData == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Enter Subject Name'});
        }else{
            if(params.id){
                response = await api.patch(`subject/update/${params.id}`,formData);
            }else{
                response = await api.post('subject/create',formData);
            }
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            history.push('/subject');
        }
    }
    async function handelChange(e){
        const data = e.target.value;
        const subject = data.replace(/[^a-zA-Z0-9, ]/g, "");
        setFormData({...formData, subject: subject});
    }
    const {response} = useAxios({
        method: 'get', url: `subject/view/${params.id}`
    });
    const [subject, setSubject] = useState('');
    useEffect( () => {
        if(response !== null){
            const subRes = response.data;
            sDispatch({type: 'SET_SUBJECT', payload: subRes});
            if(sState){
                setSubject(subRes.subject)
            }
        }   
    },[params.id, response])
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    },[errorState.error, errorState.success])

return (

    <>
    {state.isLoggedIn && errorState && (
    
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Create New Admin</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/master-admin`} className="btn btn-sm dark">
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
                                <Form.Label>Admin Full Name</Form.Label>
                                <Form.Control name="fullname" autoComplete="off"
                                defaultValue={subject}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Admin Name"/>
                            </Form.Group>
                                
                            <Form.Group method="POST">
                                <Form.Label>Admin Email</Form.Label>
                                <Form.Control name="email" autoComplete="nope"
                                defaultValue={subject}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Admin Email"/>
                            </Form.Group>
                                
                            <Form.Group method="POST">
                                <Form.Label>Admin Password</Form.Label>
                                <Form.Control name="password" autoComplete="off"
                                type="password"
                                defaultValue={subject}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Admin Password"/>
                            </Form.Group>

                            <div className="row">
                                <div class="col-md-6">
                                    <label> Role</label>
                                    <select className="form-control" name="role">
                                        <option>Select Role</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-6">
                                    <label> Status</label>
                                    <select className="form-control" name="role">
                                        <option>Select Stauts</option>
                                        <option value="true">Active</option>
                                        <option value="false">InActive</option>
                                    </select>
                                </div>
                                
                            </div>

                            <Form.Group className="mt-3">
                                <Button 
                                onClick={handleSubmit}
                                className="btn dark btn-sm">
                                    {params.id ? 'Update Admin':'Save Admin'}
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
