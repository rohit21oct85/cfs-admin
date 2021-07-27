import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import useAxios from '../../hooks/useAxios'
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';
import {AdminContext} from '../../context/AdminContext';

import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import useRoles from '../../hooks/useRoles';


export default function CreateRole() {
    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {data: roleData } = useRoles();
    const [formData, setFormData] = useState("");

    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    };
    
    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        // console.log(formData); 
        // // return;
        
        if(formData == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Enter Subject Name'});
        }else{
            if(params.id){
                response = await axios.patch(`${API_URL}master-role/update/${params.id}`,formData, options);
            }else{
                formData.role = roleData.length+1
                response = await axios.post(`${API_URL}master-role/create`,formData, options);
            }
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            history.push('/master-role');
        }
    }
    async function handelChange(e){
        const data = e.target.value;
        const filedValue = data.replace(/[^a-zA-Z0-9, ]/g, "");
        setFormData({...formData, [e.target.name]: filedValue});
    }

    const {response} = useAxios({
        method: 'get', url: `master-role/view/${params.id}`
    });
    const [role, setRole] = useState('');
    useEffect( () => {
        if(response !== null){
            const roleRes = response.data;
            adminDispatch({type: 'SET_ROLE', payload: roleRes});
            setRole(roleRes)
        }   
    },[params.id, response, role])
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
    {state.isLoggedIn && errorState && adminState.role && (
    
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Create New Admin</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/master-role`} className="btn btn-sm dark">
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
                                <Form.Label>Role Name</Form.Label>
                                <Form.Control name="name" autoComplete="off"
                                defaultValue={role.name}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Role Name"/>
                            </Form.Group>
                                
                            <Form.Group method="POST">
                                <Form.Label>Role Description</Form.Label>
                                <Form.Control name="description" autoComplete="off"
                                defaultValue={role.description}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter role description"/>
                            </Form.Group>
                            <Form.Group method="POST">
                                <Form.Label>Role No</Form.Label>
                                <Form.Control name="role" autoComplete="off"
                                value={role.role ?? roleData.length+1}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter role description"/>
                            </Form.Group>
                                
                           
                            <Form.Group className="mt-3">
                                <Button 
                                onClick={handleSubmit}
                                className="btn dark btn-sm">
                                    {params.id ? 'Update Role':'Save Role'}
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
