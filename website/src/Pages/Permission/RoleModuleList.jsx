import React, {useContext, useRef, useState, useEffect} from 'react'

import '../mainDash.css';
import {  useHistory, useParams  } from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';

import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import * as utils from '../../utils/MakeSlug';
import useRoleModules from '../../hooks/useRoleModules';
import useRoles from '../../hooks/useRoles';

import { useToasts } from 'react-toast-notifications';
import useAppModules from '../../hooks/useAppModules';
import useRoleUsers from '../../hooks/useRoleUsers';
import useAccessModules from '../../hooks/useAccessModules';
import useUserPermission from '../../hooks/useUserPermission';
import useUserAllPermission from '../../hooks/useUserAllPermission';
import useDeleteModulePermission from './hooks/useDeleteModulePermission';
import useDeletePermission from './hooks/useDeletePermission';


export default function RoleModuleList() {
    const history = useHistory();
    const params = useParams();
    
    let accessUrl = useAccessModules();
    let permissions = useUserPermission();
    
    // useEffect(checkPageAccessControl,[accessUrl]);
    // function checkPageAccessControl(){
    //     if(accessUrl === false){
    //         history.push('/403');
    //     }
    // }

    const roleRef = useRef('');
    const checkRef = useRef('');
    const { addToast } = useToasts();
    const {state} = useContext(AuthContext);
    const {data:roleDetails} = useRoleModules();
    const {data:allPermissions} = useUserAllPermission();

    const {data:roleUsers} = useRoleUsers(params?.role);
    
    console.log(allPermissions);
    const methods = [
        {
            key: 'create',
            value: 'Create',
            icon: `<span class="bi bi-plus-circle-fill"></span>`
        },
        {
            key: 'update',
            value: 'Update',
            icon: `<span class="bi bi-pencil-fill"></span>`
        },
        {
            key: 'delete',
            value: 'Delete',
            icon: `<span class="bi bi-trash-fill"></span>`
        },
        {
            key: 'upload',
            value: 'Upload',
            icon: `<span class="bi bi-cloud-upload-fill"></span>`
        },
        {
            key: 'view',
            value: 'View',
            icon: `<span class="bi bi-eye-fill"></span>`
        }
    ]
    const {data:modules, isLoading}  = useAppModules();
    const [moduleLists, setModuleLists] = useState([]);
    const [checkClick, setCheckClick] = useState(false);
    useEffect(updateModules,[modules, roleDetails]);
    async function updateModules(){
        modules?.map( module => {
            let checked = roleDetails?.some(rolem => rolem.module_id == module?._id)
            module.checked = checked;
        })
        setModuleLists(modules);
    }

    useEffect(handleCheckbox,[checkClick]);

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
        var ele = document.querySelectorAll('input[type=checkbox]');
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
            queryClient.invalidateQueries(`roledmoules-${params?.role}-${params?.email}`)
            queryClient.invalidateQueries(`all-permissions-${params?.role}-${params?.email}`)
            setLoading(false);
            clearFields();
            history.push(`/role-modules/update/${params?.role}/${params?.role_name}/${params?.role_id}/${params?.email}`);
            addToast('Module Modified successfully', { appearance: 'success',autoDismiss: true });
        }
});

    const handleSubmit = async () => {
        setLoading(true);
        if(roleRef.current.value === ""){
            setLoading(false);
            addToast('Please Select role to give permissions', { appearance: 'error',autoDismiss: true });
        }else{
            let ArrayMethod = []
            Array.from(document.querySelectorAll('.module-methods')).map( method => {
                if(method.checked === true){
                    let data = method.value
                    let splitData = data.split('_')
                    ArrayMethod.push({
                        role_id: params?.role_id,
                        role_name: params?.role_name,
                        role: params?.role,
                        email: params?.email,
                        module_id: splitData[0],
                        module_name: splitData[1],
                        module_slug: splitData[2],
                        module_icon: splitData[3],
                        method_name: splitData[4]
                    })
                }
            })
            
            let ArrayModule = []
            Array.from(document.querySelectorAll('.module')).map( method => {
                if(method.checked === true){
                    let data = method.value
                    let splitData = data.split('_')
                    ArrayModule.push({
                        role_id: params?.role_id,
                        role_name: params?.role_name,
                        role: params?.role,
                        email: params?.email,
                        module_id: splitData[0],
                        module_name: splitData[1],
                        module_slug: splitData[2],
                        module_icon: splitData[3],
                    })
                }
            })
            // console.log({module: ArrayModule, method: ArrayMethod});
            
            await createMutation.mutate({module: ArrayModule, method: ArrayMethod});
            
        }
        clearFields();
    }

    function handleSelectMethods(slug){
        let module = "module-"+slug
        let method = "method-"+slug
        let moduleCheked = document.getElementById(module).checked;
        Array.from(document.getElementsByName(method)).map( module => {
            if(moduleCheked){
                module.checked = true;
            }else{
                module.checked = false;
            }
        })
    }
    const deleteMutation = useDeletePermission();
    async function handleDeletePermission(id){
        alert(id);
        await deleteMutation.mutate({
            id: id
        })
    }
    const deleteModuleMutation = useDeleteModulePermission();
    async function handleDeleteModule(module, email){
        await deleteModuleMutation.mutate({
            module_slug: module,
            email: email
        })
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
            <div className="col-md-6 flex pl-0">

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
                
                <select className="form-control"
                value={params?.email}
                onChange={e => history.push(`/role-modules/update/${params?.role}/${params?.role_name}/${params?.role_id}/${e.target.value}`)}>
                    <option value="">Select User</option>
                    {roleUsers?.map(user => {
                        return(
                            <option value={user.email}>{user.fullname}</option>
                        )
                    })}
                </select>
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
        <div className="flex col-md-12 pl-0 pr-0" style={{
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            height: '360px',
            overflow: 'hidden scroll'

        }}>
            
            {moduleLists?.map((module, index) => {
                // let moduleCheck = roleDetails?.some(rolem => rolem.module_id == module?._id)
                let moduleCheck = utils.checkExists(allPermissions, 'module_slug', `${module?.module_slug}`);
                return(
                    <div className="col-md-6 mb-2 card pl-0 pr-0" key={module?._id}>
                        <div className="col-md-12 dark flex pt-2 pb-2">
                        <label className="mb-0" htmlFor={`module-${module?.module_slug}`}
                        >

                            <input type="checkbox"
                                name={`module-${module?.module_slug}`}
                                className="mr-2 module checkbox" 
                                id={`module-${module?.module_slug}`}
                                value={`${module?._id}_${module?.module_name}_${module?.module_slug}_${module?.icon}`}
                                onChange={handleSelectMethods.bind(this, module?.module_slug)}
                                onClick={e => setCheckClick(true)}
                                disabled={moduleCheck}
                                />
                                {module?.module_name}
                                
                        </label>    
                        <div>
                            <span>
                                {moduleCheck 
                                ? <span className="fa fa-check-circle text-success"></span>
                                : <span className="fa fa-check-circle text-danger"></span>
                            }
                            </span>
                            <span className="pointer pl-2 pull-right bi bi-trash text-white"
                            style={{
                                cursor: 'pointer',
                                fontSize: '0.90rem'
                            }}
                            onClick={(e) => handleDeleteModule(module?.module_slug, state.email)}
                            >
                            </span>
                        </div>
                        </div>
                        <div className="row ml-2 mr-2 pt-2 pb-2">
                            {methods?.map( method => {
                                let chkMethodDisabled = utils.checkExists(allPermissions, 'method_name', `${method?.key}-${module?.module_slug}`);
                                let chkMethodId = utils.getFilteredData(allPermissions, 'method_name', `${method?.key}-${module?.module_slug}`,'_id');
                                // let chkMethodDisabled = false;
                                if(module?.module_slug !== 'dashboard')
                                return(
                                <>    
                                <div className="col-md-4 card pl-2 pr-2 flex pt-1 pb-1" key={method?._id}>
                                    <label className="mb-0"
                                    style={{fontSize: '0.85rem'}}
                                    >
                                    <input type="checkbox" name={`method-${module?.module_slug}`} 
                                    className={`checkbox module-methods mr-1 mr-1`} 
                                    value={`${module?._id}_${module?.module_name}_${module?.module_slug}_${module?.icon}_${method?.key}-${module?.module_slug}`}
                                    disabled={chkMethodDisabled}
                                    />
                                    <span className="ml-0 mr-1" style={{ fontSize: '0.80rem'}} dangerouslySetInnerHTML={{ __html: method?.icon}}/>
                                    {method?.value}
                                    </label>
                                    <div>
                                    <span>
                                        {chkMethodDisabled 
                                        ? <span className="fa fa-check-circle text-success"></span>
                                        : <span className="fa fa-check-circle text-danger"></span>
                                    }
                                    </span>
                                    {chkMethodDisabled && (
                                        <span className="pointer pl-2 pull-right bi bi-trash text-danger"
                                        style={{
                                            cursor: 'pointer',
                                            fontSize: '0.90rem'
                                        }}
                                        onClick={(e) => handleDeletePermission(chkMethodId)}
                                        >
                                        </span>
                                    )}
                                    </div>
                                </div>
                                </>
                                )
                            })}
                            
                        </div>        
                    </div>
                )
            })}

               
        </div>
        <div className="row col-md-12 pl-2 mt-4">
            
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
        
    </div>
</div>
</div>

)}  
</>
)
}
