import React, {useContext, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import SingleSubSubject from './SingleSubSubject';

import useAllSubSubjects from '../../hooks/useAllSubSubjects';


export default function AllSubSubjectList() {
const history = useHistory();
const {state} = useContext(AuthContext);
const {data, isLoading, error} = useAllSubSubjects();


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
                            <span className="fa fa-plus-square text-success"></span>  
                            &nbsp; Add Sub Subject
                        </Link>
                        <Link to={`/sub-subject/upload`} className="btn btn-sm dark ml-2">
                        <span className="fa fa-cloud text-success"></span>  
                        &nbsp;  Upload Sub Subject
                        </Link>
                    </div>    
                </div>
                <div className="dash-cont-start">
                     {!isLoading && (
                        <div className="subject-main-container">
                        {data.map( sub => <SingleSubSubject sub={sub} key={sub._id}/>)}
                        </div>
                        )}
                    
                </div>
            </div>
        </div>
        
    </div>
        
    )}  
    </>

)
}
