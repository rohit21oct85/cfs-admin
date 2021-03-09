import React, {useContext, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faHandPointLeft } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {SubjectContext} from '../../context/SubjectContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useAxios from '../../hooks/useAxios';

export default function SubSubjectList() {
    const history = useHistory();
    const params = useParams();

    const {state} = useContext(AuthContext);
    const {state: sState, dispatch: sDispatch} = useContext(SubjectContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {response, isLoading} = useAxios({
        method: 'get', url: `sub-subject/subject/${params.subject_id}`
    });
    const handleDelete = async (e) => {
        history.push(`delete-data/subject/delete/${e}`);
    }
    useEffect(() => {
        if(response !== null){
            const AllSubSubject = response.data;
            console.log(AllSubSubject);
            sDispatch({type: 'GET_ALL_SUB_SUBJECT', payload: AllSubSubject});
        }
    }, [response]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
        clearTimeout(timerError)
        clearTimeout(timerSuccess)
        }
    },[errorState])
return (

    <>
    {state.isLoggedIn && sState.Subjects && errorState && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>All Subject of { params.subject_name.replace('-',' ') }</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-6 pl-0">

                            <Link to={`/subject`} className="btn btn-sm dark mb-3 mr-2">
                                <FontAwesomeIcon icon={faHandPointLeft}></FontAwesomeIcon>
                            </Link>
                            <Link to={`/sub-subject/${params.subject_name}/create/${params.subject_id}`} className="btn btn-sm dark mb-3">
                                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>  Add New Sub Subject Manual
                            </Link>
                            <Link to={`/sub-subject/upload`} className="btn btn-sm dark mb-3 ml-2">
                                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>  Upload CSV Sub Subject
                            </Link>
                        </div>
                        {errorState.success && ( 
                            <Notification>{errorState.success}</Notification>
                        )}
                        {isLoading && (<LoadingComp />)}
                        {!isLoading && (
                        <div className="subject-main-container">
                        {sState.SubSubjects.map( sub => (
                            <div className="subject-card" key={sub._id} id={`card-${sub._id}`}>
                                <div className="subject-card-heading">
                                    <div>
                                        <Link to={`/sub-subject/${sub.subject.replace(' ', '-').toLowerCase()}/${sub._id}`}>
                                        #{sub._id}
                                        </Link></div>
                                    <div>
                                        <Link to={`/sub-subject/update/${sub._id}`}>
                                            <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                                        </Link>
                                        <Button className="delBtn" onClick={handleDelete.bind(this,sub._id)}>
                                            <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                                        </Button>
                                    </div>
                                </div>
                                <div className="subject-card-body">
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Sub Subject: 
                                        </div>
                                        <div className="name-main date">
                                            {sub.sub_subject}
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        ))}
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
