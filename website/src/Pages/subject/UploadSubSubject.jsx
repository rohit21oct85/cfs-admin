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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';

export default function CreateSubSubject() {
    const history = useHistory();
    const params = useParams();
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {state: sState, dispatch: sDispatch} = useContext(SubjectContext);

    const formDataUpload = new FormData();

    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        if(formDataUpload == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Enter Subject Name'});
        }else{
            formDataUpload.append('subject', params.subject_name);
            formDataUpload.append('subject_id',  params.subject_id);
            response = await api.post('sub-subject/upload',formDataUpload);
            console.log(response);
            // }
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            history.push(`/sub-subject/${params.subject_name}/${params.subject_id}`);
        }
    }

    async function handelChange(e){
        const filename = e.target.files[0].name;
        const ext = filename.split('.')[1];
        if(ext === "csv"){
            formDataUpload.append('file', e.target.files[0]);
        }else{
            errorDispatch({type: 'SET_ERROR', payload: 'Only .csv files are allowed'});
        }
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
                    <h2>Upload SubSubject</h2>
                </div>
                {errorState.error && ( 
                            <Notification>{errorState.error}</Notification>
                        )}
                    
                {errorState.success && ( 
                    <Notification>{errorState.success}</Notification>
                )}
                <div className="dash-con-heading">
                    <div className="row">
                    <div className="col-md-1 pl-3">
                        {params.subject_name ? (
                            <Link to={`/sub-subject/${params.subject_name}/${params.subject_id}`} className="btn btn-sm dark">
                            <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
                            </Link>
                        ):(
                            <Link to={`/sub-subject`} className="btn btn-sm dark">
                            <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
                            </Link>
                        )}    
                    </div>
                    <div className="col-md-5 pl-0">
                        <a href="/sampledata/sub_subject_sample.csv" download>Download Sample File</a>
                    </div>
                    </div>
                </div>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <Form method="POST" className="col-md-6 p-0" encType="multipart/form-data">
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
                                            history.push(`/sub-subject/${subject_name.trim().replace(' ','-').toLowerCase()}/upload/${subject_id}`)
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
                                    Upload Sub Subject Name File .csv format only
                                </Form.Label>
                                <Form.Control name="sub_subject" autoComplete="off" type="file" accept=".csv,"
                                onChange={handelChange}
                                onKeyDown={ 
                                    event => {
                                        if(event.key === 'Enter'){
                                            event.preventDefault()
                                        }
                                    }
                                }/>
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
        
    )}  
    </>

)
}
