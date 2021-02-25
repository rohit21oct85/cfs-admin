import React, {useContext} from 'react'
import './mainDash.css';
import {  useHistory  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import {AuthContext} from '../context/AuthContext';

export default function MyProfile() {
    const history = useHistory();
    const {state} = useContext(AuthContext);

return (

    <>
    {state.isLoggedIn && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>My Profile</h2>
                </div>
                
                <div className="dash-cont-start">
                    <div className="org-main-area">
                        <div className="org-main-head">
                            <span className="org-main-head-name">
                                Hi <span>{state.fullname}!</span>
                            </span>
                        </div>
                        <div className="org-main-head-sub">
                            <p>You are a part of the following organizations. Go to the organization which you wish to access now.</p>
                        </div>
                    
                        <div className="org-main-part">
                            <div className="org-main-img">
                                <img src="/user.png" alt="profile"/>
                            </div>
                            <div className="org-main-details">
                                <div className="org-admin-name">
                                    <span className="org-admin-name-txt">Full Name: <b>{state.fullname}</b></span>
                                </div>
                                <div className="org-main-created">
                                    <span>Organization created on <b>{state.created_at}</b></span>
                                </div>
                                <div className="org-main-id">
                                    <span>Role:<b> {(state.role == 1) ? 'Master Admin':'Admin'}</b></span>
                                </div>
                                <div className="org-main-editor">
                                    <span>Email Address:<b> {state.email}</b></span>
                                </div>
                                <div className="org-admin-text">
                                    <p>You are an admin in this organization</p>
                                </div>
                            </div>
                            <div className="org-go-btn">
                                <Button variant="primary" >
                                    Update Profile
                                </Button>
                            </div>
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
