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
import { faHandPointLeft, faTrash, faEdit, faEye,faEyeSlash, faLock, faSave } from '@fortawesome/free-solid-svg-icons';

export default function CreateModulePassword() {
const history = useHistory();
const params = useParams();

const {state} = useContext(AuthContext);
const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);

const [formData, setFormData] = useState("");

async  function handleSubmit(e){
e.preventDefault();
let response = null;
// console.log(formData); 
// return;
if(formData == ''){
    errorDispatch({type: 'SET_ERROR', payload: 'Please Enter Module Name'});
}else{
    if(params.id){
        response = await api.patch(`master-delete/update/${params.id}`,formData);
    }else{
        response = await api.post('master-delete/create',formData);
    }
    errorDispatch({type: 'SET_SUCCESS', payload: response.message});
    adminDispatch({type: 'GET_REMOVE_ALL_DATA', payload: response.data.data})
    history.push(`/master-module/password/${params.module_name}/${params.module_id}`);
}
}
async function handelChange(e){
const data = e.target.value;
const filedValue = data.replace(/[^a-zA-Z0-9, ]/g, "");
setFormData({...formData, [e.target.name]: filedValue});
}

const {response} = useAxios({
method: 'get', url: `master-delete/view/${params.module_name}`
});
const [removeAllData, setRemoveAllData] = useState('');
useEffect( () => {
if(response !== null){
    const RemoveAllDataRes = response.data;
    errorDispatch({type: 'SET_SUCCESS', payload: response.message})
    adminDispatch({type: 'GET_REMOVE_ALL_DATA', payload: RemoveAllDataRes});
    if(adminState){
        setRemoveAllData(RemoveAllDataRes)
    }
}   
},[response])
useEffect( () => {
let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
return () => {
    clearTimeout(timerError)
    clearTimeout(timerSuccess)
}
},[errorState.error, errorState.success]);
useEffect( () => {
setFormData({...formData,'module_name': params.module_name, 'module_id': params.module_id});
},[params])
const [randomPassword, setRandomPassword] = useState(null);

const generateRandomPassword = () => {
var pass = '';
var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +  
        'abcdefghijklmnopqrstuvwxyz0123456789'+
        '@#$&*'; 
for (let i = 1; i <= 12; i++) { 
    var char = Math.floor(Math.random() 
                * str.length + 1); 
        
    pass += str.charAt(char) 
} 
setRandomPassword(pass);
setFormData({...formData,'module_password': pass,'module_plain_password': pass});
}
const handleDelete = async (e) => {
history.push(`delete-data/master-module/delete/${e}`) 
}
const handleUpdate = async (e) => {
history.push(`/master-module/update/${e}`);
}
const [maskedPassword, setMaskedPassword] = useState(true);
const [passwordValidity, setPasswordValidity] = useState(false);
const [showPassword, setShowPassword] = useState(false);

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
                    <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
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
                            Module Methods Name
                            <p style={{ marginBottom: '2px' }}><small>Enter: create, update, <b className="text-danger">delete</b>, view, view-all</small></p>
                        </Form.Label>
                        <Form.Control name="module_method" autoComplete="off"
                            defaultValue={module.module_method}
                            onChange={handelChange}
                            onKeyDown={ 
                                event => {
                                    if(event.key === 'Enter'){
                                        event.preventDefault()
                                    }
                                }
                            } placeholder="Enter Module Method Name"/>
                    </Form.Group>
                    
                    <Form.Group method="POST">
                        <Form.Label>
                            Module Methods Password
                        <FontAwesomeIcon 
                            style={{ marginBottom: '2px',cursor: 'pointer', marginLeft: '15px' }}
                            onClick={generateRandomPassword}
                            icon={faLock} 
                            title='Generate Password'
                        />
                    
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
                            {params.id ? 'Update Module Password':'Save Module Password'}
                        </Button>
                    </Form.Group>
                </Form>
                </div>
                <div className="col-md-8 pl-0 subject-main-container">
                    {removeAllData && removeAllData.map(removeData => { return (
                        <div className="col-md-12 module-card" key={removeData._id} id={`card-${removeData._id}`}>
                        <div className="subject-card-heading">
                            <div>
                                <Link to={`sub-subject/${removeData.module_name.replace(' ','-').toLowerCase().trim()}/${removeData._id}`}>
                                #{removeData._id}
                                </Link>
                            </div>
                            <div>
                                <Button className="delBtn" onClick={handleUpdate.bind(this,removeData._id)}>
                                    <FontAwesomeIcon icon={faEdit} className="text-danger mr-2"  varient="solid"/>
                                </Button>
                                
                                <Button className="delBtn" onClick={handleDelete.bind(this,module._id)}>
                                    <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                                </Button>
                            </div>
                        </div>
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
                                    <FontAwesomeIcon 
                                        className="ml-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={ e => {
                                            setPasswordValidity(true);
                                            setMaskedPassword(false);
                                        }}
                                        icon={faEye}
                                    />
                                </div>
                                )}
                                {showPassword && (
                                    <div className="name-main">
                                    <span>
                                        {removeData.module_plain_password}
                                    </span>
                                    <FontAwesomeIcon 
                                    className="ml-2"
                                    icon={faEyeSlash}/>
                                    </div>
                                )}
                                {passwordValidity && (
                                <div className="name-main">
                                    <input type="text" className="form-control" />
                                    <FontAwesomeIcon 
                                        className="ml-2"
                                        style={{ cursor: 'pointer' }}
                                        icon={faSave}/>
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
                            
                            
                            <div className="admin-name"> 
                                <div className="name-label">
                                    Created On: 
                                </div>
                                <div className="name-main">
                                    {removeData.created_at.split('T')[0]}
                                </div>
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
