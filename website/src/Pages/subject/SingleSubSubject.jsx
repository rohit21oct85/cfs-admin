import React from 'react'
import {useHistory, Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import * as util from '../../utils/MakeSlug';

function SingleSubSubject({sub}) {
    const history = useHistory();
    const handleDelete = async (e) => {
        history.push(`delete-data/sub-subject/delete/${e}`);
    }
    return (
        <div className="lg-card" key={sub._id} id={`card-${sub._id}`}>
        <div className="subject-card-body">
            <div className="admin-name"> 
                <div className="name-label">
                    Subject: 
                </div>
                <div className="name-main date">
                    {sub.subject}
                </div>
            </div> 
            <div className="admin-name"> 
                <div className="name-label">
                    Sub Subject Id: 
                </div>
                <div className="name-main date">
                    {sub._id}
                </div>
            </div> 
            <div className="admin-name"> 
                <div className="name-label">
                    Sub Subject: 
                </div>
                <div className="name-main date">
                    {sub.sub_subject}
                </div>
            </div> 
        </div>
        <hr className="mt-1 mb-1"/>
        <div className="subject-card-heading">
            <div></div>
            <div>
                <button className="delBtn" onClick={e => history.push(`/books/${util.MakeSlug(sub.subject)}/${util.MakeSlug(sub.sub_subject)}/${sub._id}`)}>
                    <span className="fa fa-eye text-success mr-2"></span>
                </button>
                <button className="delBtn" onClick={e => history.push(`/sub-subject/update/${sub._id}`)}>
                    <span className="fa fa-edit text-success mr-2"></span>
                </button>
                <Button className="delBtn" onClick={handleDelete.bind(this,sub._id)}>
                    <span className="fa fa-trash text-danger mr-2"></span>
                </Button>
            </div>
        </div>
    </div>
    )
}

export default SingleSubSubject
