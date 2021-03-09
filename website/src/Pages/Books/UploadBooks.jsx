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

export default function UploadBooks() {
    const history = useHistory();
    const params = useParams();
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {state: sState, dispatch: sDispatch} = useContext(SubjectContext);

    const formDataUpload = new FormData();
    const [subSubjectName, setSubSubjectName] = useState(null);
    const [subSubjectId, setSubSubjectId] = useState(null);
    async  function handleSubmit(e){
        e.preventDefault();
        console.log(formDataUpload.file);
        // return;
        let response = null;
        if(formDataUpload.sub_subject_name == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Select sub subject'});
        }else{
            formDataUpload.append('subject_name', params.subject_name);
            formDataUpload.append('subject_id',  params.subject_id);
            formDataUpload.append('sub_subject_name',  subSubjectName);
            formDataUpload.append('sub_subject_id',  subSubjectId);
            formDataUpload.append('file',  file);
            
            response = await api.post('books/upload',formDataUpload);
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            history.push(`/books`);
        }
    }
    const [btnDisabled, setBtnDisbaled] = useState(true)
    const [fileDisabled, setFileDisbaled] = useState(true)
    const [file, setFile] = useState(null);
    async function handelChangeUpload(e){
        const filename = e.target.files[0].name;
        console.log('file onchange ' ,  filename);
        const ext = filename.split('.')[1];
        console.log(ext)
        if(ext === "csv"){
            setBtnDisbaled(false);
            setFile(e.target.files[0]);
            formDataUpload.append('file', e.target.files[0]);
        }else{
            setBtnDisbaled(true);
            errorDispatch({type: 'SET_ERROR', payload: 'Only .csv files are allowed'});
        }
    }
    const {response} = useAxios({
        method: 'get', url: 'subject/all'
    });
    
    const {response:subsubjectResponse} = useAxios({
        method: 'get', url: `sub-subject/subject/${params.subject_id}`
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
        if(subsubjectResponse !== null){
            const SubSubRes = subsubjectResponse.data;
            sDispatch({type: 'GET_ALL_SUB_SUBJECT', payload: SubSubRes});
            
        }   
    },[response, subject, subsubjectResponse]);

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
                    <h2>Upload Books {params.subject_name}</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        {params.subject_name ? (
                            <Link to={`/books-upload`} className="btn btn-sm dark">
                            <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
                            </Link>
                        ):(
                            <Link to={`/books`} className="btn btn-sm dark">
                            <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
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

                        <Form method="POST" className="col-md-6 p-0" encType="multipart/form-data">
                            <Form.Group>
                                <Form.Label>Subject Name</Form.Label>
                                {params.subject_name ? (
                                    <Form.Control 
                                    name="subject" autoComplete="off"
                                    defaultValue={params.subject_name}
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

                                            history.push(`/books-upload/${subject_name.trim().replace(' ','-').toLowerCase()}/${subject_id}`)
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
                            
                        {params.subject_name && (
                            <>
                            <Form.Group>
                            <Form.Label>SubSubject Name</Form.Label>
                            <select className="form-control" name="sub_subject" autoComplete="off"
                            onChange={ 
                                event => {
                                    const value = event.target.value;
                                    const subject_name = value.split('_')[0];
                                    const sub_subject_id = value.split('_')[1];
                                    const sub_subject_name = subject_name.trim().replace(' ','-').toLowerCase();
                                    
                                    setSubSubjectName(sub_subject_name);
                                    setSubSubjectId(sub_subject_id);
                                    setFileDisbaled(false);
                                    
                                }
                            } >
                                <option>Select Sub Subject</option>
                                {sState.SubSubjects.map( subsubject => {
                                    const sub_subject = subsubject.sub_subject.toLowerCase().trim().replaceAll(' ','-');
                                    const subSubjectId = sub_subject+'_'+subsubject._id;
                                    return (
                                    <option key={subsubject._id} value={subSubjectId}>{sub_subject}</option>
                                    )
                                })}
                            </select>
                            </Form.Group>
                            </>
                        )}
                                
                            
                        <Form.Group>
                            <Form.Label>
                                Upload Books File .csv format only
                            </Form.Label>
                            <Form.Control name="books" autoComplete="off" type="file" accept=".csv,"
                            disabled={fileDisabled}
                            onChange={handelChangeUpload}
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
                            disabled={btnDisabled}
                            className="btn dark btn-sm">
                                Upload Books
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
