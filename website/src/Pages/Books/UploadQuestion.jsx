import React, {useState, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import * as utils from '../../utils/MakeSlug';
import useQuestions  from '../../hooks/useQuestions';



export default function UploadQuestion() {
    const params = useParams();
    const history = useHistory();

    const {data} = useQuestions();
     
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                    <div className="dash-main-head">
                        <h2>Books</h2>
                    </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row">
                            <button className="btn btn-sm dark">
                                <span className="fa fa-arrow-left"></span>
                            </button>
                        </div>
                    </div>
                  <div className="dash-cont-start ">
                        <div className="col-md-12 row no-gutter">
                        {data?.map((books) => {
                              return(
                                    <div className="col-md-2 p-2 card mb-2 cursor"
                                    onClick={e => history.push(`/books-freelance/${books?.isbn}`)}>
                                          {books?.isbn}
                                    </div>
                              )
                        })}   
                        </div>        
                    </div>    
                </div>
            </div>
        </div>
    )
}
