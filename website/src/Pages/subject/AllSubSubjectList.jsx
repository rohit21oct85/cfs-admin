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
import useAllSubSubjects from '../../hooks/useAllSubSubjects';

export default function AllSubSubjectList() {
    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {data, isLoading, error} = useAllSubSubjects();
    const handleDelete = async (e) => {
        history.push(`delete-data/sub-subject/delete/${e}`);
    }

return (

    <>
    {state.isLoggedIn && (
    
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>All Sub Subject</h2>
                </div>
                {error && <Notification>{error}</Notification>}
                {isLoading && (<LoadingComp />)}
                <div className="dash-con-heading">
                    <div className="col-md-12 row">
                        <Link to={`/sub-subject/create`} className="btn btn-sm dark">
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>  Add New Sub Subject Manual
                        </Link>
                        <Link to={`/sub-subject/upload`} className="btn btn-sm dark ml-2">
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Upload CSV Sub Subject
                        </Link>
                    </div>    
                </div>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-6 pl-0 ">
                            
                        </div>
                        
                        {!isLoading && (
                        <div className="subject-main-container">
                        {data.map( sub => (
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
                                            Subject: 
                                        </div>
                                        <div className="name-main date">
                                            {sub.subject}
                                        </div>
                                    </div> 
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
