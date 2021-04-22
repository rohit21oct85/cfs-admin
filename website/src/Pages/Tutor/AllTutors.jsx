import React, {useContext, useRef} from 'react'
import '../mainDash.css';
import {  useHistory , useParams , Link} from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useTutor from '../../hooks/useTutor';
import SingleTutor from './SingleTutor';
import Pagination from '../../components/Pagination';
import * as util from '../../utils/MakeSlug';
import useAllSubSubjects from '../../hooks/useAllSubSubjects';

export default function AllTutors() {
const history = useHistory();
const params = useParams();
const statusRef = useRef();
const {state} = useContext(AuthContext);
const {data, isLoading, error} = useTutor();
const {data: allSubjects} = useAllSubSubjects();
console.log("tutor details ", data?.pagination)
return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2 style={{ textTransform : 'capitalize' }}>All Tutors </h2>
        </div>
        {error && <Notification>{error.message}</Notification>}
        {isLoading && <LoadingComp />}

        <div className="dash-con-heading">
            <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                <select 
                    className="mr-2" 
                    name="category"
                    onChange={e => {
                        if(params?.status === undefined){
                            history.push(`/all-tutors/${statusRef.current.value}/${e.target.value}`)
                        }else{
                            history.push(`/all-tutors/${params?.status}/${e.target.value}`)
                        }
                    }}
                >
                    <option value="all">All</option>
                    {allSubjects?.map(subcat => {
                    return (
                        <option
                        value={`${subcat.sub_subject}`}
                        selected={(params.master_subject == subcat.sub_subject) ? 'selected':''}
                        >{subcat.sub_subject}</option>
                    )   
                    })}
                </select>
                <select className="col-md-1 mr-1"
                ref={statusRef}
                onChange={e => history.push(`/all-tutors/${e.target.value}/${params.master_subject}`)}
                >
                    <option value="all">All</option>
                    <option value="1" selected={(params.status === "1") ? 'selected':''}>Active</option>
                    <option value="0" selected={(params.status === "0") ? 'selected':''}>Blocked</option>
                </select>

                <Pagination pagination={data?.pagination}/>
            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container">  

        {data?.data?.map(tutor => <SingleTutor tutor={tutor} key={tutor._id}/> )}

        {data?.data?.pagination?.itemCount === 0 && (
            <div className="col-md-6 offset-3 p-5">
                <h2 style={{ fontSize: '1.2em' }}>No Students Registered yet <br />
                </h2>    
            </div>
        )}    
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
