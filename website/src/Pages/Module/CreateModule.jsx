import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'

import axios from 'axios'
import * as cons from '../../Helper/Cons';
import * as utils from '../../utils/MakeSlug'
import useAppModules from "../../hooks/useAppModules";
import {AuthContext} from '../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import { useMutation, useQueryClient } from "react-query";

export default function CreateModule() {
    const queryClient = useQueryClient();
    const history = useHistory();
    const params = useParams();
    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);
    const { data, isLoading} = useAppModules();
    const [singleModule, setSingleModule] = useState({})
    useEffect(handleSingleModule, [data, params?.id])
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

    async function handleSingleModule(){
        console.log(params?.id)
        const module = data?.filter( smodule => smodule?._id === params?.id);
        setSingleModule(module && module[0]);

    }
    const [formData, setFormData] = useState({});
    const [module_name, setModuleName] = useState("")
    const [description, setModuleDescription] = useState("")
    const [icon, setModuleIcon] = useState("")
    const [showMenu, setShowMenu] = useState(true)

    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        if(params.id){
            singleModule['module_slug'] = utils.MakeSlug(params?.id ? singleModule?.module_name : moduleName);
            await UpdateModule.mutate(singleModule);
        }else{
            const data ={
                module_name: module_name,
                module_slug: utils.MakeSlug(module_name),
                description: description,
                icon: icon,
                showMenu: showMenu,
            }
            await CreateModule.mutate(data);
        }
            
    }
    
    const UpdateModule = useMutation(
        (singleModule) => {
          return axios.patch(
            `${API_URL}master-module/update/${params.id}`,
            singleModule,
            options
          );
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([
              `app-modules`,
            ]);
            history.push(
              `/app-modules`
            );
            setModuleName("");
            setModuleDescription("");
            setModuleIcon("");
            setShowMenu("");
            
            addToast("Module updated successfully", {
                appearance: "success",
                autoDismiss: true,
            });
          },
        }
      );
    const CreateModule = useMutation(
        (data) => {
          return axios.post(
            `${API_URL}master-module/create`,
            data,
            options
          );
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([
              `app-modules`,
            ]);
            history.push(
              `/app-modules`
            );
            setModuleName("");
            setModuleDescription("");
            setModuleIcon("");
            setShowMenu("");
            
            addToast("Module created successfully", {
                appearance: "success",
                autoDismiss: true,
            });
          },
        }
      );

       


return (

    <>
    {state.isLoggedIn && (

        <div className="col-md-12 no-gutter p-0 mt-2">
        <p className="mt-1 mb-1"><b><span className="fa fa-gear mr-2"></span>Add New Module</b></p>    
        <hr className="mt-1 mb-2"/>
        <Form autoComplete="off" method="POST" className="col-md-12 p-0">
            <Form.Group >
                <Form.Label>Module Name</Form.Label>
                <Form.Control name="module_name" autoComplete="off"
                value={params?.id ? singleModule?.module_name: module_name}
                onChange={e => {
                    e.preventDefault()
                    if(params?.id){
                        setSingleModule({...singleModule, module_name: e.target.value})
                    }else{
                        setModuleName(e.target.value)
                    }
                }}
                onKeyDown={ 
                    event => {
                        if(event.key === 'Enter'){
                            event.preventDefault()
                        }
                    }
                } placeholder="Enter Module Name"/>
            </Form.Group>
                
            <Form.Group>
                <Form.Label>Module Description</Form.Label>
                <Form.Control name="description" autoComplete="off"
                value={params?.id ? singleModule?.description: description}
                onChange={e => {
                    e.preventDefault()
                    if(params?.id){
                        setSingleModule({...singleModule, description: e.target.value})
                    }else{
                        setModuleDescription(e.target.value)
                    }
                }}
                onKeyDown={ 
                    event => {
                        if(event.key === 'Enter'){
                            event.preventDefault()
                        }
                    }
                } placeholder="Enter Module description"/>
            </Form.Group>

            
            <Form.Group>
                <Form.Label>Module Icon</Form.Label>
                <Form.Control name="icon" autoComplete="off"
                value={params?.id ? singleModule?.icon: icon}
                onChange={e => {
                    e.preventDefault()
                    if(params?.id){
                        setSingleModule({...singleModule, icon: e.target.value})
                    }else{
                        setModuleIcon(e.target.value)
                    }
                }}
                onKeyDown={ 
                    event => {
                        if(event.key === 'Enter'){
                            event.preventDefault()
                        }
                    }
                } placeholder="Enter Module Icons"/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Show in Menu</Form.Label>
                <Form.Control 
                as="select"
                className="form-control"
                value={params?.id ? singleModule?.showMenu: showMenu}
                onChange={
                    e => {
                        e.preventDefault();
                        if(params?.id){
                            setSingleModule({...singleModule, showMenu: e.target.value})
                        }else{
                            setShowMenu(e.target.value)
                        }
                    }
                }
                >
                    <option value="_">Select Menu Type</option>
                    <option value="true">Show in Menu</option>
                    <option value="false">Hide from Menu</option>
                </Form.Control>
            </Form.Group>


            
            <Form.Group className="mt-3">
                <Button 
                onClick={handleSubmit}
                className="btn dark btn-sm">
                    {params?.id ? 'Update Module':'Save Module'}
                </Button>
            </Form.Group>
        </Form>
        </div>
    
            
        
    )}  
    </>

)
}
