import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import './MathJaxStyle.css'
import '../Chapters/math.css'
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
import { htmlConverterReact } from 'html-converter-react';
import Button from './Button';

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
        questions?.map(async (question, index) => {
            let questionResponse = await axios.get(`https://nk6xemh85d.execute-api.us-east-1.amazonaws.com/prod/solution/${question?.solutionId}/${params?.isbn}`);
            let responseData = questionResponse?.data?.data?.solutionJson?.solutionSections;
            setQuestionsData(questionData => [...questionData, {
                uuid: uuidv4(),
                sequence: index,
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
    addToast('Question Uploaded', { appearance: 'success',autoDismiss: true });
    setTimeout( () => {
        setQuestionsData([]); 
        setFetching(false);
        setUploaded(false)
    },2000)

}
});
async function exportQuestion(){
    setUploaded(true)
    let book_id = singleBook && singleBook[0]?._id
    let book_name = singleBook && singleBook[0]?.BookName
    questionsData.map((question, index) => {
        question.sequence = question?.sequence;
        question.source = "bartelby";
        question.section_id = params?.section_id;
        question.old_qid = question?.uuid;
        question.book_id = book_id;
        question.book_name = book_name;
        question.book_isbn = params?.isbn;
        question.chapter_no = imported?.chapter_no;
        question.chapter_name = imported?.chapter_name;
        question.answer = JSON.stringify(question?.answer);
    });
    // console.log("after append " , questionsData); return;

    await uploadChapterQuestion.mutate({chapters: questionsData, book_isbn: params?.isbn, section_id: params?.section_id});
    formData['book_isbn'] = params?.isbn;
    formData['section_id'] = params?.section_id;
    await updateImportChapters.mutate(formData);
}

const {data:TBookQuestionAnswers, isLoading: TBQALoading} = useQuestionAnswers();
// console.log(TBookQuestionAnswers?.data?.length)

async function handleReImport(){
    let formData = {
        section_id: params?.section_id,
        book_isbn: params?.isbn
    };
    await UpdateChaptersStatus.mutate(formData);
}
const UpdateChaptersStatus = useMutation(formData => {
    return axios.post(`${API_URL}chapter/bartelby-chapter-change-status`, formData, options)
},{
onSuccess: () => {
    queryClient.invalidateQueries('chapters-bartelby');
    setQuestionsData([]); 
    setFetching(false);
    setUploaded(false)
    history.push(`/books-bartleby/${params?.isbn}/import-chapter/${params?.section_id}`);
}
});
const [clearing, setClearing] = useState(false);
async function handleClearChapter(){
    setClearing(true)
    let formData = {
        section_id: params?.section_id,
        book_isbn: params?.isbn
    };
    await ClearChapters.mutate(formData);
}
const ClearChapters = useMutation(formData => {
    return axios.post(`${API_URL}chapter/bartelby-clear-chapter`, formData, options)
},{
onSuccess: () => {
    queryClient.invalidateQueries('chapters-bartelby');
    setQuestionsData([]); 
    setFetching(false);
    setUploaded(false)
    setClearing(false)
    history.push(`/books-bartleby/${params?.isbn}/import-chapter/${params?.section_id}`);
}
});

const [clearingAll, setClearingAll] = useState(false);
const [enterPassword, setEnterPassword] = useState(false);
const [clearPassword, setClearPassword] = useState('Enter Clear Password');
async function handleClearAllChapter(){
    setEnterPassword(true);
}
const ClearAllChapters = useMutation(formData => {
    return axios.post(`${API_URL}chapter/bartelby-clear-all`, formData, options)
},{
onSuccess: () => {
    queryClient.invalidateQueries('chapters-bartelby');
    setQuestionsData([]); 
    setFetching(false);
    setUploaded(false)
    setClearingAll(false)
    setEnterPassword(false)
    history.push(`/books-bartleby/${params?.isbn}/import-chapter`);
}
});

async function handleKeyDown(e){
    console.log(e.keyCode)
    if(e.keyCode === 13){
        if(clearPassword === "wrong-password"){
            setEnterPassword(false);
            setClearingAll(true)
            setClearPassword("Enter Password");
            setTimeout( async () => {
                let formData = {
                    book_isbn: params?.isbn
                };
                await ClearAllChapters.mutate(formData);
            },1000)
            
        }else{
            setClearPassword("Enter Password");
            addToast('Your have entered wrong password!', { appearance: 'error',autoDismiss: true });
            setClearingAll(false)
        }
    }
    if(e.keyCode === 27 || e.keyCode === 35 || e.keyCode === 9){
        setEnterPassword(false);
        setClearingAll(false)
    }
}

async function handleExpertAnswer(id){
    history.push(`/books-bartleby/${params?.isbn}/update-expert-answer/${params?.section_id}/${id}`)
}
const [singleQuestion, setSingleQuestion] = useState([]);
useEffect(GetSingleQuestion, [TBookQuestionAnswers?.data])
async function GetSingleQuestion(){
    let sqData = await TBookQuestionAnswers?.data?.filter(questions => questions?._id === params?.question_id);
    setSingleQuestion(sqData && sqData[0]);
}
const [singleChapter, setSingleChapter] = useState([]);
useEffect(GetChapterDetails, [params?.section_id])
async function GetChapterDetails(){
    setConverted([]);
    let chapterData = await chapters?.data?.filter(chapter => chapter?.section_id === params?.section_id);
    setSingleChapter(chapterData && chapterData[0]);
}

useEffect(updateConvertedAnswer, [params?.question_id])
async function updateConvertedAnswer(){
    if(params?.status == "update-expert-answer" && params?.question_id !== undefined){
        setConverted([]);
    }
}

const [sourceCode, setSourceCode] = useState(null);
const [converted, setConverted] = useState([]);
async function handleExtractExpertAnswer(e){
    e.preventDefault();
    if(sourceCode !== ""){
        let content = document.querySelectorAll(".styles__SectionContainer-njq7rd-15");
        content.forEach( (value, index) => {
            if(index > 0){
                console.log(value)
                setConverted(converted => [
                    ...converted,{
                        "data": value
                    }
                ])
            }
        })
    }
    setSourceCode("");
}
const [question,setQuestion] = useState("");

async function UpdateExpertAnswer(e){
    e.preventDefault();
    let AnswersArray = [];
    let answer = {};
    await converted?.map( (answers, i) => {
        answer = {answer_sequence: i, answer: answers.data.innerHTML}
        AnswersArray.push(answer)
    })
    const convertedAnswer = JSON.stringify(AnswersArray);
    const data = {expert_answer: convertedAnswer, question: question, question_id: params?.question_id}
    await MutateExpertAnswer.mutate(data);
}
const MutateExpertAnswer = useMutation(formData => {
    return axios.post(`${API_URL}chapter/update-chapter-answer`, formData, options)
},{
onSuccess: () => {
    queryClient.invalidateQueries([`question-answeres-${params?.section_id}`]);
    setQuestionsData([]); 
    setFetching(false);
    setUploaded(false)
    setClearing(false)
    addToast('Expert Answer Updated', { appearance: 'success',autoDismiss: true });
    history.push(`/books-bartleby/${params?.isbn}/view-uploaded-chapter/${params?.section_id}`);
}
});

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
                    <span className="fa fa-eye text-warning mr-2"></span>
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
            <Button 
                placeholder="Total Question"
                counter={questionsData?.length}/>

            <div className="col-md-12 bb-1 p-2" style={{ display: 'flex', flexContent: 'space-between', background:'#ededed'}}>
                <div style={{width: '10%'}}> Problem No</div>
                <div style={{width: '70%'}}> Question</div>
                <div style={{width: '20%'}}> Available Answer</div>
            </div>
            <div className="col-md-12 pl-0 bb-1 pr-0 mb-2" style={{ height: '450px', overflow: 'scroll'}}>
            {questionsData.reverse()?.map(ques => {
                return(
                <div className="col-md-12 pl-0 pr-0 mt-2 mb-2 pb-2 bb-1" 
                    key={ques?.uuid}
                    style={{ display: 'flex', flexContent: 'space-between'}}>
                    <div className="pl-2 pt-2" style={{width: '10%'}}>{ques?.sequence}-{ques?.problem_no}</div>
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
            <div className="heading-sec">
            <p className="mb-2" style={{ position: 'relative'}}>Uploaded Chapters</p>
            {enterPassword 
            ? 
            <input className="form-control" 
                value={clearPassword}
                onChange={e => setClearPassword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            : 
                <span className="badge-danger pl-2 pr-2 br-10 pull-right"
                style={{ position: 'absolute', right: '10px', top: '0', cursor: 'pointer'}}
                onClick={handleClearAllChapter}
                disabled={clearingAll}
                > 
                    {clearingAll ? (
                        <><span className="fa fa-spinner text-red"></span> Clearing...</>
                    ):(
                        <><span className="fa fa-trash text-white"></span> Clear All</>
                    )}
                    
                </span>    
            }
            </div>
            <hr className="clearfix mb-2 mt-0"/>    
            <div style={{ height: '520px', overflow: 'scroll'}}
            className="pr-2">
                {chapters?.data?.map(chapter => {
                    return(
                        <div key={chapter?.section_id}
                        className="card mb-2 pl-2 pr-2 pt-1 pb-2 br-10"
                        id={chapter?.section_id}
                        style={{ cursor: 'pointer', border: `${params?.section_id === chapter?.section_id ? '1px solid  green':''}`}}
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/books-bartleby/${params?.isbn}/view-uploaded-chapter/${chapter?.section_id}`)
                        }}
                        >
                        <Button 
                        placeholder="Chapter No"
                        srNo={chapter?.chapter_no}
                        counter={chapter?.total_question}/> 

                            <hr className="mt-1 mb-1"/>
                        <p style={{ fontSize: '0.90rem'}}
                        className="mb-1"
                        >{chapter?.chapter_name}</p>
                        </div>
                    );
                })} 
            </div>
            </div>
            
            <div className="col-md-8 pl-0 pr-0">
            <h5 style={{ position: 'relative'}}>Question & Answers: </h5>
            <span className="badge-success pl-2 pr-2 br-5 pull-right"
            style={{ position: 'absolute', left: '200px', top: '0'}}
            >{singleChapter?.chapter_name}</span>
            <span className="badge-danger pl-2 pr-2 br-10 pull-right"
            style={{ position: 'absolute', right: '10px', top: '0', cursor: 'pointer'}}
            onClick={handleClearChapter}
            disabled={clearing}
            > 
                {clearing ? (
                    <><span className="fa fa-spinner text-red"></span> Clearing...</>
                ):(
                    <><span className="fa fa-trash text-white"></span> Clear Chapter</>
                )}
                
            </span>
               
            <hr className="clearfix mb-3 mt-1"/>    
            <div style={{ height: '520px', overflow: 'scroll'}}
            className="pr-2 mb-2">

                {TBookQuestionAnswers?.data?.map(chapter => {
                    let answers = '';
                    if(chapter?.answer !== undefined){
                        answers = JSON.parse(chapter?.answer);
                    }else{
                        answers = [];
                    }
                    let expertAnswer = '';
                    if(chapter?.expert_answer != undefined){
                        expertAnswer = JSON.parse(chapter?.expert_answer)
                    }else{
                        expertAnswer = []

                    }
                    return(
                    <div key={chapter?._id}
                        className="card mb-3 pl-2 pr-2">
                        <h6 className="mt-1 mb-0">
                        <Button 
                        placeholder="Problem No"
                        counter={chapter?.problem_no}/> 

                        {chapter?.sequence > 0 && (
                            <div className="col-md-6 pull-right" 
                            onClick={handleExpertAnswer.bind(this, chapter?._id)}
                            >
                                    <button className="btn dark btn-sm br-5 pull-right">
                                        <span className="fa fa-question-circle mr-2"></span>
                                        Update Expert Solution
                                    </button>
                            </div>
                        )}

                        </h6>

                        <hr className="mt-1 mb-1"/>
                        <b className="mb-2">
                        Question: {chapter?.question}
                        </b> 

                        {answers?.length > 0 && (
                            <>
                            <div className="col-md-12 pl-0 pr-0">
                            <hr className="mt-1 mb-1"/>    
                            <b>Answer: </b>
                            <hr className="mt-1 mb-1"/>    
                            <Answers answers={answers} type="ans"/>
                            </div>
                            </>
                        )}

                        {expertAnswer?.length > 0 && (
                            <div className="col-md-12 pl-0 pr-0">
                                <Answers answers={expertAnswer} type="exp_ans"/>
                            </div>
                            
                        )}
                        
                        </div>   

                        
                    );
                })} 

                {!TBQALoading && TBookQuestionAnswers?.data?.length === 0 && (
                    <>
                    <h4>No Data Available</h4>
                    <button className="btn btn-sm dark"
                    onClick={handleReImport}
                    >
                        <span className="fa fa-download mr-2"></span>
                        Import Questions
                    </button>
                    </>
                )}
                {TBQALoading && (
                    <>
                    <span className="fa fa-spinner"></span>
                    Loading...
                    </>

                )}
            </div>
            </div>
            
        </div>
        </div>
    )}

{params?.status === "update-expert-answer" && (
        <div className="dash-cont-start" style={{ height: '90vh'}}>
        <div className="row col-md-12 pr-0">
            <h5>Upload Expert Answer</h5>
            <div className="col-md-12"></div>
            <hr className="mt-1 mb-2" />
            <div className="col-md-12"></div>
            <div className="col-md-5 pl-0 pr-0">
                <p>Chapter No: {singleQuestion?.chapter_no} - {singleQuestion?.chapter_name}</p>
                <p>Problem No: {singleQuestion?.problem_no}</p>

                <form>
                    <div className="form-group">
                        <input type="text" 
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="form-control" placeholder="Please Enter Question"/>
                    </div>
                    
                    <div className="form-group">
                        <textarea 
                        value={sourceCode}
                        id="sourceCode" 
                        onChange={e => { 
                            e.preventDefault(); 
                            setSourceCode(e.target.value)
                        }} className="form-control" style={{ height: '250px'}} placeholder="Enter Source Code"></textarea>
                    </div>
                    
                    <div className="form-group">
                        <button className="btn btn-md dark"
                            onClick={handleExtractExpertAnswer}
                        >
                            <span className="fa fa-save mr-2"></span>
                            Extract Answer
                        </button>
                    </div>

                </form>
            </div>
            {sourceCode && (
            <div className="col-md-7" style={{ display: 'none'}}>
                {htmlConverterReact(sourceCode)}
            </div>
            )}
            <div className="col-md-7 pr-0">
                <h4>Expert Solutions {converted?.length} {sourceCode?.length}</h4>
                <hr className="mt-1 mb-2"/>
                <div className="col-md-12 pl-0 pr-0" style={{ height: "340px", overflow: 'scroll', borderBottom: "1px solid #ededed"}}>
                {converted?.map( (content, i) => {
                    return(
                        <div className="card p-2 br-5 mb-2" key={Date.now()+i}>
                            {htmlConverterReact(content?.data)} 
                        </div>
                    )
                })}
                </div>
                <div className="col-md-12 mt-3 pr-0 pull-right">
                    <button className="btn btn-md dark pull-right"
                    onClick={UpdateExpertAnswer}>
                        <span className="fa fa-save mr-2"></span>
                        Update Solutions
                    </button>
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
