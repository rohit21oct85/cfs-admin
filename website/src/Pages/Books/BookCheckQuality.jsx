import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory, useLocation  } from "react-router-dom";
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import useSingleBook from '../../hooks/useSingleBook';
import useBookQCData from '../../hooks/useBookQCData';
import useChapterQuestions from '../../hooks/useChapterQuestions';


import { useToasts } from 'react-toast-notifications';

import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'

import BookSummery from './BookSummery'
import ChapterData from './ChapterData';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-classic-with-mathtype';


export default function BookCheckQuality() {

const history = useHistory();
const params = useParams();
const location = useLocation();
const { addToast } = useToasts();
const {state} = useContext(AuthContext);

const {data, isLoading} = useSingleBook();
const {data: qc_data, isLoading: qcd_loading} = useBookQCData();
const {data: qc_questions, isLoading: qc_loading} = useChapterQuestions();


let API_URL = '';
if(process.env.NODE_ENV === 'development'){
    API_URL = cons.LOCAL_API_URL;
}else{
    API_URL = cons.LIVE_API_URL;
}
const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+state.access_token
    }
};

const [formData, setFormData] = useState({});
const [error, setError] = useState();

const [checkeAnswered, setCheckAnswered] = useState(false);
const [answeredQuestion, setAnsweredQuestion] = useState({});

const temp_answerRef = useRef();

async function filteredAnswer(){
    const answered = qc_questions?.data?.filter(d => d._id === params.question_id);
    if(answered){
        setAnsweredQuestion(answered[0]);
        if(params.question_id){
            setCheckAnswered(true);
        }else{
            setCheckAnswered(false);
        }
    }
}
const queryClient = useQueryClient()
const [appApprovedLoading, setApprovedLoading] = useState(false);
const approvedMutation = useMutation(formData => {
    return axios.post(`${API_URL}chapter/qc-answers`, formData, options)
},{
onSuccess: () => {
    queryClient.invalidateQueries(`chapters-${params.isbn}`)
    setApprovedLoading(false);
    setCheckAnswered(false);
    history.push(`/book-check-quality/${params.isbn}/${params.book_id}`);
    var objDiv = document.getElementById("reviewDiv");
    objDiv.scrollTop = 0;
    addToast('Review added successfully', { appearance: 'success',autoDismiss: true });
}
});
const handleApproveAnswer = async (e) => {
    const temp_answer = formData.temp_answer === undefined 
                        ? temp_answerRef.current.props.data 
                        : formData.temp_answer;
    
    formData.temp_answer = temp_answer;
    formData.answer = temp_answer;
    formData.question_id = params.question_id;
    formData.flag = 'approved';
    formData.approved = true;
    formData.answered = false;
    formData.approved_at = Date.now();
    setApprovedLoading(true);
    await approvedMutation.mutate(formData);
}

useEffect(() => {
    filteredAnswer()
    return () => {
        filteredAnswer()
    }
}, [qc_questions,checkeAnswered, params.question_id])

const backUrl = params && params.review_id 
        ? `/book-rating-review/${params.isbn}/${params.book_id}`
        : `/books`;
return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
<div className="dashboard_main-container">
<div className="dash-main-head">
    <h2>Books Quality Check</h2>
</div>
{error && <Notification>{error.message}</Notification>}
{isLoading && <LoadingComp />}

<div className="dash-con-heading">
    <div className="col-md-12 row">
        <div className="p-0 ">
            <Link to={backUrl} className="btn btn-sm dark">
                <span className="fa fa-arrow-left"></span>
            </Link>
        </div>
        <div className="col-md-11 pl-0 ml-2">
            <p style={{ fontSize: '1.2em', marginBottom: '0px' }}>{data && data.BookName}</p>
        </div>
    </div>    
