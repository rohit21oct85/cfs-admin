import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams, useLocation  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'


import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';

import * as util from '../../utils/MakeSlug';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import useChapters from '../../hooks/useChapters';
import useSingleBook from '../../hooks/useSingleBook'

import { useToasts } from 'react-toast-notifications';
import { v4 as uuidv4 } from 'uuid';

export default function UploadChapters() {
    const history = useHistory();
    const params = useParams();
    const location = useLocation();
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {data:singleBook} = useSingleBook();
    const { addToast } = useToasts();
    const formDataUpload = new FormData();
    
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        if(location.pathname === '/books-upload-chapters'){
            history.push(`/books/upload-chapters`)
        }
    },[state, params?.isbn]);

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
            const response = await axios.get(`${API_URL}chapter/download/${e.isbn}`);    
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
    const [questions, setQuestions] = useState([]);
    
    const [apiData, setApiData] = useState(true);
    const handleImportQuestions = async () => {
        setLoading(true);
        const isbn = params?.isbn
        const response = await axios.get(`https://backup.crazyforstudy.com/api/get-book-question.php?accessKey=crazyforstudy&isbn=${isbn}`);    
        if(response){
            const questionData = response?.data;
            questionData.forEach(question => {
                question.uuid = uuidv4();
            })
            setQuestions(questionData)
            setLoading(false)
        }else{
            setQuestions([])
        }
    }
    useEffect(()=> {
        if(data?.problems?.length > 0){
            setApiData(false);
        }
    }, [data, apiData])
    
    const [submitData, setSubmitData] = useState(false);
    const handleUploadQuestion = async () => {
        setSubmitData(true);
        questions.forEach((ques, index) => {
            let c_name = questions[index].chapter_name.split("  ");
            ques.book_isbn = params?.isbn;
            if(ques.chapter_no === ''){
                ques.chapter_no = c_name[1];
            }
            ques.book_id = params?.book_id;
            ques.book_name = params?.book_name;
        })
        // console.log(questions); 
        // return;
        const response = await axios.post(`${API_URL}chapter/import-data`,questions,options);
        if(response.status === 201){
            setSubmitData(false);
            addToast('Books Data Uploaded successfully', { appearance: 'success',autoDismiss: true });
            history.push(`/books/upload-chapters`)
        }
    }
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
                    <div className="pl-3 mr-2">
                    {params.subject_name ? (
                            <Link to={`/books-upload-chapters`} className="btn btn-sm dark">
                            <span className="fa fa-arrow-left"></span>
                            </Link>
                        ):(
                            <Link to={`/books-upload-chapters`} className="btn btn-sm dark">
                            <span className="fa fa-arrow-left"></span>
                            </Link>
                        )}     
                    </div>
                    <div className="pl-0">
                        <button className="btn btn-sm dark"
                        onClick={e => setApiData(!apiData)}>
                            {apiData ? 'Upload Data Via CSV': 'Import Book Questions Via API'}
                        </button>

                    </div>
                    {!apiData && (
                        <div className="pl-0 ml-2">
                            <a href="/sampledata/chapter_upload-9780131453401.csv" className="btn btn-sm dark" download>Download Sample File</a>
                        </div>
                    )}
                    
                    

                    </div>
                </div>

                <div className="dash-cont-start">
                    <div className="org-main-area">
                    {!apiData && (  
                    <>    
                    <div className="col-md-12 pl-0" style={{ textTransform: 'capitalize', fontWeight: 'bold'  }}>
                        
                        <span>ISBN {params.isbn} &nbsp; </span>
                        <span>{util.GetName(params.book_name)}</span>

                        {data && data.book_isbn && (
                            <Link
                            className="btn btn-sm dark pull-right" to={`/books-chapters/${params.isbn}/${params.book_name}/${params.book_id}`}>View Question</Link>
                        )}
                    </div>
                    <hr className="mb-1 mt-2"/>
                    <div className="clearfix"></div>
                    <div className="col-md-12 row no-gutter mt-2">
                    {!isLoading && (
                    <div className="col-md-3 pl-0">
                    <p><b>Upload Chapters</b></p>    
                    <hr className="mb-1"/>
                    <Form method="POST" encType="multipart/form-data">
                        <Form.Group className="col-md-12 pl-0">
                            <Form.Label>
                                Choose .csv format only
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

                        <Form.Group className="col-md-12 pl-0">
                            <Button 
                            onClick={handleSubmit}
                            disabled={btnDisabled}
                            className="btn dark btn-sm">
                                {loading ? 'processing...': 'Upload Books'} 
                            </Button>
                        </Form.Group>
                        </Form>
                        </div>       
                    )} 
                    
                    <div className="col-md-9 pl-0">
                        <p><b>All Chapters Questions {data?.problems?.length} </b> 
                        </p>    
                        <hr className="mb-1"/>
                        {data?.error === true && 
                            (
                            <>    
                            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                                <button className="btn btn-sm dark"> 
                                    {data?.message}
                                </button>
                            </div>
                            </>
                        )}
                        <div className="tbl tbl-responsive">
                            <div style={{ display: 'flex', justifyContent: 'space-between',paddingRight: '15px', background: '#efefef' }}>
                                <div style={{ fontSize: '0.95rem' }}><b>Question No:</b> </div>
                                <div style={{ fontSize: '0.95rem',marginRight:'55px' }}><b>Old QID:</b></div>
                                <div style={{ fontSize: '0.95rem',marginRight:'15px' }}><b> Question</b> </div>
                            </div>
                            <hr className="mb-1 mt-0"/>    
                        <div style={{ height: '180px',minHeight: '180px', overflowY: 'scroll', paddingRight: '15px' }}>
                            {data?.problems?.map( pro => {
                                return (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}
                                key={pro?._id}>
                                    <div style={{ fontSize: '0.95rem' }}>{pro.problem_no}</div>
                                    <div style={{ fontSize: '0.95rem' }}>{pro.old_qid}</div>
                                    <div style={{ fontSize: '0.95rem',marginRight:'15px' }}> 
                                    {pro.question ? (
                                        <b><span style={{color: 'green'  }}> Uploaded </span></b>
                                    ): 
                                    (
                                        <b><span style={{color: 'red'  }}> Not Uploaded </span></b>
                                    )}
                                    </div>
                                </div>
                                )
                            })}
                            </div>
                        </div>    
                        {
                            data?.error === false &&  
                            data?.problems?.length > 0 && 
                            data?.problems[0]?.question == '' &&
                             
                            <Button 
                            className="btn btn-sm dark mt-2"
                            onClick={downloadCsv.bind(this,{isbn: params.isbn} )}
                            >Download Uploaded CSV</Button> 
                        }
                    </div>  
                     
                   
                    </div> 
                    </>   
                    )}

                    {apiData && (
                        <div className="col-md-12 row no-gutter p-0 mt-2">
                            <div className="col-md-12">
                            <button className="btnb tn-sm dark"
                            onClick={handleImportQuestions}
                            >
                            {loading ? (
                                <><span className="fa fa-spinner mr-2"></span> Loading .... </>
                            ) : 
                            (
                                <><span className="fa fa-download"></span> Import API Data</>
                            )}
                            </button> 

                            {questions?.length > 0 && (
                                <div className="pull-right">
                                {questions?.length > 1 ? (
                                    <button className="btnb tn-sm ml-2 dark"
                                    onClick={handleUploadQuestion}
                                    >
                                    {submitData ? (
                                        <><span className="fa fa-spinner mr-2"></span> Uploading .... </>
                                    ) : 
                                    (
                                        <><span className="fa fa-download mr-2"></span> Upload {questions?.length} Questions</>
                                    )}
                                    </button>
                                ) : (
                                    <button className="btnb tn-sm ml-2 dark">No Questions Available</button>
                                )}    
                                
                                <button className="btn dark btn-sm ml-2"
                                onClick={e => {
                                    e.preventDefault();
                                    history.push(`/books/${singleBook?.subject_name}/${singleBook?.sub_subject_name}/${singleBook?.sub_subject_id}`)
                                }}>
                                    <span className="fa fa-times mr-2"></span>Cancel</button>
                                </div>
                            )}
                            </div>
                            <hr />
                            
                            <div className="col-md-12 table-responsive">
                                <div className="table table-bordered">
                                    <div className="col-md-12 mt-2 pb-2 pt-2" style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #000', background: '#efefef'}}>
                                        <div className="col-md-3 text-left">QID</div>
                                        <div className="col-md-3 text-left">Problem No</div>
                                        <div className="col-md-3 text-left">Chapter Name</div>
                                        <div className="col-md-3 text-left">Question</div>
                                    </div>
                                    <div className="col-md-12" style={{ height: '400px', overflowX: 'hidden', overflowY: 'scroll'}}>
                                    {questions?.length > 1 && questions?.map(ques => {
                                        return(
                                        <div className="col-md-12 mb-2 mt-2 pl-0 pb-2" key={ques?.uuid}
                                        id={ques?.uuid} 
                                        style={{ display: 'flex', justifyContent: 'space-around', borderBottom: '1px solid #000'}}>
                                            <div className="col-md-3 text-left">{ques?.old_qid ? ques?.old_qid : 'No Old Question Id'}</div>
                                            <div className="col-md-3 text-left">{ques?.problem_no}</div>
                                            <div className="col-md-3 text-left">{ques?.chapter_name}</div>
                                            <div className="col-md-3 text-left">{ques?.question ? (
                                                <>
                                                <span>
                                                    {util.GetString(ques?.question,50)}...
                                                </span>
                                                </>
                                            ): (
                                                <>
                                                    <span className="text-danger">No Question Available</span>
                                                </>
                                            )}</div>
                                        </div>
                                    
                                        );
                                    })}
                                </div>
                                
                                </div>
                                </div>
                            
                        </div>
                    )}
                    </div>
                </div>

            </div>
        </div>
        
    </div>
        
    )}  
    </>

)
}
