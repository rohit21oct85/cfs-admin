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
    const [loading, setLoading] = useState(false);
    async  function handleSubmit(e){
        e.preventDefault();
        console.log(formDataUpload.file);
        // return;
        let response = null;
        if(formDataUpload.sub_subject_name == ''){
            errorDispatch({type: 'SET_ERROR', payload: 'Please Select sub subject'});
        }else{
            formDataUpload.append('file',  file);
            setLoading(true);
            setBtnDisbaled(true);
            response = await api.post('books/bulk-upload',formDataUpload);
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            setBtnDisbaled(false);
            setLoading(false);
            history.push(`/books`);
        }
    }
    const [btnDisabled, setBtnDisbaled] = useState(true)
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
                            <Link to={`/books-upload`} className="btn btn-sm dark">
                            <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
                            </Link>
                        ):(
                            <Link to={`/books`} className="btn btn-sm dark">
                            <FontAwesomeIcon icon={faHandPointLeft} className="text-white mr-2"  varient="solid"/>
                            </Link>
                        )}     
                    </div>
                    <div className="col-md-5 pl-0">
                        <a href="/sampledata/book_bulk_upload.csv" download>Download Sample File</a>
                    </div>
                    </div>
                </div>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-12 no-gutter p-0 mt-2">
                        

                        <Form method="POST" className="col-md-6 p-0" encType="multipart/form-data">
                            
                        <Form.Group>
                            <Form.Label>
                                Upload Books File .csv format only
                            </Form.Label>
                            <Form.Control name="books" autoComplete="off" type="file" accept=".csv,"
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
                            disabled={!loading && btnDisabled}
                            className="btn dark btn-sm">
                               {loading ? 'processing...': 'Upload Books'} 
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
