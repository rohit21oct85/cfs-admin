import React,{useContext} from 'react'
import './mainDash.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../context/AuthContext.jsx';

export default function Dashboard() {
    const { state } = useContext(AuthContext);
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
                    <div className="col-md-3 card ml-3  pt-2 pb-2 main-box gradient-ibiza">
                        <div className="card-body pt-0 pb-0 pl-0">
                            <div className="box-head">
                                <h4>Admin</h4>
                                <div className="box-icon">
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>
                            </div>
                            <div className="main-box-text">
                                <b>Total: 1 </b> 
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
