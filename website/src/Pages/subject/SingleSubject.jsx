import React, {useContext, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import {  useHistory, Link  } from "react-router-dom";

import {AuthContext} from '../../context/AuthContext';
import * as util from '../../utils/MakeSlug';

function SingleSubject({sub}) {
    const {state} = useContext(AuthContext);
    const history = useHistory();
    const handleDelete = async (e) => {
        history.push(`delete-data/subject/delete/${e}`);
    }

    return (
        <div className="small-card" key={sub._id} id={`card-${sub._id}`}>
        <div className="subject-card-body">
            <div className="admin-name"> 
                <div className="name-label">
                    Subject Name: 
                </div>
                <div className="name-main">
                    {sub.subject}
                </div>
            </div> 
            
            <div className="admin-name"> 
                <div className="name-label">
                    Created On: 
                </div>
                <div className="name-main date">
                    {sub.created_at.split('T')[0]}
                </div>
            </div> 

            <div className="admin-name"> 
                <div className="name-label">
                    Status: 
                </div>
                <div className="name-main">
                    {(sub.status == 1) ? 'Active':'Inactive'}
                </div>
            </div> 
        </div>
        <hr className="mt-1 mb-1"/>
        <div className="subject-card-heading">
            <div></div>
            <div>
                <Button className="delBtn" onClick={e => history.push(`sub-subject/${util.MakeSlug(sub.subject)}/${sub._id}`)}>
                    <span className="fa fa-eye text-success mr-2"></span>
                </Button>
                <Button className="delBtn" onClick={e => history.push(`/subject-update/${sub._id}`)}>
                    <span className="fa fa-edit text-success mr-2"></span>
                </Button>
                {(state.role == 1) && (
                <Button className="delBtn" onClick={handleDelete.bind(this,sub._id)}>
                    <span className="fa fa-trash text-danger mr-2"></span>
                </Button>
                )}
                
            </div>
        </div>
    </div>
    )
}

export default SingleSubject
