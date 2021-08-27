import React ,{ useState, useContext, useEffect} from 'react'
import renderHTML from 'react-render-html';
import {useHistory, useParams, useLocation} from 'react-router-dom'
import * as utils from '../../utils/MakeSlug';
import useAllSubjects from '../../hooks/useAllSubjects';
import useGetSubSubjects from '../../hooks/useGetSubSubjects';
import useDataReports from './hooks/useDataReports';
import useAllQuestions from '../../hooks/useAllQuestions';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import {AuthContext} from '../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import { v4 as uuidv4 } from 'uuid';
import Pagination from './Pagination';
import useQALastUploaded from '../../hooks/useQALastUploaded';

export default function DataReport() {
    const DataStatus = [
        {key: 'text-book-solutions', value: 'Text Book Solutions'},
        {key: 'question-and-answer', value: 'Question and Answers'}
    ]
    const params = useParams();
    const history = useHistory();
    const location = useLocation();
    const {state} = useContext(AuthContext);
    const { addToast } = useToasts();
    const {data,isLoading: isLoadingSubject} = useAllSubjects();
    const {data:sub_subjects,isLoading: isLoadingSubSubject} = useGetSubSubjects();
    const {data:dataReports,isLoading: isLoadingReport} = useDataReports();
    
    const [questions, setQuestions] = useState([]);
    
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Data Report</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark" onClick={e => history.push(`/dashboard`)}>
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
                                    if(subject === undefined){
                                        history.push(`/data-report`)
                                    }else{
                                        history.push(`/data-report/${subject}/${subject_id}`)
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
                                if(sub_subject === undefined || params?.subject === undefined){
                                    history.push(`/data-report/${params?.subject}/${params?.subject_id}`)
                                }else{
                                    history.push(`/data-report/${params?.subject}/${params?.subject_id}/${sub_subject}/${sub_subject_id}`)
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
                                if(status == "0"){
                                    history.push(`/data-report/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}`)
                                }else{
                                    history.push(`/data-report/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}/${status}`)
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
                            
                            
                            {params?.status && (
                                <>
                                <button className="btn btn-sm dark ml-2"
                                    onClick={e => {
                                        e.preventDefault();
                                        history.push(`/data-report/${params?.subject}/${params?.subject_id}/${params?.sub_subject}/${params?.sub_subject_id}`)
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
                            <div className="col-md-9">
                                <h2 style={{ textTransform: 'capitalize'}}>All Upload Questions {params?.status ? 'in' : ''}  {params?.status?.replaceAll('-', ' ')}</h2>
                            </div>
                        </div>
                        <div className="col-md-12 p-0 ">
                            <hr className="mt-2 mb-2"/>
                        </div>
                        
                        {dataReports?.length > 0 && (
                        <div className="col-md-12 row bg-info ml-1 text-white pl-2">
                            <div className="col-md-6">Chield Subjects</div>
                            <div className="col-md-2">Total Question</div>
                        </div>
                        )}
                        <div style={{ height: '400px', overflowY: 'scroll', overflowX: 'hidden'}}>
                             {dataReports?.length > 0 && dataReports?.map(report => {
                                return(
                                <div className="col-md-12 row table-bordered border-right mt-2 ml-1 pl-2" key={report?._id}>
                                    <div className="col-md-6">{report?.chield_subject}</div>
                                    <div className="col-md-2">{report?.toal_question}</div>
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
