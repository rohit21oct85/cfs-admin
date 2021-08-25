import React ,{ useState, useContext, useEffect} from 'react'
import renderHTML from 'react-render-html';
import {useHistory, useParams} from 'react-router-dom'
import * as utils from '../../utils/MakeSlug';
import useAllSubjects from '../../hooks/useAllSubjects';
import useGetSubSubjects from '../../hooks/useGetSubSubjects';
import useGetChieldSubjects from '../../hooks/useGetChieldSubjects';
import useAllQuestions from '../../hooks/useAllQuestions';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import {AuthContext} from '../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import { v4 as uuidv4 } from 'uuid';
import Pagination from './Pagination';

export default function QAData() {
    const DataStatus = [
        {key: 'true', value: 'Mongo Database'},
        {key: 'false', value: 'MySql Database'}
    ]
    const params = useParams();
    const history = useHistory();
    const {state} = useContext(AuthContext);
    const { addToast } = useToasts();
    const {data,isLoading: isLoadingSubject} = useAllSubjects();
    const {data:sub_subjects,isLoading: isLoadingSubSubject} = useGetSubSubjects();
    const {data:chield_subjects,isLoading: isLoadingChieldSubject} = useGetChieldSubjects();
    
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({});
    const [totalQuestion, setTotalQuestion] = useState(0);
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
            'Authorization':'Bearer '+state.access_token,

        }
    };
    const [dataImported, setDataImported] = useState(false);
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const [submitData, setSubmitData] = useState(false);

    useEffect(()=> {
        if(isDataSubmitted === true){
            setDataImported(false);
        }
    },[params?.page])
    const handleQandA = async (e) => {
        e.preventDefault();
        setLoading(true);
        setDataImported(true);
        let response;
        let questionData = '';
        if(params?.status === "false"){
            let page = ''
            if(params?.page === undefined){
                page = 0
            }else{
                page = params?.page
            }
            response = await axios.get(`https://backup.crazyforstudy.com/api/get-question-and-answer.php?accessKey=crazyforstudy&id=${params?.chield_subject_id}&page=${page}`);    
            questionData = response?.data?.data; 
            setPagination(response?.data?.pagination);
            setTotalQuestion(response?.data?.pagination?.itemCount);
            questionData?.forEach(question => {
                question.uuid = uuidv4();
            })
            setQuestions(questionData);
            
            if(response?.data?.pagination){
                let page = '';
                if(params?.page === undefined){
                    page = 1
                }else{
                    page = params?.page
                }
                history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}/${params?.chield_subject_id}/${params?.chield_subject}/${page}`)
            }
        }else{
            response = await axios.get(`${API_URL}question/chield-question/${params?.chield_subject_id}`, options);
            questionData = response?.data?.data;
            questionData?.forEach(question => {
                question.uuid = uuidv4();
            })
            setQuestions(questionData);
            setPagination([]);
        }
        
       
        setLoading(false);
        setDataImported(false);
    }
    
    const handleUploadData = async (e) => {
        e.preventDefault();
        setDataImported(true);
        setSubmitData(true);
        setIsDataSubmitted(true)
        questions.forEach( ques => {
            ques.subject = params?.subject;
            ques.subject_id = params?.subject_id;
            ques.sub_subject = params?.sub_subject;
            ques.sub_subject_id = params?.sub_subject_id;
            ques.chield_subject_id = params?.chield_subject_id;
        });
        const postData = {
            questions: questions,
            chield_subject_id: params?.chield_subject_id,
            totalQuestion: totalQuestion,
            pageCount: pagination?.pageCount,
            perPage: pagination?.perPage,
            page: +params?.page
        }
        // console.log(postData);
        // return;
        const response = await axios.post(`${API_URL}question/import-data`,postData,options);
        if(response.status === 201){
            setSubmitData(false);
            addToast('Questions Uploaded successfully', { appearance: 'success',autoDismiss: true });
            setQuestions([]);

            setTimeout(() => {
                if(pagination?.pageCount == "1"){
                    document.getElementById("chield_subject").selectedIndex = "0";
                    history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}`)
                    setIsDataSubmitted(false);
                    setDataImported(false);
                    setLoading(false);
                }else if(pagination?.pageCount > "1"){
                    let totalQuestion = response?.totalQuestion;
                    let uploadedQuestion = response?.uploadedQuestion

                    setIsDataSubmitted(false);
                    setDataImported(false);
                    setLoading(false);
                    if(pagination?.next > pagination?.pageCount){
                        history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}`)    
                    }else{
                        history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}/${params?.chield_subject_id}/${params?.chield_subject}/${pagination?.next}`)
                    }
                }
            }, 1000);
        }
    }

    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Question and Answers</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark">
                                <span className="fa fa-arrow-left"></span>
                            </button>
                            <select className="col-md-2 ml-2 form-control"
