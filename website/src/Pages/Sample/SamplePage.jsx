import React, {useState, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import * as utils from '../../utils/MakeSlug';
import useSample  from '../../hooks/useSample';
import { now } from 'mongoose';


export default function SamplePage() {
    const params = useParams();
    const history = useHistory();

    const {data} = useSample();
    const [ctime, setCTime] = useState(new Date.now());
    useEffect(()=> {
        setInterval(() => {
            setCTime(ctime - now())
        }, 1000);
    })
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
                            <h1>{ctime}</h1>
                    </div>    
                </div>
            </div>
        </div>
    )
}
