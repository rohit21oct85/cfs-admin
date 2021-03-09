import React, {useContext, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";


import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useAllSubjects from '../../hooks/useAllSubjects';

import SingleSubject from './SingleSubject'


export default function SubjectList() {
    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {data, isLoading, error} = useAllSubjects();
    

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
                        {data.map( sub => <SingleSubject sub={sub} key={sub._id}/>)}
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
