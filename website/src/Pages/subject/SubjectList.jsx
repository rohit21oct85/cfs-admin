import React, {useContext, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useAllSubjects from '../../hooks/useAllSubjects';

export default function SubjectList() {
    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {data, isLoading, error} = useAllSubjects();
    const handleDelete = async (e) => {
        history.push(`delete-data/subject/delete/${e}`);
    }

return (

    <>
    {state.isLoggedIn && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>All Subject</h2>
                </div>
                
                {error && (<Notification>{error}</Notification>)}
                {isLoading && (<LoadingComp />)}
                <div className="dash-con-heading">
                    <div className="col-md-12 row">
                    <Link to={`/subject-create`} className="btn btn-sm dark">
                            Add New Subject
                    </Link>
                    </div>    
                </div>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        {!isLoading && (
                        <div className="subject-main-container">
                        {data.map( sub => (
                            <div className="subject-card" key={sub._id} id={`card-${sub._id}`}>
                                <div className="subject-card-heading">
                                    <div>
                                        <Link to={`sub-subject/${sub.subject.replace(' ','-').toLowerCase().trim()}/${sub._id}`}>
                                        #{sub._id}
                                        </Link></div>
                                    <div>
                                        <Link to={`/subject-update/${sub._id}`}>
                                            <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                                        </Link>
                                        {(state.role == 1) && (
                                        <Button className="delBtn" onClick={handleDelete.bind(this,sub._id)}>
                                            <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                                        </Button>
                                        )}
                                        
                                    </div>
                                </div>
                                <div className="subject-card-body mt-2">
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Subject Name: 
                                        </div>
                                        <div className="name-main">
                                            {sub.subject}
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Created On: 
                                        </div>
                                        <div className="name-main date">
                                            {sub.created_at.split('T')[0]}
                                        </div>
                                    </div> 

                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Status: 
                                        </div>
                                        <div className="name-main">
                                            {(sub.status == 1) ? 'Active':'Inactive'}
                                        </div>
                                    </div> 
                                    
                                   

                                    <div className="admin-name"> 
                                        <div className="name-label">
                                            Total Books: 
                                        </div>
                                        <div className="name-main">
                                            <span>{sub.total_books}</span>
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
