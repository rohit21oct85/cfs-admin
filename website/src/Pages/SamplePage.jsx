import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import * as utils from '../../utils/MakeSlug';

import useSingleTutor from '../../hooks/useSingleTutor';


export default function TutorDetails() {
    const params = useParams();
    const history = useHistory();
    const {data} = useSingleTutor();
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Tutor Details</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark">
                                <span className="fa fa-arrow-left"></span>
                            </button>
                        </div>
                    </div>
                    <div className="dash-cont-start">
                    <div className="subject-main-container pl-0 pt-0 pr-0 pb-0">

                            {data?.fname}    
                    </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
