import React,{useContext} from 'react'
import './mainDash.css';

import {AuthContext} from '../context/AuthContext.jsx';
import useDashboardStatics from '../hooks/useDashboardStatics';

export default function Dashboard() {
const { state } = useContext(AuthContext);
const {data: dashboard} = useDashboardStatics();
console.log(dashboard)
return (

<>
{state.isLoggedIn && (
   
<div className="col-lg-10 col-md-10 main_dash_area">
    <div className="main-area-all">
        <div className="dashboard_main-container">
            <div className="dash-main-head">
                <h2>Dashboard</h2>
            </div>
            <div className="dash_over_view">
                <h5>Overviews</h5>
                <hr/>
                <div className="row">
                    <div className="col-md-12 pl-0">
                    {state.role == 1 && (

                    <div className="col-md-12 ml-1">
                    <div className="row">
                    <div className="col-md-3 mb-2 pl-3 pr-3 main-box gradient-ibiza">
                        <div className="card-body">
                            <div className="box-head">
                                <h4 style={{
                                    textShadow: '1px 1px #000'
                                }}>Number of User Registered</h4>
                                <div className="box-icon">
                                    <span className="fa fa-users" style={{
                                        position: 'absolute',
                                        right: '1.5rem',
                                        opacity: '0.2',
                                        fontSize: '6rem',
                                    }}></span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '2rem',
                                        right: '1rem',
                                        bottom: '5%',
                                        textShadow: '2px 2px #000'
                                    }}>{dashboard?.total_student}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3 ml-1 mb-2 main-box gradient-ibiza">
                        <div className="card-body">
                            <div className="box-head">
                                <h4 style={{
                                    textShadow: '2px 1px #000'
                                }}>Number of Freelance Tutor Registered</h4>
                                <div className="box-icon">
                                    <span className="fa fa-users" style={{
                                        position: 'absolute',
                                        right: '1.5rem',
                                        opacity: '0.2',
                                        fontSize: '6rem',
                                    }}></span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '2rem',
                                        right: '1rem',
                                        bottom: '5%',
                                        textShadow: '2px 2px #000'
                                    }}>{dashboard?.total_tutor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 ml-1 mb-2 main-box gradient-ibiza">
                        <div className="card-body">
                            <div className="box-head">
                                <h4 style={{
                                    textShadow: '2px 1px #000'
                                }}>Number of CFS Tutor Registered</h4>
                                <div className="box-icon">
                                    <span className="fa fa-users" style={{
                                        position: 'absolute',
                                        right: '1.5rem',
                                        opacity: '0.2',
                                        fontSize: '6rem',
                                    }}></span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '2rem',
                                        right: '1rem',
                                        bottom: '1%',
                                        textShadow: '2px 2px #000'
                                    }}>{dashboard?.total_cfs_tutor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3 ml-1 mb-2 main-box gradient-ibiza">
                        <div className="card-body">
                            <div className="box-head">
                                <h4 style={{
                                    textShadow: '2px 1px #000'
                                }}>Number of Book Listed</h4>
                                <div className="box-icon">
                                    <span className="fa fa-book" style={{
                                        opacity: '0.2',
                                        fontSize: '6rem',
                                    }}></span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '2rem',
                                        right: '1rem',
                                        bottom: '5%',
                                        textShadow: '2px 2px #000'
                                    }}>{dashboard?.total_books}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 ml-1 mb-2 main-box gradient-ibiza">
                        <div className="card-body">
                            <div className="box-head">
                                <h4 style={{
                                    textShadow: '2px 1px #000'
                                }}>Number of Total TBS Questions</h4>
                                <div className="box-icon">
                                    <span className="fa fa-question" style={{
                                        opacity: '0.2',
                                        fontSize: '6rem',
                                    }}></span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '2rem',
                                        right: '1rem',
                                        bottom: '5%',
                                        textShadow: '2px 2px #000'
                                    }}>{dashboard?.total_chapters}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 ml-1 mb-2 main-box gradient-ibiza">
                        <div className="card-body">
                            <div className="box-head">
                                <h4 style={{
                                    textShadow: '2px 1px #000'
                                }}>Number of Unsolved QAndA</h4>
                                <div className="box-icon">
                                    <span className="fa fa-question" style={{
                                        opacity: '0.2',
                                        fontSize: '6rem',
                                    }}></span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '2rem',
                                        right: '1rem',
                                        bottom: '5%',
                                        textShadow: '2px 2px #000'
                                    }}>{dashboard?.total_qna}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 ml-1 mb-2 main-box gradient-ibiza">
                        <div className="card-body">
                            <div className="box-head">
                                <h4 style={{
                                    textShadow: '2px 1px #000'
                                }}>Number of TBS Requests</h4>
                                <div className="box-icon">
                                    <span className="fa fa-question" style={{
                                        opacity: '0.2',
                                        fontSize: '6rem',
                                    }}></span>
                                    <span style={{
                                        position: 'absolute',
                                        fontSize: '2rem',
                                        right: '1rem',
                                        bottom: '5%',
                                        textShadow: '2px 2px #000'
                                    }}>{dashboard?.total_book_request}</span>
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
        </div>
    </div>
    
</div>  
)}   
</>

)
}
