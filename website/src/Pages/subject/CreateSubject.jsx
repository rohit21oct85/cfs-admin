import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import useAxios from '../../hooks/useAxios'
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';
import {SubjectContext} from '../../context/SubjectContext';

export default function CreateSubject() {
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
            if(params.id){
                response = await api.patch(`subject/update/${params.id}`,formData);
            }else{
                response = await api.post('subject/create',formData);
            }
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            history.push('/subject');
        }
    }
    async function handelChange(e){
        const data = e.target.value;
        const subject = data.replace(/[^a-zA-Z0-9, ]/g, "");
        setFormData({...formData, subject: subject});
    }
    const {response} = useAxios({
        method: 'get', url: `subject/view/${params.id}`
    });
    const [subject, setSubject] = useState('');
    useEffect( () => {
        if(response !== null){
            const subRes = response.data;
            sDispatch({type: 'SET_SUBJECT', payload: subRes});
            if(sState){
                setSubject(subRes.subject)
            }
        }   
    },[params.id, response])
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
    {state.isLoggedIn && errorState && sState && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Create New Subject</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/subject`} className="btn btn-sm dark">
                            <span className="fa fa-arrow-left text-success mr-2"></span>
                        </Link>
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
                                <Form.Control name="subject" autoComplete="off"
                                defaultValue={subject}
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                } placeholder="Subject Name"/>
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
