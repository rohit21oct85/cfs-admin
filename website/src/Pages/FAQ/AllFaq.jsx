import React, {useContext} from 'react'
import '../mainDash.css';

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useFaq from '../../hooks/useFaq';
import SingleFaqCategory from './SingleFaqCategory';

import TopMenu from './TopMenu';

export default function AllFaq() {

const {state} = useContext(AuthContext);

const {data, isLoading, error} = useFaq();
console.log('data back', data)
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
        {data && data.data.map(faq => <SingleFaqCategory faq={faq} key={faq._id}/> )}

        {data.pagination && data.pagination.itemCount === 0 && (
            <div className="col-md-6 pt-1">
                <h2 style={{ fontSize: '1.2em', color: '#f00' }}>No Faq Category Registered yet</h2>
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