onChange={e => {
                                    const data = e.target.value;
                                    const split_val = data.split("_");
                                    const subject = split_val[1];
                                    const subject_id = split_val[0];
                                    document.getElementById("sub_subject").selectedIndex = "0";
                                    document.getElementById("status").selectedIndex = "0";
                                    document.getElementById("chield_subject").selectedIndex = "0";
                                    if(subject === undefined){
                                        history.push(`/qa-data`)
                                    }else{
                                        history.push(`/qa-data/${subject}/${subject_id}`)
                                    }
                                }}
                            >
                                <option>{isLoadingSubject ? 'loading...': 'Select Subjects'}</option>
                                {data?.map(subjects => {
                                    return (
                                        <option 
                                            value={`${subjects?._id}_${utils.MakeSlug(subjects?.subject)}`}
                                            selected={subjects?._id === params?.subject_id ? 'selected': ''}
                                            key={subjects?._id}>{subjects?.subject}</option>
                                    )
                                })}
                            </select>
                            
                            <select className="col-md-2 ml-2 form-control"
                            id="sub_subject"
                            onChange={e => {
                                const data = e.target.value;
                                const split_val = data.split("_");
                                const sub_subject = split_val[1]
                                const sub_subject_id = split_val[0];
                                document.getElementById("status").selectedIndex = "0";
                                document.getElementById("chield_subject").selectedIndex = "0";
                                setQuestions([])
                                if(sub_subject === undefined || params?.subject === undefined){
                                    history.push(`/qa-data/${params?.subject}/${params?.subject_id}`)
                                }else{
                                    history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${sub_subject}/${sub_subject_id}`)
                                }
                            }}>
                                <option>{isLoadingSubSubject ? 'loading...': 'Select Sub Subjects'}</option>
                                {sub_subjects?.map(subjects => {
                                    return (
                                        <option 
                                            value={`${subjects?._id}_${utils.MakeSlug(subjects?.sub_subject)}`} 
                                            selected={subjects?._id === params?.sub_subject_id ? 'selected': ''}
                                            key={subjects?._id}>{subjects?.sub_subject}</option>
                                    )
                                })}
                            </select>
                            <select className="col-md-2 ml-2 form-control"
                            id="status"
                            
                            onChange={e => {
                                const status = e.target.value;
                                document.getElementById("chield_subject").selectedIndex = "0";
                                setQuestions([]);
                                setPagination({});
                                if(status == "0"){
                                    history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}`)
                                }else{
                                    history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${status}`)
                                }
                            }}
                            >
                                <option value="0">Status</option>
                                {sub_subjects?.length > 0 && params?.sub_subject_id && DataStatus?.map(status => {
                                    return(
                                        <option 
                                        value={status.key}
                                        selected={params?.status === status.key ? true: false}
                                        >{status.value}</option>
                                    )
                                })}
                            </select>
                            
                            <select 
                                className="col-md-2 ml-2 form-control"
                                id="chield_subject"
                                onChange={e => {
                                    const data = e.target.value;
                                    const split_val = data.split("_");
                                    const chield_subject = split_val[1]
                                    const chield_subject_id = split_val[0]
                                    setQuestions([])
                                    setPagination({})
                                    setDataImported(false);
                                    if(chield_subject === undefined){
                                        history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}`)
                                    }else{
                                        history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}/${chield_subject_id}/${chield_subject}`)
                                    }
                                }}
                            >
                            <option>{isLoadingChieldSubject ? 'loading...': 'Select Chield Subjects'}</option>    
                            {chield_subjects?.map(subject => {
                                return(
                                    <option 
                                        value={`${subject?.chield_subject_id}_${utils.MakeSlug(subject?.chield_subject)}`} 
                                        selected={subject?.chield_subject_id === params?.chield_subject_id ? 'selected': ''}
                                        key={subject?.uuid}>{subject?.chield_subject}</option>
                                
                                );
                            })}
                            </select>
                            
                            {params?.chield_subject_id && (
                                <>
                                <button className="btn btn-sm dark ml-2"
                                    onClick={handleQandA} 
                                    disabled={dataImported}
                                >
                                    {loading ? (
                                        <><span className="fa fa-spinner mr-2"></span>
                                        importing data...</>
                                    ):(
                                        <><span className="fa fa-upload mr-2"></span>
                                        Import Data</>
                                    )}
                                    
                                </button>
                                
                                <button className="btn btn-sm dark ml-2"
                                    onClick={e => {
                                        e.preventDefault();
                                        document.getElementById("chield_subject").selectedIndex = "0";
                                        setQuestions([])
                                        setPagination({})
                                        history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}`)
                                    }}
                                >
                                    <span className="fa fa-times mr-2"></span>
                                    Cancel
                                </button>

                                </>
                                
                            )}

                        </div>
                    </div>
                    <div className="dash-cont-start">
                        <div className="col-md-12 row">
                            <div className="col-md-4">
                                <h2>All Questions - {questions?.length} outof {pagination?.itemCount??0 }</h2>
                            </div>
                            {pagination && questions?.length > 0 && (
                            <div className="col-md-2">
                                <Pagination pagination={pagination} />   
                            </div>
                            )}
                            {questions?.length > 0 && params?.status == "false" && (
                            <div className="col-md-6 pr-0 pull-right text-right" style={{ position: 'absolute', right: '10px', top: '0px'}}>
                                <button className="btn btn-sm dark p-2"
                                 onClick={handleUploadData}
                                 disabled={isDataSubmitted === true}
                                >
                                {submitData ? (
                                    <><span className="fa fa-spinner mr-2"></span> Uploading data.... </>
                                ) : 
                                (
                                    <><span className="fa fa-download mr-2"></span> Upload {questions?.length} Questions</>
                                )}
                                </button>
                                
                                <button className="btn btn-sm red p-2 ml-2"
                                onClick={e => {
                                    e.preventDefault();
                                    document.getElementById("chield_subject").selectedIndex = "0";
                                    setQuestions([])
                                    setPagination({})
                                    history.push(`/qa-data/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${params?.status}`)
                                }}>
                                    <span className="fa fa-times mr-2"></span>
                                    Cancel Upload
                                </button>
                            </div>
                            )}        
                            
                        </div>
                        <div className="col-md-12 p-0 ">
                            <hr className="mt-2 mb-2"/>
                        </div>
                        {questions?.length > 0 && (
                        <div className="col-md-12 row bg-info ml-1 text-white pl-2">
                            <div className="col-md-1">Old QID</div>
                            <div className="col-md-6">Question</div>
                            <div className="col-md-5">Short Answer</div>
                        </div>
                        )}


                        <div style={{ height: '400px', overflowY: 'scroll', overflowX: 'hidden'}}>
                             {questions?.length > 0 && questions?.map(question => {
                                return(
                                <div className="col-md-12 row table-bordered border-right mt-2 ml-1 pl-2" key={question?.uuid} id={question?.uuid}>
                                    <div className="col-md-1">{question?.old_qid}</div>

                                    <div className="col-md-6 pl-0" dangerouslySetInnerHTML={{__html: `${renderHTML(question?.question)}`}} />
                                    <div className="col-md-5 pl-0" dangerouslySetInnerHTML={{__html: `${renderHTML(question?.shortanswer)}`}} />
                                    
                                </div> 
                                )
                            })}        
                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
