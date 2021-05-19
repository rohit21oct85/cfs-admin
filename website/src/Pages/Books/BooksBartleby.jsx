import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory, useLocation  } from "react-router-dom";
import {AuthContext} from '../../context/AuthContext';

import { useToasts } from 'react-toast-notifications';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import { v4 as uuidv4 } from 'uuid';
import useBookByISBN from '../../hooks/useBookByISBN';
import useBartelbyChapters from '../../hooks/useBartelbyChapters';
import useQuestionAnswers from '../../hooks/useQuestionAnswers';
import Answers from './Answers'

export default function BooksBartleby() {

const history = useHistory();
const params = useParams();
const location = useLocation();
const { addToast } = useToasts();
const {state} = useContext(AuthContext);
const {data:singleBook} = useBookByISBN();
const {data:chapters} = useBartelbyChapters();
const [sectionId,setSectionId] = useState('');
const [questionsData, setQuestionsData] = useState([]);

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

const queryClient = useQueryClient();

useEffect(getSampleJSON,[params, singleBook])
async function getSampleJSON(){
    if(singleBook && singleBook[0]?.bartlyby_imported === false){
        const response = await axios.get(`https://www.crazyforstudy.com/api/chapters.php?isbn=${params?.isbn}`);
        const sections = response?.data?.data?.bookSections
        let chaptersData = [];
        sections?.map(section => {
            chaptersData.push({
                book_isbn: params?.isbn,
                section_id: section?.bookSectionId,
                chapter_no: section?.sequenceText, 
                chapter_name: section?.title,
            })
        })
        await importBarteybyChapters.mutate({bartley: chaptersData, book_isbn: params?.isbn});
    }
    
}
const importBarteybyChapters = useMutation( formData => {
    return axios.post(`${API_URL}chapter/bartley-chapters`,formData, options);
},{
    onSuccess: () => {
        queryClient.invalidateQueries([`chapters-bartelby-${params?.isbn}-${params?.status}`]);
    }
})

const [fetching, setFetching] = useState(false);

const updateImportChapters = useMutation(formData => {
    return axios.post(`${API_URL}chapter/bartelby-update-chapters`, formData, options)
},{
onSuccess: () => {
    queryClient.invalidateQueries([`chapters-bartelby-${params?.isbn}-${params?.status}`]);
    history.push(`/books-bartleby/${params.isbn}/${params?.status}/${chapters?.data[1]?.section_id}`);
    addToast('Question Imported', { appearance: 'success',autoDismiss: true });
}
});
const [formData] = useState({});
async function importQuestion(){
    if(params?.section_id){
        setFetching(true);
        let sectionResponse = await axios.get(`https://nk6xemh85d.execute-api.us-east-1.amazonaws.com/prod/solution/${params?.isbn}/section-questions/${params?.section_id}`);
        const questions = sectionResponse?.data?.data?.questions;
        questions?.map(async question => {
            let questionResponse = await axios.get(`https://nk6xemh85d.execute-api.us-east-1.amazonaws.com/prod/solution/${question?.solutionId}/${params?.isbn}`);
            let responseData = questionResponse?.data?.data?.solutionJson?.solutionSections;
            setQuestionsData(questionData => [...questionData, {
                uuid: uuidv4(),
                problem_no: question?.questionTitle,
                question: question?.questionText,
                answer: responseData
            }]);    
        });
        let importedData = await chapters?.data?.filter( chapter => chapter?.section_id === params?.section_id);
        setImported(importedData && importedData[0]);
    }else{
        addToast('Please select chapters', { appearance: 'error',autoDismiss: true });
    }
    
}
const [imported, setImported] = useState({});
const [uploaded, setUploaded] = useState(false);
const [ViewUploaded, setViewUploaded] = useState(false);

const uploadChapterQuestion = useMutation(formData => {
    return axios.post(`${API_URL}chapter/bartelby-upload-data`, formData, options)
},{
onSuccess: () => {
    queryClient.invalidateQueries('chapters-bartelby');
    setQuestionsData([]); 
    setFetching(false);
    setUploaded(false)
    addToast('Question Uploaded', { appearance: 'success',autoDismiss: true });
}
});
async function exportQuestion(){
    setUploaded(true)
    let book_id = singleBook && singleBook[0]?._id
    let book_name = singleBook && singleBook[0]?.BookName
    questionsData.map(question => {
        question.old_qid = question?.uuid;
        question.book_id = book_id;
        question.book_name = book_name;
        question.book_isbn = params?.isbn;
        question.chapter_no = imported?.chapter_no;
        question.chapter_name = imported?.chapter_name;
        question.answer = JSON.stringify(question?.answer);
    });

    // console.log("after append " , questionsData); return;
    await uploadChapterQuestion.mutate({chapters: questionsData, book_isbn: params?.isbn});
    formData['book_isbn'] = params?.isbn;
    formData['section_id'] = params?.section_id;
    await updateImportChapters.mutate(formData);
}

const {data:TBookQuestionAnswers} = useQuestionAnswers();
console.log(TBookQuestionAnswers?.length)
return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
    <div className="main-area-all">
    <div className="dashboard_main-container">
    <div className="dash-main-head">
        <h2>Bartleby  Text Books Solution Manuals - ISBN: {params?.isbn}</h2>
    </div>

    <div className="dash-con-heading">
        <div className="col-md-12 row">
            <div className="p-0">
                <Link to="/books" className="btn btn-sm dark">
                    <span className="fa fa-arrow-left"></span>
                </Link>
            </div>
            <div className="p-0 ml-2">
                <button className="btn btn-sm dark"
                onClick={e => { 
                    e.preventDefault(); 
                    history.push(`/books-bartleby/${params?.isbn}/import-chapter`)
                    setViewUploaded(false);

                }}
                >
                    <span className="fa fa-download mr-2"></span>
                    Import Chapters
                </button>
            </div>
            
            <div className="p-0 ml-2">
                <button className="btn btn-sm dark"
                onClick={e => { 
                    e.preventDefault(); 
                    history.push(`/books-bartleby/${params?.isbn}/view-uploaded-chapter`)
                    setViewUploaded(true);
                }}
                >
                    <span className="fa fa-download mr-2"></span>
                    View Uploaded Chapters
                </button>
            </div>

               
        </div>    
    </div>
    {params?.status === "import-chapter" && (
        <>
        <div className="dash-con-heading">
        <div className="col-md-12 row">
            <div className="col-md-8 pl-0">
                <select className="form-control"
                    value={params?.section_id}
                    id={params?.section_id}
                    onChange={e => {
                        let section_id = e.target.value;
                        setFetching(false);
                        setQuestionsData([])
                        if(section_id === '_'){
                            history.push(`/books-bartleby/${params?.isbn}/${params?.status}`)
                        }else{
                            setSectionId(section_id)
                            history.push(`/books-bartleby/${params?.isbn}/${params?.status}/${section_id}`)
                        }
                    }}
                >
                    <option value="_">Select Chapters</option>
                    {chapters?.data?.map(chapter => {
                    return(
                        <option 
                            value={chapter?.section_id} 
                            key={chapter?.section_id}
                        >
                            Chapter {chapter?.chapter_no} - {chapter?.chapter_name}</option>
                    );
                })}
                </select>
            </div>
            <div className="col-md-3">
                <button className="btn btn-md dark"
                onClick={importQuestion}
                disabled={fetching}
                title="Import Question"
                >
                    {fetching ? (
                        <div className="spinner-border" style={{width: '16px', height:'16px'}} role="status"> 
                            <span className="sr-only">Loading...</span> 
                        </div>
                    ) : (
                        <span className="fa fa-download"></span>
                    )}
                </button>
                {questionsData?.length > 0 && (
                    <button className="btn btn-md dark ml-2"
                    onClick={exportQuestion}
                    disabled={uploaded}
                    >
                        {uploaded ? (
                            <div className="spinner-border" style={{width: '16px', height:'16px'}} role="status"> 
                                <span className="sr-only">Loading...</span> 
                            </div>
                        ) : (
                            <span className="fa fa-upload"></span>
                        )}
                    </button>
                )}
            </div> 
               
        </div>    
    </div>
    <div className="dash-cont-start" style={{ height: '90vh'}}>

        <div className="col-md-12 pl-0 pr-2">
            <div className="col-md-12 bb-1 p-2" style={{ display: 'flex', flexContent: 'space-between', background:'#ededed'}}>
                <div style={{width: '10%'}}> Problem No</div>
                <div style={{width: '70%'}}> Question</div>
                <div style={{width: '20%'}}> Available Answer</div>
            </div>
            <div className="col-md-12 pl-0 bb-1 pr-0 mb-2" style={{ height: '450px', overflow: 'scroll'}}>
            {questionsData?.map(ques => {
                return(
                <div className="col-md-12 pl-0 pr-0 mt-2 mb-2 pb-2 bb-1" 
                    key={ques?.uuid}
                    style={{ display: 'flex', flexContent: 'space-between'}}>
                    <div className="pl-2 pt-2" style={{width: '10%'}}>{ques?.problem_no}</div>
                    <div className="pl-2 pt-2" style={{width: '70%'}}>{ques?.question}</div>
                    <div className="pl-2 pt-2" style={{width: '20%'}}>{ques?.answer?.length > 0 ? (<span className="badge-success p-1"> Available </span>): (<span className="badge-danger p-1"> Not Available </span>)}</div>
                </div>  
                )     
            })}
            </div>
        </div>
    </div>
    </>
    )}
    {params?.status === "view-uploaded-chapter" && (
        <div className="dash-cont-start" style={{ height: '90vh'}}>
        <div className="row col-md-12 pr-0">
            <div className="col-md-4 pl-0">
            <h5>All Uploaded Chapters</h5>
            <hr className="clearfix mb-3 mt-1"/>    
            <div style={{ height: '520px', overflow: 'scroll'}}
            className="pr-2">
                {chapters?.data?.map(chapter => {
                    return(
                        <div key={chapter?.section_id}
                        className="card mb-1 pl-2 pr-2 pt-2 br-10"
                        id={chapter?.section_id}
                        style={{ cursor: 'pointer', border: `${params?.section_id === chapter?.section_id ? '1px solid  green':''}`}}
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/books-bartleby/${params?.isbn}/view-uploaded-chapter/${chapter?.section_id}`)
                        }}
                        >
                            <p className="mt-0 mb-1"><b>Chapter {chapter?.chapter_no} </b></p>
                            <hr className="mt-1 mb-1"/>
                            {chapter?.chapter_name}
                        </div>
                    );
                })} 
            </div>
            </div>
            
            <div className="col-md-8 pl-0 pr-0">
            <h5>Question & Answers: </h5>
            <hr className="clearfix mb-3 mt-1"/>    
            <div style={{ height: '520px', overflow: 'scroll'}}
            className="pr-2">
                {TBookQuestionAnswers?.data?.map(chapter => {
                    let answers = '';
                    if(chapter?.answer !== undefined){
                        answers = JSON.parse(chapter?.answer);
                    }else{
                        answers = [{}];
                    }
                    return(
                        <div key={chapter?._id}
                        className="card mb-1 pl-2 pr-2">
                        <h6 className="mt-3">Problem No: {chapter?.problem_no}</h6>
                        <hr className="mt-2 mb-2"/>
                        <b className="text-danger mb-2">
                        Question: {chapter?.question}
                        </b>    
                        {answers?.length > 0 && (
                            <>
                            <div>
                            <hr className="mt-2 mb-2"/>    
                            <b>Answer: </b>
                            <hr className="mt-2 mb-2"/>
                            <Answers answers={answers}/>
                            </div>
                            </>
                        )}
                        
                        </div>   

                        
                    );
                })} 
                {TBookQuestionAnswers?.length == '0' && (
                    <h4>No Data Available</h4>
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
