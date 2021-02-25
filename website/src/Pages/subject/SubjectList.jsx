import React, {useContext, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import * as api from '../../Helper/ApiHelper.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {SubjectContext} from '../../context/SubjectContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import useAxios from '../../hooks/useAxios';

export default function SubjectList() {
    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: sState, dispatch: sDispatch} = useContext(SubjectContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {response, isLoading} = useAxios({
        method: 'get', url: 'subject/all'
    });
    const handleDelete = async (e) => {
        history.push(`delete-data/subject/delete/${e}`);
        // await api.del(`subject/delete/${e}`);
        // document.getElementById('card-'+e).style.display = "none";
        // history.push('/subject')
    }
    useEffect(() => {
        if(response !== null){
            const AllSubject = response.data;
            sDispatch({type: 'GET_ALL_SUBJECT', payload: AllSubject});
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
                    <h2>All Subject</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="col-md-3 pl-0">
                        <Link to={`/subject-create`} className="btn btn-sm dark mb-3">
                            Add New Subject
                        </Link>
                        </div>
                        {errorState.success && ( 
                            <Notification>{errorState.success}</Notification>
                        )}
                        <div className="subject-main-container">
                        {sState.Subjects.map( sub => (
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
                    </div>
                </div>
            </div>
        </div>
        
    </div>
        
    )}  
    </>

)
}
