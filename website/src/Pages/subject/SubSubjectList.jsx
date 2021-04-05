import React, {useContext} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";

import * as api from '../../Helper/ApiHelper.jsx';

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import SingleSubSubject from './SingleSubSubject';

import {useQuery } from 'react-query'

export default function SubSubjectList() {

const history = useHistory();
const params = useParams();
const {state} = useContext(AuthContext);

const {data, isLoading, error} = useQuery('subject-subsubjects', async () => {
    const result = await api.get(`sub-subject/subject/${params.subject_id}`);
    return result.data.data;
})

return (

    <>
    {state.isLoggedIn && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>All Subject of { params.subject_name.replace('-',' ') }</h2>
                </div>
                {error && ( <Notification>{error}</Notification>)}
                {isLoading && (<LoadingComp />)}
                <div className="dash-con-heading">
                <div className="col-md-12 pl-0">
                    <Link to={`/subject`} className="btn btn-sm dark  mr-2">
                        <span className="fa fa-arrow-left"></span>
                    </Link>
                    <Link to={`/sub-subject/${params.subject_name}/create/${params.subject_id}`} className="btn btn-sm dark">
                    <span className="fa fa-plus"></span>
                    </Link>
                    <Link to={`/sub-subject/upload`} className="btn btn-sm dark ml-2">
                    <span className="fa fa-plus"></span>
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
