import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory, useLocation  } from "react-router-dom";
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import useSingleBook from '../../hooks/useSingleBook';
import useBookQCData from '../../hooks/useBookQCData';
import useChapterQuestions from '../../hooks/useChapterQuestions';


import SingleBook from './SingleBook';
import { useToasts } from 'react-toast-notifications';

import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import BookImage from './BookImage';

export default function BookCheckQuality() {

const history = useHistory();
const params = useParams();
const location = useLocation();
const { addToast } = useToasts();
const {state} = useContext(AuthContext);

const {data, isLoading} = useSingleBook();
const {data: qc_data, isLoading: qcd_loading} = useBookQCData();
const {data: qc_questions, isLoading: qc_loading} = useChapterQuestions();
console.log(qc_data?.details)
// console.log([...qc_data?.details,...qc_data?.details_2])
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
const [rating, setRating] = useState('');
const [error, setError] = useState();
const [loading, setLoading] = useState(false);

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
               <div className="subject-card" style={{ width: '90%'}}>
                    <div className="row col-md-12 pr-0">
                        <div className="col-md-4 pl-0 pr-0">
                            <BookImage isbn={data.ISBN13} width="76%" />
                        </div>
                        <div className="col-md-8 pr-0 pl-0">
                            <div className="admin-name mt-0 mb-3"> 
                                <div className="name-label">
                                    Author: 
                                </div>
                                <div className="name-main">
                                    {data.Author1}
                                </div>
                            </div>
                            <div className="admin-name mt-3 mb-3"> 
                                <div className="name-label">
                                    ISBN-13: 
                                </div>
                                <div className="name-main">
                                    {data.ISBN13}
                                </div>
                            </div>
                            <div className="admin-name mt-3 mb-3"> 
                                <div className="name-label">
                                    Subject: 
                                </div>
                                <div className="name-main">
                                    {data.subject_name}/{data.sub_subject_name}
                                </div>
                            </div>
                            <div className="admin-name mt-1 mb-1"> 
                                <div className="name-label">
                                    Total Reviews: 
                                </div>
                                <div className="name-main">
                                    {data.reviews.length}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <hr className="pt-2"/> 
                    <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
                        <div className="name-label pt-1">
                            Total Question: 
                        </div>
                        <div className="name-main">
                            <button className="counter">
                                Total - {qc_data?.total_question}
                            </button>
                        </div>
                    </div> 
                    <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
                        <div className="name-label pt-1">
                            Pending For QC: 
                        </div>
                        <div className="name-main">
                            <button className="counter">
                                Total - {qc_data?.total_pending_qc ? qc_data?.total_pending_qc: '0'}
                            </button>
                            
                        </div>
                    </div> 
                    <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
                        <div className="name-label pt-1">
                            Solved: 
                        </div>
                        <div className="name-main">
                            <button className="counter">
                                Total - {qc_data?.total_approved ? qc_data?.total_approved: '0'}
                            </button>
                        </div>
                    </div> 
                    
                    
                    <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
                        <div className="name-label pt-1">
                            Total Reworked: 
                        </div>
                        <div className="name-main">
                            <button className="counter">
                                Total -  {qc_data?.total_rework ? qc_data?.total_rework: '0'}
                            </button>
                           
                        </div>
                    </div> 
                    <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
                        <div className="name-label pt-1">
                            Total Rejected: 
                        </div>
                        <div className="name-main">
                            <button className="counter">
                                Total -  {qc_data?.total_unsolved ? qc_data?.total_unsolved: '0'}
                            </button>
                        </div>
                    </div> 
                   
                </div>
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
                    {!qcd_loading && qc_data?.details.map( (data, index) => {
                        
                        return (
                        <div className="mt-2 p-2" style={{  border: '1px solid #ddd'}} key={data._id.chapter_no}> 
                            <div className="name-label pt-1">
                                <strong>{data._id.chapter_no}. &nbsp; </strong>
                                {data._id.chapter_name} 
                            </div>
                            <hr />
                            <div className="admin-name" style={{display: 'flex', justifyContent: 'start',}}>
                                <button className="counter text-success mr-2"
                                onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}`)}
                                >
                                Pending in QC -- {data.answered}
                                </button>
                                <button className="counter text-danger"
                                onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}`)}
                                >
                                Total Question -- {data.count}
                                </button>
                                
                            </div>
                        </div>   
                        )
                    })}
                        </div>
                    </div>
                )}
                {params?.chapter_no && (
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
                                <div className=" mt-2 p-2" style={{ border: '1px solid #ddd'}} key={ques._id}> 
                                <div className="name-label pt-1">
                                    <strong>Q.No: {ques.problem_no}. &nbsp; </strong>
                                    {ques?.question} 
                                </div>
                                <hr className="mt-1 mb-1" /> 
                                <div className="name-main">
                                    <button className="btn btn-sm dark" style={{ borderRadius: '50%'}}
                                    onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}`)}
                                    >
                                       <span class="fa fa-question-circle-o"></span>
                                       &nbsp; 
                                       Answer the Question
                                    </button>
                                    
                                </div>
                            </div> 
                            )
                        })}
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
