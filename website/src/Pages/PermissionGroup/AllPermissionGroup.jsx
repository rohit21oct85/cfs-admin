import React, {useContext, useEffect} from 'react'

import {AdminContext} from '../../context/AdminContext';

import useAxios from '../../hooks/useAxios.jsx';

import SinglePermission from './SinglePermission';

const AllPermissionGroup = () => {
    
    const {state, dispatch} = useContext(AdminContext);
    const {response, isLoading} = useAxios({
        method: 'get', url: 'master-permission-group/view-all'
    });    
    useEffect( () => {
        if(response !== null){
            dispatch({ type: 'GET_ALL_PERMISSION_GROUPS', payload: response.data})
        }
    },[response])
   
    
    return(
        <>
        {state.permissionGroups.map(permission_group => { 
            return (
                <SinglePermission key={permission_group._id} permission_group={permission_group}/>
            )
        })}
        </>
    )
}

export default AllPermissionGroup;