</div>
{!isLoading && (
<div className="dash-cont-start" style={{ height: '100vh'}}>
    <div className="subject-main-container pl-0 pt-0 pr-0 pb-0">    
        <div className="row col-md-12 pl-0">
            <div className="col-md-5 pr-0">
                <BookSummery data={data} qc_data={qc_data}/>
            </div>     
            <div className="col-md-7 pl-0">
                
                {params?.chapter_no === undefined && (
                <div className="subject-card" style={{ height: '74vh', width: '100%', overflowY: 'hidden', paddingRight: '10px', paddingBottom: '0px' }}>
                    
                    <div style={{ display: 'flex', flexContent: 'space-between' }}>
                        <b>All Chapters:</b>
                    </div>
                    <hr className="mt-1 mb-1"/>
                    
                    <div style={{height: '65vh', overflowY: 'scroll', paddingRight: '10px', paddingBottom: '0px'}}>
                    {qcd_loading && (<span className="fa fa-spinner"></span>)}
                    {!qcd_loading && qc_data?.details.map( data => {
                        
                        return (<ChapterData data={data} key={data._id.chapter_no}/>)
                    })}
                        </div>
                    </div>
                )}
                {params?.chapter_no && !checkeAnswered && (
                    <div className="subject-card" style={{ height: '74vh', overflow: 'hidden', width: '100%' }}>
                        
                        <div style={{ display: 'flex', flexContent: 'space-between' }}>
                        <button className="btn btn-sm text-success pt-0 pb-0 pl-0"
                        onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}`)}    
                        >
                            <span className="fa fa-arrow-left"></span>
                        </button>
                        <b>Chapter No: {params?.chapter_no}.&nbsp; {qc_questions?.data[0]?.chapter_name } </b>
                        </div>
                        <hr className="mt-1 mb-1"/>
                        <div style={{height: '60vh', overflowY: 'scroll', paddingRight: '10px', paddingBottom: '0px'}}>
                        {qc_loading && (<span className="fa fa-spinner"></span>)}
                        {!qc_loading && qc_questions?.data?.map( ques => {
                            return (
                                <div className="mt-2 p-2" style={{ border: '1px solid #ddd'}} key={ques._id}> 
                                
                                <div className="name-label pt-1">
                                    <strong>Q.No: {ques.problem_no}. &nbsp; </strong>
                                    {ques?.question} 
                                </div>
                                <hr className="mt-1 mb-1" /> 
                                
                                <div className="name-main">
                                    <button className="btn btn-sm text-success" style={{ borderRadius: '50%'}}
                                    onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${params.chapter_no}`)}
                                    >
                                       <span className="fa fa-question-circle-o"></span>
                                       &nbsp; 
                                       <b> Answer the Question</b>
                                    </button>
                                    {ques.answered && (
                                        <button className="btn btn-sm text-danger" style={{ borderRadius: '50%'}}
                                        onClick={e => {
                                            setCheckAnswered(true);
                                            history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${params.chapter_no}/${params.status}/${params.status == 'answered'? 'check_answer': 'submit_answer'}/${ques._id}`)
                                        }}
                                        >
                                           <span className="fa fa-question-circle-o"></span>
                                           &nbsp; 
                                           <b>
                                            QC the Answer
                                           </b>
                                        </button>
                                    )}
                                    
                                </div>

                            </div> 
                            )
                        })}
                        </div>
                    </div>
                )}

                {checkeAnswered && (
                    <div className="subject-card" style={{ height: '74vh', overflow: 'hidden', width: '100%' }}>
                        <div style={{ display: 'flex', flexContent: 'space-between' }}>
                        <button className="btn btn-sm text-success pt-0 pb-0 pl-0"
                        onClick={e => {
                            setCheckAnswered(false);
                            history.push(`/book-check-quality/${params.isbn}/${params.book_id}/${params.chapter}/${params.chapter_no}/${params.status}`)
                        }}    
                        >
                            <span className="fa fa-arrow-left"></span>
                        </button>
                        <b>Chapter No: {params?.chapter_no}.&nbsp; {qc_questions?.data[0]?.chapter_name } </b>
                        </div>
                        <hr className="mt-1 mb-1"/>
                        <div className="mt-2 p-2" style={{ border: '1px solid #ddd'}}>     
                            <div className="name-label pt-1">
                                <strong>Q.No: {answeredQuestion?.problem_no}. &nbsp; </strong>
                                {answeredQuestion?.question} 
                            </div>
                        </div> 
                        
                        <div className="mt-2 p-2" style={{ border: '1px solid #ddd'}}>     
                            <div className="name-label pt-1">
                                <strong>Answer: &nbsp; </strong>
                                 
                                <CKEditor
                                editor={ ClassicEditor }
                                config={{
                                    toolbar: {
                                        items: [
                                            'MathType', 'ChemType','heading', 
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'imageUpload',
                                            'mediaEmbed',
                                            'insertTable',
                                            'blockQuote',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                }}
                                ref={temp_answerRef}
                                data={answeredQuestion?.temp_answer}
                                defaultValue={answeredQuestion?.temp_answer}
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFormData( { ...formData, temp_answer: data } );
                                } }
                            />
                            </div>
                        </div> 
                        <div className="mt-2 p-2" style={{ border: '1px solid #ddd'}}>     
                            <div className="name-label pt-1">
                                <button className="btn btn-sm counter btn-success"
                                onClick={handleApproveAnswer}
                                >
                                  {appApprovedLoading ? (
                                      <>
                                      <span className="fa fa-spinner"></span> 
                                      &nbsp; processing....</>
                                  ) : (
                                    <>
                                    <span className="fa fa-check-circle-o"></span> 
                                    &nbsp; Approve Answer</>
                                  )}
                                   
                                </button>
                                <button className="btn btn-sm counter btn-warning ml-2">
                                    <span className="fa fa-check-circle-o"></span> 
                                    &nbsp; Send Back To Tutor
                                </button>
                                <button className="btn btn-sm counter btn-primary ml-2">
                                <span className="fa fa-backward"></span> 
                                    &nbsp; Send Back To Pool
                                </button>
                                
                                <button className="btn btn-sm btn-danger counter ml-2"
                                onClick={e => {
                                    setCheckAnswered(false);
                                    history.push(`/book-check-quality/${params.isbn}/${params.book_id}/${params.chapter}/${params.chapter_no}/${params.status}`)
                                }} >
                                <span className="fa fa-times"></span> 
                                    &nbsp; Cancel
                                </button>

                            </div>
                        </div>            

                    </div>
                )}        

            </div>     
        </div>
    </div>
</div>
)}


</div>
</div>
</div>

)}  
</>
)
}
