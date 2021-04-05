import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios';
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';
import {SubjectContext} from '../../context/SubjectContext';

export default function CreateSubSubject() {
    const history = useHistory();
    const params = useParams();
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {state: sState, dispatch: sDispatch} = useContext(SubjectContext);

    const [formData, setFormData] = useState("");

    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        if(formData == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Enter Subject Name'});
        }else{
            formData['subject'] = params.subject_name;
            formData['subject_id'] = params.subject_id;
            if(params.id){
                response = await api.patch(`subject/update/${params.id}`,formData);
            }else{
                response = await api.post('sub-subject/create',formData);
            }
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            history.push(`/sub-subject/${params.subject_name}/${params.subject_id}`);
        }
    }
    async function handelChange(e){
        const data = e.target.value;
        const subject = data.replace(/[^a-zA-Z0-9, ]/g, "");
        setFormData({...formData, [e.target.name]: subject});
    }
    const {response} = useAxios({
        method: 'get', url: 'subject/all'
    });
    const [subject, setSubject] = useState([]);
    useEffect( () => {
        if(response !== null){
            const subRes = response.data;
            sDispatch({type: 'GET_ALL_SUBJECT', payload: subRes});
            
            if(subRes){
                setSubject(subRes)
            }
        }   
    },[response, subject]);

    useEffect( () => {
        
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    },[errorState.error, errorState.success])

return (

    <>
    {state.isLoggedIn && errorState && sState.Subjects && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Create New Subject</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        {params.subject_name ? (
                            <Link to={`/sub-subject/${params.subject_name}/${params.subject_id}`} className="btn btn-sm dark">
                                <span className="fa fa-arrow-left text-success mr-2"></span>
                            </Link>
                        ):(
                            <Link to={`/sub-subject`} className="btn btn-sm dark">
                                <span className="fa fa-arrow-left text-success mr-2"></span>
                            </Link>
                        )}    
                        
                        </div>
                        <div className="col-md-12 no-gutter p-0 mt-2">
                        {errorState.error && ( 
                            <Notification>{errorState.error}</Notification>
                        )}
                            
                        {errorState.success && ( 
                            <Notification>{errorState.success}</Notification>
                        )}

                        <Form method="POST" className="col-md-6 p-0">
                            <Form.Group>
                                <Form.Label>Subject Name</Form.Label>
                                {params.subject_name ? (
                                    <Form.Control 
                                    name="subject" autoComplete="off"
                                    defaultValue={params.subject_name}
                                    onChange={handelChange}
                                    onKeyDown={ 
                                        event => {
                                            if(event.key === 'Enter'){
                                                event.preventDefault()
                                            }
                                        }
                                    } placeholder="Subject Name"/>
                                ) : (
                                    <select className="form-control" name="subject" autoComplete="off"
                                    onChange={ 
                                        event => {
                                            const value = event.target.value;
                                            const subject_name = value.split('_')[0];
                                            const subject_id = value.split('_')[1];
                                            history.push(`/sub-subject/${subject_name.trim().replace(' ','-').toLowerCase()}/create/${subject_id}`)
                                        }
                                    } >
                                        <option>Select Subject</option>
                                        {sState.Subjects.map( sub => {
                                            return (
                                            <option key={sub._id} value={sub.subject+'_'+sub._id}>{sub.subject}</option>
                                            )
                                        })}
                                    </select>
                                )}
                                
                            </Form.Group>
                            
                            <Form.Group>
                                <Form.Label>
                                    Sub Subject Name 
                                </Form.Label>
                                <Form.Control name="sub_subject" autoComplete="off"
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="E.g subject1, subject1, subject3"/>
                            </Form.Group>

                            <Form.Group>
                                <Button 
                                onClick={handleSubmit}
                                className="btn dark btn-sm">
                                    {params.id ? 'Update Subject':'Save Subject'}
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
