import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios'
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';
import {AdminContext} from '../../context/AdminContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

export default function CreateModule() {
    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);

    const [formData, setFormData] = useState("");

    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        // return;
        if(formData.module_name == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Enter Module Name'});
        }else{
            if(params.id){
                response = await api.patch(`master-module/update/${params.id}`,formData);
            }else{
                response = await api.post('master-module/create',formData);
            }
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            history.push('/master-module');
        }
    }
    async function handelChange(e){
        const data = e.target.value;
        const filedValue = data.replace(/[^a-zA-Z0-9, ]/g, "");
        setFormData({...formData, [e.target.name]: filedValue});
    }

    const {response} = useAxios({
        method: 'get', url: `master-module/view/${params.id}`
    });
    
    const {response:roleResponse} = useAxios({
        method: 'get', url: `master-role/view-all`
    });

    const [module, setModule] = useState('');
    useEffect( () => {
        if(response !== null){
            const modRes = response.data;
            adminDispatch({type: 'GET_MODLIST', payload: modRes});
            if(adminState){
                setModule(modRes)
            }
        }   
        if(roleResponse !== null){
            console.log(roleResponse)
            const RolesResponse = roleResponse.data;
            adminDispatch({type: 'GET_ALL_ROLE', payload: RolesResponse});
        }
    },[response,module,roleResponse]);

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
    {state.isLoggedIn && (
    
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Create New Module</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/master-module`} className="btn btn-sm dark">
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
                                <Form.Label>Module Name</Form.Label>
                                <Form.Control name="module_name" autoComplete="off"
                                defaultValue={module.module_name}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Module Name"/>
                            </Form.Group>
                                
                            <Form.Group method="POST">
                                <Form.Label>Module Description</Form.Label>
                                <Form.Control name="description" autoComplete="off"
                                defaultValue={module.description}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Module description"/>
                            </Form.Group>
                            
                            <Form.Group method="POST">
                                <Form.Label>Module Access</Form.Label>
                                <select name="role_access" className="form-control"
                                onChange={handelChange}>
                                    <option>Select Module Access</option>
                                    {adminState.Roles.map(role => (
                                        <option value={role.role}>{role.name}</option>
                                    ))}
                                </select>
                            </Form.Group>
                            
                            <Form.Group className="mt-3">
                                <Button 
                                onClick={handleSubmit}
                                className="btn dark btn-sm">
                                    {params.id ? 'Update Module':'Save Module'}
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
