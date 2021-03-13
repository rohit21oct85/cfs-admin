import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import BookImage from '../Books/BookImage';

export default function UploadChapters() {
    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);

    const formDataUpload = new FormData();
    
    const [loading, setLoading] = useState(false);
    async  function handleSubmit(e){
        e.preventDefault();
        
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
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    },[errorState.error, errorState.success]);

return (

    <>
    {state.isLoggedIn && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Upload Chapters</h2>
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
                    {/* <div className="col-md-3">
                        <BookImage bookname={params.book_name} isbn={params.isbn}/>
                    </div>     */}
                    <Form method="POST" className="col-md-8 p-0" encType="multipart/form-data">
                        <Form.Group className="col-md-12">
                            <Form.Label>
                                Book Name
                            </Form.Label>
                            <p style={{ textTransform: 'capitalize'  }}><b>
                                {params.book_name.replaceAll('-',' ')}</b></p>
                        </Form.Group>
                    
                    
                        <Form.Group className="col-md-6">
                            <Form.Label>
                                Book ISBN13
                            </Form.Label>
                            <p><b>{params.isbn}</b></p>
                        </Form.Group> 
                    
                    
                    <Form.Group className="col-md-6">
                        <Form.Label>
                            Choose Chapters File .csv format only
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

                    <Form.Group className="col-md-6">
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
