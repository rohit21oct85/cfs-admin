import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'


import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';

import * as util from '../../utils/MakeSlug';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import useChapters from '../../hooks/useChapters';


export default function UploadChapters() {
    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);

    const formDataUpload = new FormData();
    
    const [loading, setLoading] = useState(false);
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    };
    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        formDataUpload.append('file',  file);
        formDataUpload.append('book_id',  params.book_id);
        formDataUpload.append('book_name',  params.book_name);
        formDataUpload.append('book_isbn',  params.isbn);
        setLoading(true);
        setBtnDisbaled(true);
        try{
            if(data && data.problems === undefined){
                console.log("data created");
                response = await axios.post(`${API_URL}chapter/upload`,formDataUpload, options);
            }else{
                console.log("data Updated");
                response = await axios.post(`${API_URL}chapter/update-chapter-csv`,formDataUpload, options);
            }
            console.log(response);
            errorDispatch({type: 'SET_SUCCESS', payload: response.message});
            setBtnDisbaled(false);
            setLoading(false);
            history.push(`/book-chapters/${params.isbn}/${params.book_name}/${params.book_id}`);
        
        }catch(error){
            errorDispatch({type: 'SET_ERROR', payload: error.message});
            setBtnDisbaled(false);
            setLoading(false);
        }
        
    }

    const downloadCsv = async (e) => {
        try {
            const response = await axios.get(`${API_URL}chapter/download/${e.isbn}`, options);    
            const csvData = await util.ObjectToCsv(response.data.books);
            await util.downloadData(csvData, e.isbn);
        } catch (error) {
            console.log(error.message);
            errorDispatch({type: 'SET_ERROR', payload: error.messsage})
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

    const {data, isLoading} = useChapters();
    

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
                            <span className="fa fa-arrow-left"></span>
                            </Link>
                        ):(
                            <Link to={`/books`} className="btn btn-sm dark">
                            <span className="fa fa-arrow-left"></span>
                            </Link>
                        )}     
                    </div>
                    <div className="col-md-5 pl-0">
                        <a href="/sampledata/chapter_upload-9780131453401.csv" download>Download Sample File</a>
                    </div>
                    </div>
                </div>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                    <div className="col-md-12 row no-gutter p-0 mt-2">
                    <div className="col-md-6">
                        <p style={{ fontWeight: 'bold', fontSize: '1rem' }}>Uploaded Content for {data && data.book_isbn && (
                            <Link to={`/book-chapters/${params.isbn}/${params.book_name}/${params.book_id}`}>View Question: {data && data.book_isbn}</Link>
                        )}</p>
                        <hr />
                        {data && data.error === true && 
                            (<div>
                                <b>{data && data.message}</b>
                            </div>)
                        }
                        <div className="tbl tbl-responsive">
                        {data && data.error === false && 
                            <div>
                            <b>Total Problems</b>
                            </div>
                        }
                        
                        

                            
                            <div style={{ height: '180px',minHeight: '180px', overflowY: 'scroll', paddingRight: '10px' }}>
                            {data && data.error === false && data.problems.map( pro => {
                                return (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{ fontSize: '0.95rem' }}><b>Question No:</b> {pro.problem_no}</p>
                                    <p style={{ fontSize: '0.95rem' }}> {pro.question ? (
                                        <b>Question: <span style={{color: 'green'  }}> Uploaded </span></b>
                                    ): 
                                    (
                                        <b>Question: <span style={{color: 'red'  }}> Not Uploaded </span></b>
                                    )
                                }</p>
                                </div>
                                )
                            })}
                            </div>
                        </div>    
                        {   data && 
                            data.error === false &&  
                            data.problems.length > 0 && 
                            data.problems[0].question == '' &&
                             
                            <Button 
                            className="btn btn-sm dark mt-2"
                            onClick={downloadCsv.bind(this,{isbn: params.isbn} )}
                            >Download Uploaded CSV</Button> 
                        }
                    </div>  
                    
                    {!isLoading && (
                        <Form method="POST" className="col-md-6 pl-2" encType="multipart/form-data">
                        <Form.Group className="col-md-12">
                            <p style={{ textTransform: 'capitalize'  }}><b>
                                {util.GetName(params.book_name)}</b></p>
                            <hr />    
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
                            disabled={btnDisabled}
                            className="btn dark btn-sm">
                                {loading ? 'processing...': 'Upload Books'} 
                            </Button>
                        </Form.Group>
                        </Form>
                    )} 
                    
                     
                   
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
