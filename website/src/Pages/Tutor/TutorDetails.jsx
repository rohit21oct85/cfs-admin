import React,{useContext} from 'react'
import { useHistory } from 'react-router';

import useSingleTutor from '../../hooks/useSingleTutor';
import {AuthContext} from '../../context/AuthContext';


export default function TutorDetails() {
    const history = useHistory()
    const {state} = useContext(AuthContext);
    const {data, isLoading} = useSingleTutor();
    const bank = JSON.stringify(data?.data?.bank_details)
    let eduData = data?.data?.education;
    let stats = data?.statics;
    
    return (
        <>
        {state.isLoggedIn && (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Tutor Details</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark"
                            onClick={e=> history.push(`/all-tutors/all/${data?.data?.master_subject}/all`)}
                            >
                                <span className="fa fa-arrow-left"></span>
                            </button>
                        </div>
                    </div>
                {isLoading && (
                 <span className="fa fa-spinner"></span>   
                )}
                {!isLoading && (
                    <div className="dash-cont-start">
                    <div className="subject-main-container pl-0 pt-0 pr-0 pb-0">
                        <div className="row col-md-12 pr-0">
                        <div className="col-md-5">
                        <div className="module-card" style={{width: '100%'}}>
                            <h4>Personal Details</h4>
                            <hr className="mt-1 mb-2"/>

                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-user fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Name: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.fname}&nbsp; {data?.data?.lname}  
                                </div>
                            </div> 
                            
                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-envelope fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Email: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.email}
                                </div>
                            </div> 

                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-home fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Address: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.house_name},&nbsp; 
                                    {data?.data?.street_name},&nbsp; 
                                    {data?.data?.city},&nbsp; 
                                    {data?.data?.zipcode},&nbsp; 
                                    {data?.data?.country},&nbsp; {data?.data?.country_full}
                                </div>
                            </div> 

                            <hr className="mt-1 mb-1"/>
                            <h4 className="mt-1 mb-1">Education Details</h4>    
                            <hr className="mt-1 mb-1"/>
                            {eduData?.map(education => {
                                return (
                                    <>
                                    <div className="admin-name mb-1"> 
                                        <div className="name-label">
                                            <span className="fa fa-book fa-1x mr-2 pt-1"></span> 
                                            &nbsp; Class: 
                                        </div>
                                        <div className="name-main">
                                            {education?.class}
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name mb-1"> 
                                        <div className="name-label">
                                            <span className="fa fa-book fa-1x mr-2 pt-1"></span> 
                                            &nbsp; Subject: 
                                        </div>
                                        <div className="name-main">
                                            ({education?.subject})
                                        </div>
                                    </div> 
                                    
                                    <div className="admin-name mb-1"> 
                                        <div className="name-label">
                                            <span className="fa fa-book fa-1x mr-2 pt-1"></span> 
                                            &nbsp; Grade: 
                                        </div>
                                        <div className="name-main">
                                            {education?.grade}%
                                        </div>
                                    </div> 

                                    
                                    <div className="admin-name mb-1"> 
                                        <div className="name-label">
                                            <span className="fa fa-book fa-1x mr-2 pt-1"></span> 
                                            &nbsp; Passing Year: 
                                        </div>
                                        <div className="name-main">
                                            {education?.year}
                                        </div>
                                    </div> 

                                    </>
                                );
                            })}
                            

                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-book fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Master Subject: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.master_subject}
                                </div>
                            </div> 
                            <hr className="mt-1 mb-1"/>
                            <h4 className="mt-1 mb-1">Bank Details</h4>    
                            <hr className="mt-1 mb-1"/>
                            {data?.data?.paypal !== 'NULL' ? (
                                <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-dollar fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Paypal: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.paypal}
                                </div>
                            </div> 
                            ) : (
                            <>
                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-home fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Bank Name: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.Bank_Name}
                                </div>
                            </div> 
                            
                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-home fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Account Name: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.Account_Name}
                                </div>
                            </div> 
                                
                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-home fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Bank Country: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.Bank_Country}
                                </div>
                            </div> 
                                
                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-home fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Account Type: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.Account_Type}
                                </div>
                            </div> 
                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-home fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Account_Number: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.Account_Number}
                                </div>
                            </div> 
                            <div className="admin-name mb-1"> 
                                <div className="name-label">
                                    <span className="fa fa-home fa-1x mr-2 pt-1"></span> 
                                    &nbsp; Bank Address: 
                                </div>
                                <div className="name-main">
                                    {data?.data?.Bank_Address}
                                </div>
                            </div> 

                            </>    
                            )}
                        {/* subject card ends */}
                        </div> 
                        </div>
                        <div className="col-md-7 pl-0 pr-0">
                        <div className="module-card" style={{ width: '100%'}}>
                            <h4>Freelance Details</h4>
                            <hr className="mt-1 mb-2"/>
                            <div className="row col-md-12">
                            <div className="col-md-3 pl-0">
                                <button className="counter btn-success p-2">
                                    Total Answered: &nbsp;
                                    {stats?.total_pending_qc}
                                </button>
                            </div>
                            
                            <div className="col-md-3 pl-0">
                                <button className="counter btn-success p-2">
                                    Total Solved: &nbsp;
                                    {stats?.total_solved}
                                </button>
                            </div>
                            <div className="col-md-3 pl-0">
                                <button className="counter btn-success p-2">
                                    Total Reworked: &nbsp;
                                    {stats?.total_reworked}
                                </button>
                            </div>

                            </div>    

                        </div>
                        
                        <div className="module-card" style={{ width: '100%'}}>
                            <h4>Freelance Question Answer</h4>
                            <hr className="mt-1 mb-2"/>
                            <div className="row col-md-12">
                                
                            </div>    
                            </div>
                        </div>
                        
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
