import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios'
import useGeneratePassword from '../../hooks/useGeneratePassword'
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';
import {AdminContext} from '../../context/AdminContext';

export default function CreateModulePassword() {
    const history = useHistory();
    const params = useParams();

    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    
    const {randomPassword,generateRandomPassword} = useGeneratePassword();

    const [formData, setFormData] = useState("");

    const [formSubmitted, setFormSubmitted] = useState(false);
        async  function handleSubmit(e){
            e.preventDefault();
            let response = null;
            
            formData['module_method'] = "delete";
            formData['module_password'] = randomPassword;
            formData['module_plain_password'] = randomPassword;
            if(params.id){
                response = await api.patch(`master-delete/update/${params.id}`,formData);
            }else{
                response = await api.post('master-delete/create',formData);
            }
            setFormSubmitted(true);
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            adminDispatch({type: 'GET_REMOVE_ALL_DATA', payload: response.data.data});
            history.push(`/master-module/password/${params.module_name}/${params.module_id}`);
        
        }
        async function handelChange(e){
            const data = e.target.value;
            const filedValue = data.replace(/[^a-zA-Z0-9-, ]/g, "");
            setFormData({...formData, [e.target.name]: filedValue});
        }

        const {response} = useAxios({
            method: 'get', url: `master-delete/view/${params.module_name}`
        });
        const [removeAllData, setRemoveAllData] = useState('');
        useEffect( () => {
            if(response !== null){
                const RemoveAllDataRes = response.data;
                adminDispatch({type: 'GET_REMOVE_ALL_DATA', payload: RemoveAllDataRes});
                setRemoveAllData(RemoveAllDataRes)
                
            }   
        },[response,formSubmitted])
    useEffect( () => {
    let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
    let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
    return () => {
        clearTimeout(timerError)
        clearTimeout(timerSuccess)
    }
    },[errorState.error, errorState.success]);
    
    useEffect( () => {
        setFormData({...formData,'module_name': params.module_name, 'module_id': params.module_id, 'module_method': ''});
    },[params])
    
    const handleDelete = async (e) => {
        history.push(`/delete-data/master-module/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/master-module/password/${params.module_name}/${params.module_id}/${e.module_method}/${e.id}`);
    }
    const [maskedPassword, setMaskedPassword] = useState(true);
    const [passwordValidity, setPasswordValidity] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [viewPassword, setViewPassword] = useState('');
    const handlePasswordVerify = () => {
        if(viewPassword == 'wrongpassword'){
            setShowPassword(true);
            setPasswordValidity(false);
        }else{
            alert("you have entered a wrong password");
            setShowPassword(false);
            setPasswordValidity(true);
            setViewPassword('');
        }
    }

return (

<>
{state.isLoggedIn && errorState && adminState.RemoveAllDatas && (

<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2>Create New Module</h2>
        </div>
        
        <div className="dash-cont-start">
            <div className="org-main-area">
                <div className="row">
                    <div className="col-md-4">
                    <Link to={`/master-module`} className="btn btn-sm dark">
                        <span className="fa fa-arrow-left"></span>
                    </Link>
                    </div>
                    <div className="col-md-8 pl-0">
                        <h5><em><b>All Methods Password</b></em></h5>    
                    </div>
                </div>
                
                <div className="row">
                <div className="col-md-4 no-gutter mt-2">
                {errorState.error && ( 
                    <Notification>{errorState.error}</Notification>
                )}
                    
                {errorState.success && ( 
                    <Notification>{errorState.success}</Notification>
                )}

                <Form autoComplete="off" className="col-md-12 p-0">
                    <Form.Group method="POST">
                        <Form.Label>Module Name</Form.Label>
                        <Form.Control name="module_name" autoComplete="off"
                        defaultValue={params.module_name}
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
                        <Form.Label>
                            <p 
                            className="pl-0 mb-0"
                            style={{ cursor: 'pointer', fontWeight: 'bold'}}
                            onClick={generateRandomPassword}
                            >
                            <span className="fa fa-lock mr-2 text-success"></span>
                             Generate Random password
                            </p>
                        </Form.Label>
                        <Form.Control name="module_password" autoComplete="off"
                            defaultValue={(module.module_password) ? generateRandomPassword : randomPassword}
                            onChange={handelChange}
                            readOnly={true}
                            onKeyDown={ 
                                event => {
                                    if(event.key === 'Enter'){
                                        event.preventDefault()
                                    }
                                }
                            } placeholder="Module Password"/>
                            
                    </Form.Group>

                    
                    <Form.Group className="mt-3">
                        <Button 
                        onClick={handleSubmit}
                        className="btn dark btn-md">
                            {params.id ? 'Update Password':'Save Password'}
                        </Button>
                        {params.id && (
                            <Button 
                            onClick={ () => {
                                history.push(`/master-module/password/${params.module_name}/${params.module_id}`)
                            }}
                            className="btn dark btn-md ml-2">
                                Cancel
                            </Button>
                        )}
                    </Form.Group>
                </Form>
                </div>
                <div className="col-md-4 pl-0 subject-main-container">
                    {removeAllData && removeAllData.map(removeData => { return (
                        <div className="col-md-12 module-card" key={removeData._id} id={`card-${removeData._id}`}>
                        
                        <div className="subject-card-body mt-2">
                            <div className="admin-name"> 
                                <div className="name-label">
                                    Module Name: 
                                </div>
                                <div className="name-main">
                                    {removeData.module_name}
                                </div>
                            </div> 
                            <div className="admin-name"> 
                                <div className="name-label">
                                    Module Method: 
                                </div>
                                <div className="name-main">
                                    {removeData.module_method}
                                </div>
                            </div> 
                            <div className="admin-name"> 
                                <div className="name-label">
                                    Module Password: 
                                </div>
                                {maskedPassword && (
                                 
                                 <div className="name-main">
                                     <span>*************</span>
                                     <span 
                                         className="fa fa-eye ml-2"
                                         style={{ cursor: 'pointer' }}
                                         onClick={ e => {
                                             setPasswordValidity(true);
                                             setMaskedPassword(false);
                                             setViewPassword('');
                                         }}
                                     ></span>
                                 </div>
                                 )}
                                {showPassword && (
                                 
                                 <div className="name-main">
                                     <span>
                                         {removeData.module_plain_password}
                                     </span>
                                     <div className="update-icons col-md-3 pr-2">
                                         <span 
                                             className=" fa fatimes ml-2"
                                             style={{ cursor: 'pointer' }}
                                             onClick={ e => {
                                                 setPasswordValidity(false);
                                                 setShowPassword(false);
                                                 setMaskedPassword(true);
                                             }}
                                             ></span>
                                     </div>
                                 </div>
                                 )}
                                {passwordValidity && (
                                <div className="name-main">
                                    <input type="password" name='password' autoComplete="off" value={viewPassword} onChange={ e => setViewPassword(e.target.value)}  className="col-md-9 form-control" style={{  height: '25px' }} />
                                    <div className="update-icons col-md-3 pr-2">
                                        <span 
                                            className="ml-2 fa fa-eye-slash"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handlePasswordVerify}
                                            ></span>
                                            
                                        <span 
                                            className="ml-2 fa fa-times"
                                            style={{ cursor: 'pointer' }}
                                            onClick={ e => {
                                                setPasswordValidity(false);
                                                setMaskedPassword(true);
                                            }}
                                            ></span>
                                    </div>
                                    

                                </div>
                                )}
                                

                            </div> 
                            <div className="admin-name"> 
                                <div className="name-label">
                                    Status: 
                                </div>
                                <div className="name-main">
                                    {(removeData.status == 1) ? 'Active':'Inactive'}
                                </div>
                            </div> 
                            
                        </div>
                        <hr className="mt-2 mb-2"/>
                        <div className="subject-card-heading">
                            <div>
                            </div>
                            <div>
                                <Button className="delBtn" onClick={handleUpdate.bind(this,{id: removeData._id, module_method: removeData.module_method})}>
                                <span className="fa fa-edit text-muted mr-2"></span>
                                </Button>
                                
                                <Button className="delBtn" onClick={handleDelete.bind(this,removeData._id)}>
                                <span className="fa fa-trash text-danger mr-2"></span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    )})}
                </div>
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
