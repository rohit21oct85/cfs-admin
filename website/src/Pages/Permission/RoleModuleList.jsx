import React, {useContext, useRef, useState} from 'react'

import '../mainDash.css';
import {  useHistory, useParams  } from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';

import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import * as utils from '../../utils/MakeSlug';
import useRoleModules from '../../hooks/useRoleModules';
import useRoleDetails from '../../hooks/useRoleDetails';
import useRoles from '../../hooks/useRoles';

import { useToasts } from 'react-toast-notifications';
import useAppModules from '../../hooks/useAppModules';

export default function RoleModuleList() {

    const history = useHistory();
    const params = useParams();
    const roleRef = useRef('');
    const checkRef = useRef('');
    const { addToast } = useToasts();
    const {state} = useContext(AuthContext);
    const {data:roleModules} = useRoleModules(params?.role);
    const {data:roleDetails} = useRoleDetails(params?.role_id);
    console.log(roleDetails)
    const {data:modules, isLoading}  = useAppModules();
    const [moduleLists, setModuleLists] = useState([]);
    const [checkClick, setCheckClick] = useState(false);
    React.useEffect(updateModules, [modules]);
    async function updateModules(){
        modules?.map( module => {
            module.checked = false;
        })
        setModuleLists(modules);
    }
    React.useEffect(handleCheckbox,[checkClick]);

    async function handleCheckbox(id){
        setCheckClick(true);
        modules?.map( module => {
            if(module?._id === id){
                module.checked = true;
            }
        })
        setModuleLists(modules);

        setCheckClick(false);
    }

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
    const createMutation = useMutation(formData => {
        return axios.post(`${API_URL}master-role-module/create`, formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries('role-modules')
            setLoading(false);
            clearFields();
            history.push(`/role-modules/update/${params?.role}/${params?.role_name}/${params?.role_id}`);
            addToast('Module Modified successfully', { appearance: 'success',autoDismiss: true });
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
                    checkboxesChecked.push({
                       module_id: split_data[0],
                       module_name: split_data[1],
                       module_slug: utils.MakeSlug(split_data[1]),
                       module_icon: split_data[2],
                       role: params?.role, 
                       role_name: params?.role_name, 
                       role_id: params?.role_id
                     });
                }
             }
            await createMutation.mutate(checkboxesChecked);
            
        }
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
        {!isLoading && (
        <div className="dash-con-heading">
            <div className="col-md-6 row">
                <select 
                    name="role"
                    id="role"
                    ref={roleRef}
                    value={`${params?.role_name}_${params?.role_id}_${params?.role}`}
                    className="roles col-md-6 form-control"
                    onChange={e=>{
                        const d = e.target.value;
                        const sl = d.split('_');
                        const role_name = sl[0];
                        const role_id = sl[1];
                        const role = sl[2];
                        history.push(`/role-modules/update/${role}/${role_name}/${role_id}`)
                    }}
                >
                <option value="">Select Roles</option>
                {Roles?.map( role => { return(
                    <option 
                        value={`${utils?.MakeSlug(role.name)}_${role._id}_${role?.role}`}
                        key={role._id}
                        >
                        {role.name}</option>
                )})}
                </select>
                
                <Button 
                onClick={handleSubmit}
                className="btn btn-sm dark ml-2">
                {loading ? (
                    <><span className="fa fa-spinner"></span> Processing</>
                ):(
                    <><span className="fa fa-save mr-2"></span> Save</>
                )}
                    
                </Button>

                {params?.role_id && (
                    <Button 
                    onClick={e=>{
                        history.push(`/role-modules`);
                        clearFields()
                    }}
                    className="btn dark bg-danger ml-2">
                        <span className="fa fa-times"></span>
                    </Button>        
                )}
            </div>    
        </div>
        )}
        {!isLoading && (
        <div className="dash-cont-start">
        <h4 className="mt-2">All Module Permissions</h4>    
        <div className="col-md-12 row">
            <input type="checkbox" className="checkall" id="checkAll" name="CheckAll" 
            onChange={handleCheckAll}/>
            <label htmlFor="checkAll">Check All </label>
        </div>
        <hr />
        <div className="row col-md-12">
            
            {moduleLists?.map((module, index) => {
                return(
                    <div className="card col-md-3 pl-2" key={module?._id}>
                        <label className="mb-0" htmlFor={`module-${index}`}
                        >

                            <input type="checkbox"
                                name="permissions"
                                className="mr-2" 
                                id={`module-${index}`}
                                value={`${module?._id}_${module?.module_name}_${module?.icon}`}
                                onChange={handleCheckbox.bind(this, module?._id)}
                                onClick={e => setCheckClick(true)}
                                {...module.checked === true ? 'checked' : ''}
                                {...roleDetails?.some(rolem => rolem.module_id === module?._id) ? 'checked':''}
                                />
                                {module?.module_name}
                                <span className="pull-right">{module?.checked?.toString()}</span>
                        </label>    

                    </div>
                )
            })}
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
