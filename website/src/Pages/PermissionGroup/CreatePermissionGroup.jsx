import React, {useContext} from 'react'
import {Form, Button} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';
import {AdminContext} from '../../context/AdminContext';
import {useFormData} from '../../hooks/useFormData';
import {ErrorContext} from '../../context/ErrorContext';
import * as api from '../../Helper/ApiHelper.jsx';

const CreatePermissionGroup = () => {
    const history = useHistory();
    const {state, dispatch} = useContext(AdminContext);
    const {dispatch:errorDispatch} = useContext(ErrorContext);
    const {formData, handleChange} = useFormData();
    
    const handleDelete = async (e) => {
        history.push(`delete-data/master-module/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/master-module/update/${e}`);
    }
    
    const handleSubmit = async () => {
        const response = await api.post(`/master-permission-group/create`, formData);
        console.log(response.data);
        if(response.status === 200){
            dispatch({ type: 'GET_ALL_PERMISSION_GROUPS', payload: response.data})
            errorDispatch({type: 'SET_SUCCESS', payload: response.data.message});
        }else{
            errorDispatch({type: 'SET_ERROR', payload: response.data.message});
        }
    }

    return(
        <>
        <Form >
             <Form.Group>
                 <Form.Label>App Module List</Form.Label>
                 <select 
                    name="module" 
                    type="select"
                    onChange={handleChange}
                    className="form-control">
                    <option>Select Modules</option>    
                    {state.ModLists.map( mod => {
                            const module_name = mod.module_name.replaceAll(' ','-').toLowerCase().trim(); 
                            const module_id = mod._id;
                            return(
                                <option value={`${module_name}_${module_id}`} key={mod._id}>{mod.module_name}</option>
                            )
                    })}
                    </select>
             </Form.Group>
             
             <Form.Group>
                 <Form.Label>App Methods List</Form.Label>
                    
                {state.methods.map( mod => {
                        return(
                            <div className="methods label"  key={mod.name}>
                                <label htmlFor={`${mod.name}`}>
                                    <input 
                                        name="module_method"
                                        type="checkbox" 
                                        className="check" 
                                        value={`${mod.name}`} 
                                        onChange={handleChange}
                                        id={`${mod.name}`}/> {mod.value}
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
             </Form.Group>

        </Form>
        </>
    )
}

export default CreatePermissionGroup;