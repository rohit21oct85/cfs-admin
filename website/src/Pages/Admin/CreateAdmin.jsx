import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'

import useAxios from '../../hooks/useAxios'
import {AuthContext} from '../../context/AuthContext';

import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import useRoles from '../../hooks/useRoles';
import { useToasts } from 'react-toast-notifications';
import useSingleAdmin from '../../hooks/useSingleAdmin';
import useAccessModules from '../../hooks/useAccessModules';
import useAccessModulePermission from '../../hooks/useAccessModulePermission';

export default function CreateAdmin() {
    const history = useHistory();
    const params = useParams();
    
    let accessUrl = useAccessModules();
    useEffect(checkPageAccessControl,[accessUrl]);
    function checkPageAccessControl(){
        if(accessUrl === false){
            history.push('/403');
        }
    }
    const create = useAccessModulePermission('create');
    const update = useAccessModulePermission('update');
    const upload = useAccessModulePermission('upload');
    const Delete = useAccessModulePermission('delete');
    const view = useAccessModulePermission('view');
    
    useEffect(manageAccess,[create, update, upload, view]);
    function manageAccess(){
        if(create === false || update === false || upload === false || view === false){
            history.push(`/admin/students-management`)
        }
    }

    const {state} = useContext(AuthContext);
    const { addToast } = useToasts();
    const {data:roles , isLoading:roleLoading} = useRoles()
    
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
    const [formData, setFormData] = useState({});
    const [fullname, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const [status, setStatus] = useState("")
    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        let userole = params?.id ? user?.role: role;
        let roleName = roles.filter(r => r?.role == userole);
        // console.log(roleName[0].name); return;
        formData['fullname'] = params?.id ? user?.fullname : fullname;
        formData['email'] = params?.id ? user?.email : email;
        formData['mobile'] = mobile;
        formData['password'] = password === "" ? 'password': password;
        formData['role'] = userole;
        formData['role_name'] = roleName[0].name
        formData['status'] = params?.id ? user?.status: status;
        // console.log(formData); return;

        if(params.id){
            response = await axios.patch(`${API_URL}master-admin/update/${params.id}`,formData, options);
            addToast("admin updated successfully", { appearance: 'success',autoDismiss: true });
        }else{

            response = await axios.post(`${API_URL}master-admin/create`,formData, options);
            addToast("admin added successfully", { appearance: 'success',autoDismiss: true });
        }
        history.push('/master-admin');
    
    }
    async function handelChange(e){
        const data = e.target.value;
        const uservalue = data.replace(/[^a-zA-Z0-9@, ]/g, "");
        if(params?.id){
            setUser({...user, [e.target.name]: uservalue})
        }else{
            setFormData({...formData, [e.target.name]: uservalue});
        }
    }

    const {data: userData} = useSingleAdmin();

    const [user, setUser] = useState({});

    useEffect( () => {
        setUser(userData)
    },[userData]);

    

return (

    <>
    {state.isLoggedIn && (
    
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
                            <span className="fa fa-arrow-left"></span>
                        </Link>
                        </div>
                        <div className="col-md-12 no-gutter p-0 mt-2">
                       

                        <Form autoComplete="off" className="col-md-3 p-0">
                            <Form.Group method="POST">
                                <Form.Control name="fullname" autoComplete="off"
                                value={params?.id ? user?.fullname: fullname}
                                onChange={e => {
                                    e.preventDefault();
                                    if(params?.id){
                                        setUser({...user, fullname: e.target.value});
                                    }else{
                                        setFullName(e.target.value);
                                    }
                                }}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Admin Name"/>
                            </Form.Group>
                                
                            <Form.Group method="POST">
                                <Form.Control name="email" autoComplete="nope"
                                value={params?.id ? user?.email: email}
                                onChange={e => {
                                    e.preventDefault();
                                    if(params?.id){
                                        setUser({...user, email: e.target.value});
                                    }else{
                                        setEmail(e.target.value);
                                    }
                                }}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Admin Email"/>
                            </Form.Group>
                            <Form.Group method="POST">
                                <Form.Control name="password" autoComplete="off"
                                type="password"
                                onChange={e => {
                                    setPassword(e.target.value)
                                }}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Enter Admin Password"/>
                            </Form.Group>

                            <div className="row">
                                <div className="col-md-6">
                                    <select className="form-control" name="role"
                                    value={user?.role ?? role}
                                    onChange={e => {
                                        e.preventDefault();
                                        if(params?.id){
                                            setUser({...user, role: e.target.value})
                                        }else{
                                             setRole(e.target.value)
                                        }
                                    }}
                                    >
                                        <option>Select Role</option>
                                        {roles?.map( role => {
                                            if(role.role > 1){
                                                return(
                                                    <option value={role?.role}  key={role?._id}>{role?.name}</option>
                                                )
                                            }
                                        })}
                                    </select>
                                </div>
                                
                                <div className="col-md-6">
                                    <select className="form-control" name="role"
                                    value={params?.id ? user?.status : status}
                                    onChange={e => {
                                        e.preventDefault();
                                        if(params?.id){
                                            setUser({...user, status: e.target.value})
                                        }else{
                                            setStatus(e.target.value)
                                        }
                                    }}
                                    >
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
