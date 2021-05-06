import React, {useContext, useRef, useState} from 'react'
import '../mainDash.css';
import {  useHistory, useParams  } from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';
import {LoadingComp} from '../../components/LoadingComp';
import {useFormData} from '../../hooks/useFormData';

import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'

import useAllPermissionGroup from '../../hooks/useAllPermissionGroup';
import useRolePermissions from '../../hooks/useRolePermissions';
import useRoles from '../../hooks/useRoles';

import { useToasts } from 'react-toast-notifications';

export default function RolePermissionList() {

    const history = useHistory();
    const params = useParams();
    const roleRef = useRef('');
    const checkRef = useRef('');
    const { addToast } = useToasts();
    const {state} = useContext(AuthContext);

    const {formData, handleChange} = useFormData();
    const {data: response, isLoading} = useAllPermissionGroup();
    const {data:rolepermission} = useRolePermissions();
    const {data:Roles} = useRoles();
    const [loading, setLoading] = useState(false);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+state.access_token
        }
    };

    const handleCheckAll = async () => {
        const checkAll = document.getElementById('checkAll').checked; 
        var ele = document.getElementsByName('permissions');  
        for(var i=0; i<ele.length; i++){  
            if(ele[i].type=='checkbox')      
            if(checkAll){
                ele[i].checked=true;  
            }else{
                ele[i].checked=false;  
            }
        }    
    }

    function clearFields(){
        document.getElementById("role").selectedIndex = '0';
        const cbs = document.querySelectorAll('input[type=checkbox]');
        cbs.forEach((cb) => {
            cb.checked = false;
        });
    }
    const queryClient = useQueryClient()
    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}master-role-permission/create`, formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries('rolepermissions')
            setLoading(false);
            clearFields();
            history.push(`/role-permission/update/${params?.role_name}/${params?.role_id}`);
            addToast('Permission`s Modified successfully', { appearance: 'success',autoDismiss: true });
        }
});

    const handleSubmit = async () => {
        setLoading(true);
        if(roleRef.current.value === ""){
            setLoading(false);
            addToast('Please Select role to give permissions', { appearance: 'error',autoDismiss: true });
        }else{
            var checkboxes = document.getElementsByName('permissions');
            var checkboxesChecked = [];
            for (var i=0; i<checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                   let data = checkboxes[i].value
                   let split_data = data.split('_'); 
                   checkboxesChecked.push({method_name: split_data[0],module_name: split_data[1] });
                }
             }
            const data = {permissions: checkboxesChecked, role_name: params?.role_name, role_id: params?.role_id} 
            
            await mutation.mutate(data);
            
        }
    }
    const [checked, setChecked] = useState(false);
    const [isChecked, setIsChecked] = useState()
    const checkModuleExists = (rolepermission, value) => {
        return rolepermission?.some( item =>  {
            return item.module_name === value ? true : false
        })
    }

    const checkMethodExists = (rolepermission, value) => {
        return rolepermission?.some( item => {
            const checkItem = item.method_name+'_'+item.module_name;
            return checkItem === value ? true: false;
        });
    }

return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2>Permission List</h2>
            
        </div>
        
        {isLoading && (<LoadingComp />)}
        {!isLoading && (
        <div className="dash-con-heading">
            <div className="col-md-12 row">
                <select 
                    name="role"
                    id="role"
                    ref={roleRef}
                    className="roles col-md-6 form-control"
                    onChange={e=>{
                        const d = e.target.value;
                        const sl = d.split('_');
                        const role_name = sl[0];
                        const role_id = sl[1];
                        history.push(`/role-permission/update/${role_name}/${role_id}`)
                    }}
                >
                <option value="">Select Roles</option>
                    
                {Roles?.map( role => { return(
                    <option 
                        selected={role._id === params.role_id ? 'selected':''}
                        value={`${role.name.toLowerCase().trim().replaceAll(' ','-')}_${role._id}`}
                        key={role._id}>{role.name}</option>
                )})}
                </select>
                
                <Button 
                onClick={handleSubmit}
                className="btn btn-sm dark ml-2">
                {loading ? (
                    <><span className="fa fa-spinner"></span> processing</>
                ):(
                    <><span className="fa fa-save mr-2"></span> Save Permission</>
                )}
                    
                </Button>

                {params?.role_id && (
                    <Button 
                    onClick={e=>{
                        history.push(`/role-permission`);
                        clearFields()
                    }}
                    className="btn btn-sm dark ml-2 ">
                        <span className="fa fa-times mr-2"></span>Cancel</Button>        
                )}
            </div>    
        </div>
        )}
        {!isLoading && (
        <div className="dash-cont-start">
        <h4 className="mt-2">All Permission Groups</h4>    
        <div className="col-md-12 row">
            <input type="checkbox" className="checkall" id="checkAll" name="CheckAll" 
            onChange={handleCheckAll}/>
            <label htmlFor="checkAll">Check All </label>
        </div>
        <hr />
        <div className="row col-md-12">
            {response?.map(permission => { 
                const module_name = permission.module_name.replaceAll('-',' ');
                const moduleChecked = checkModuleExists(rolepermission,permission?.module_name);
                return (
                <div key={permission._id} className="col-md-3 no-gutter p-2 mb-2 subject-card">
                    <p className="cursor mb-0 pl-2">
                        <b>{module_name}</b>
                    </p>
                
                <div className="col-md-12 row mt-0">
                {permission.module_method.map( method => {
                    const method_name = `${method.name}_${permission.module_name}`;
                    const methodChecked = checkMethodExists(rolepermission, method_name);
                    // setIsChecked(methodChecked)
                    return (
                        <div className="col-md-12 pl-4" key={method._id}>
                            <input 
                                    className="permissions"
                                    type="checkbox"
                                    name="permissions"
                                    ref={checkRef}
                                    onChange={e => {
                                        e.preventDefault()
                                        setChecked(checkRef.current.value)
                                    }}
                                    id={method._id}
                                    value={method_name}
                                    defaultValue={methodChecked} 
                                    checked={methodChecked} 
                                /> 
                                <label htmlFor={method._id} style={{ marginBottom: '0px', marginLeft: '5px' }}>
                                {method.name}</label>

                        </div>
                    );
                    })}
                    </div>
                </div>
            )})}
        </div>
        
        </div>
        )}
        
    </div>
</div>
</div>

)}  
</>
)
}
