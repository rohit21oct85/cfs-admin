import React, {useContext, useEffect, useState} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faLock } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import {useFormData} from '../../hooks/useFormData';

import useAxios from '../../hooks/useAxios';

export default function AllBookList() {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {formData, handleChange} = useFormData();
    const {response, isLoading} = useAxios({
        method: 'get', url: 'master-books/view-all'
    });


    const [permissionGroup, setPermissionGroup] = useState();
    useEffect(() => {
        if(response !== null){
            const PermissionGroupRes = response.data;
            adminDispatch({ type: 'GET_ALL_PERMISSION_GROUPS', payload: PermissionGroupRes})
            if(PermissionGroupRes){
                setPermissionGroup(PermissionGroupRes);
            }
        }

       

    }, [response,permissionGroup]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    },[errorState.error, errorState.success]);
    
    const handleSubmit = async () => {
        console.log(formData);
    }

return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2>All Books</h2>
        </div>
        {errorState.success && ( <Notification>{errorState.success}</Notification>)}
        {errorState.error && ( <Notification>{errorState.error}</Notification>)}
        {isLoading && (<LoadingComp />)}
        <div className="dash-con-heading">
            <div className="col-md-12 row">
                <Button 
                onClick={ e => history.push('/books-create')}
                className="btn btn-sm dark">
                    <FontAwesomeIcon icon={faPlus} /> Add books</Button>
            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <h4 className="mt-2">All Permission Groups</h4>    
        <hr />
        {adminState.permissionGroups.map(permission => { return (
            <div 
                key={permission._id} 
                className="mb-2"
            >
            <h5 className="module_name cursor">
            <span 
                style={{ marginLeft: '5px' }}
                htmlFor={permission.module_name}
                >{permission.module_name.replaceAll('-',' ')}</span>
            
            </h5>
            <hr />
            <div className="col-md-12 row">
            {permission.module_method.map( method => {
                return (
                <div className="col-md-2 subject-card" key={method._id}>
                    <label htmlFor={method._id} style={{ marginBottom: '0px' }}>
                        <input 
                            type="checkbox"
                            name="module_method"
                            id={method._id}
                            onChange={handleChange}
                            value={`${method.name}_${permission.module_name}`}
                            
                        /> 
                        <span style={{ marginLeft: '5px' }}>
                            {method.name}
                        </span>
                    </label>
                </div>
                );
                })}
                </div>
            </div>
        )})}
        </div>
        )}
        
    </div>
</div>
</div>

)}  
</>
)
}
