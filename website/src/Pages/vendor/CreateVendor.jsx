import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'

import axios from 'axios'
import * as cons from '../../Helper/Cons';
import {AuthContext} from '../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import { useMutation, useQueryClient } from "react-query";
import useRoles from '../../hooks/useRoles';
import useVendorList from '../../hooks/useVendorList';
import { LoadingComp } from '../../components/LoadingComp';

export default function CreateVendor() {

    const queryClient = useQueryClient();
    const history = useHistory();
    const params = useParams();
    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);
    
    const { data:roles, isLoading: roleLoading} = useRoles();
    const { data:vendors} = useVendorList();

    const [singleVendor, setSingleVendor] = useState({})
    
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token,
        }
    };

    useEffect(handleSingleVendor, [roles, params?.vendor_id]);
    async function handleSingleVendor(){
        const sVendor = vendors?.filter( s_vendor => s_vendor?._id === s_vendor?.vendor_id);
        setSingleVendor(sVendor && sVendor[0]);
    }

    const [formData, setFormData] = useState({});

    async function handleChange(e){
        if(params?.vendor_id){
                setSingleVendor({...singleVendor, [e.target.name]: e.target.value});
        }else{
                setFormData({...formData, [e.target.name]: e.target.value});
        }
    }
    async  function handleSubmit(e){
        e.preventDefault();
        if(params.id){
            await UpdateModule.mutate(singleVendor);
        }else{
            formData['fullname'] = formData.first_name + ' ' +formData.last_name;
            formData['password'] = 'password';
            await CreateModule.mutate(formData);
        }
            
    }
    
    const UpdateModule = useMutation(
        (singleVendor) => {
          return axios.patch(
            `${API_URL}vendor/update/${params?.vendor_id}`,
            singleVendor,
            options
          );
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([
              `vendors`,
            ]);
            history.push(
              `/manage-vendor`
            );
            setFormData({first_name: '', last_name: '', email: '', role: ''});
            addToast("Vendor updated successfully", {
                appearance: "success",
                autoDismiss: true,
            });
          },
        }
      );
    const CreateModule = useMutation(
        (data) => {
          return axios.post(
            `${API_URL}vendor/create`,
            data,
            options
          );
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([
              `vendors`,
            ]);
            history.push(
              `/manage-vendor`
            );
            setModuleName("");
            setModuleDescription("");
            setModuleIcon("");
            setShowMenu("");
            
            addToast("Vendor created successfully", {
                appearance: "success",
                autoDismiss: true,
            });
          },
        }
      );

       
async function EnterKeyPreventHandle(e){
    if(e.keyCode === 13){
        e.preventDefault()
        return false;
    }
}

return (

    <>
    {state.isLoggedIn && (

        <div className="col-md-12 no-gutter p-0 mt-2">
        <p className="mt-1 mb-1"><b><span className="fa fa-gear mr-2"></span>Add New Vendor</b></p>    
        <hr className="mt-1 mb-2"/>
        <Form autoComplete="Off" method="POST" className="col-md-12 p-0">
            <Form.Group >
                <Form.Label>First Name</Form.Label>
                <Form.Control name="first_name" autoComplete="off"
                value={params?.id ? singleVendor?.first_name: formData?.first_name}
                onChange={handleChange}
                onKeyDown={EnterKeyPreventHandle} 
                placeholder="Enter Module Name"/>
            </Form.Group>
            <Form.Group >
                <Form.Label>Last Name</Form.Label>
                <Form.Control name="last_name" autoComplete="off"
                value={params?.id ? singleVendor?.last_name: formData?.last_name}
                onChange={handleChange}
                onKeyDown={EnterKeyPreventHandle} 
                placeholder="Enter Last Name"/>
            </Form.Group>
                
            <Form.Group >
                <Form.Label>Email Address</Form.Label>
                <Form.Control 
                    name="email" 
                    autoComplete="off"
                    value={params?.id ? singleVendor?.email: formData?.email}
                    onChange={handleChange}
                    onKeyDown={EnterKeyPreventHandle} 
                    autoComplete="Off"
                    placeholder="Enter Email Address"/>
            </Form.Group>
                
            
            <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control 
                as="select"
                name="role"
                className="form-control"
                value={params?.id ? singleVendor?.role: formData?.role}
                onChange={handleChange}>
                <option value="_">Select Role</option>
                    {roles?.map(role => {
                        return(
                            <option 
                            value={`${role?.role}`}
                            disabled={role?.name !== 'TBS Vendor'}
                            >{role?.name}</option>
                        )
                    })}
                </Form.Control>
            </Form.Group>
            
            <Form.Group className="mt-3">
                <Button 
                onClick={handleSubmit}
                className="btn dark btn-sm">
                    {params?.id ? 'Update Vendor':'Save Vendor'}
                </Button>
            </Form.Group>
        </Form>
        </div>
    
            
        
    )}  
    </>

)
}
