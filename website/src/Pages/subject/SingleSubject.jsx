import React, {useContext, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
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
        <div className="subject-card" key={sub._id} id={`card-${sub._id}`}>
        <div className="subject-card-heading">
            <div>
                <Link to={`sub-subject/${util.MakeSlug(sub.subject)}/${sub._id}`}>
                #{sub._id}
                </Link></div>
            <div>
                <Link to={`/subject-update/${sub._id}`}>
                    <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                </Link>
                {(state.role == 1) && (
                <Button className="delBtn" onClick={handleDelete.bind(this,sub._id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                </Button>
                )}
                
            </div>
        </div>
        <div className="subject-card-body mt-2">
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
    </div>
    )
}

export default SingleSubject
