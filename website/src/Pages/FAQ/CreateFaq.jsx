import React, {useContext} from 'react'
import '../mainDash.css';

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useFaq from '../../hooks/useFaq';

import TopMenu from './TopMenu';
import FaqForm from './FaqForm';

export default function CreateFaq() {

const {state} = useContext(AuthContext);

const {data, isLoading, error} = useFaq();

return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2 style={{ textTransform : 'capitalize' }}> Create Faq Category </h2>
        </div>
        {error && <Notification>{error.message}</Notification>}
        {isLoading && <LoadingComp />}

        <TopMenu data={data}/>

        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container">  
            <div className="col-md-4">
                <FaqForm />    
            </div>
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
