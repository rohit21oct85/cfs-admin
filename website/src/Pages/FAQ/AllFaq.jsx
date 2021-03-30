import React, {useContext} from 'react'
import '../mainDash.css';
import {  useHistory , useParams , Link} from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCloud } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useStudent from '../../hooks/useStudent';
import SingleFaqCategory from './SingleFaqCategory';

import * as util from '../../utils/MakeSlug';
import TopMenu from './TopMenu';

export default function AllFaq() {

const {state} = useContext(AuthContext);

const {data, isLoading, error} = useStudent();

return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2 style={{ textTransform : 'capitalize' }}>All Faq Category </h2>
        </div>
        {error && <Notification>{error.message}</Notification>}
        {isLoading && <LoadingComp />}

        <TopMenu data={data}/>

        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container">  
        {data.data.map(student => <SingleFaqCategory student={student} key={student._id}/> )}

        {data.data.pagination && data.data.pagination.itemCount === 0 && (
            <div className="col-md-6 offset-3 p-5">
                <h2 style={{ fontSize: '1.2em' }}>No Faq Category Registered yet <br />
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
