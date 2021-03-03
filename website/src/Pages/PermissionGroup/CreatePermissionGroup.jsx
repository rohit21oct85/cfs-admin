import React, {useContext, useState, useEffect} from 'react'
import {Form, Button} from 'react-bootstrap';
import {useHistory, useParams} from 'react-router-dom';
import {AdminContext} from '../../context/AdminContext';
import {useFormData} from '../../hooks/useFormData';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios';

const CreatePermissionGroup = () => {
    const history = useHistory();
    const params = useParams();
    const {state, dispatch} = useContext(AdminContext);
    const {state:errorState, dispatch:errorDispatch} = useContext(ErrorContext);
    const {formData, handleChange} = useFormData();
    function clearFields(){
        document.getElementById("module").selectedIndex = '0';
        const cbs = document.querySelectorAll('input[name="module_method"]');
        cbs.forEach((cb) => {
            cb.checked = false;
        });    
    }
    const handleSubmit = async () => {
        if(formData.module_name !== undefined && formData.module_id !== undefined){
            const response = await api.post(`/master-permission-group/create`, formData);
            if(response.data.status === 200){
                dispatch({ type: 'GET_ALL_PERMISSION_GROUPS', payload: response.data.data})
                errorDispatch({type: 'SET_SUCCESS', payload: response.data.message});
                clearFields()
                history.push('/master-permission-group')
            }else{
                errorDispatch({type: 'SET_ERROR', payload: response.data.message});
            }
        }else{
            errorDispatch({type: 'SET_ERROR', payload: "Please Select Modules to create permision group"});
        }
        
    }

    const {response} = useAxios({
        method: 'get', url: `master-permission-group/view/${params.id}`
    });
    const [permissionGroup, setPermissionGroup] = useState({});

    useEffect( () => {
        if(response !== null){
            const PermissionGroupRes = response.data.module_method;
            dispatch({type: 'SET_SELECTED_METHOD', payload: PermissionGroupRes});
            setPermissionGroup(PermissionGroupRes);
            
        }   
    },[params.module_name, response, permissionGroup])
    
    const {moduleResponse} = useAxios({
        method: 'get', url: 'master-module/view-all'
    });
    
    const [appModule, setAppModule] = useState();
    useEffect(() => {
        if(response !== null){
            const ModuleRes = response.data;
            dispatch({ type: 'GET_ALL_MODLISTS', payload: ModuleRes})
            if(ModuleRes){
                setAppModule(ModuleRes);
            }
        }
    }, [moduleResponse,appModule]);

    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    },[errorState.error, errorState.success])

    return(
        <>
        {errorState.error && ( 
            <Notification>{errorState.error}</Notification>
        )}

        {errorState.success && ( 
            <Notification>{errorState.success}</Notification>
        )}
        <Form>
             <Form.Group>
                 <select 
                    name="module" 
                    id="module" 
                    type="select"
                    onChange={handleChange}
                    className="form-control">
                    <option>Select Modules</option>    
                    {state.ModLists.map( mod => {
                            const module_name = mod.module_name.replaceAll(' ','-').toLowerCase().trim(); 
                            const module_id = mod._id;
                            return(
                                <option 
                                    value={`${module_name}_${module_id}`} 
                                    selected={(module_name === params.module_name)?'selected':''}
                                    key={mod._id}>{mod.module_name}</option>
                            )
                    })}
                    </select>
             </Form.Group>
             
             <Form.Group>
                 <Form.Label>App Methods List</Form.Label>
                    
                {state.methods.map( mod => {

                let checked = state.selected_methods && state.selected_methods.find( pgroup => pgroup.name === mod.name);

                return(
                        <div className="methods label"  key={mod.name}>
                            <label htmlFor={`${mod.name}`}>
                                {params.module_name ? (
                                <input 
                                    name="module_method"
                                    type="checkbox" 
                                    className="check  checkbox" 
                                    value={`${mod.name}`}
                                    checked={checked ? 'checked':''} 
                                    onChange={handleChange}
                                    id={`${mod.name}`}/>
                                ) :(
                                <input 
                                    name="module_method"
                                    type="checkbox" 
                                    className="check  checkbox" 
                                    value={`${mod.name}`}
                                    onChange={handleChange}
                                    id={`${mod.name}`}/>
                                )}
                                <span style={{ marginLeft: '5px' }}>{mod.value}</span>
                            </label>   
                        </div>
                    )
                })}
                    
             </Form.Group>

             <Form.Group>
                 <Button 
                    varient="dark" 
                    className="dark"
                    onClick={handleSubmit}
                >
                     Submit
                 </Button>
                 {params.id && (
                    <Button 
                    onClick={ () => {
                        clearFields();
                        history.push(`/master-permission-group`);
                    }}
                    className="btn dark btn-md ml-2">
                        Cancel
                    </Button>
                )}
             </Form.Group>

        </Form>
        </>
    )
}

export default CreatePermissionGroup;