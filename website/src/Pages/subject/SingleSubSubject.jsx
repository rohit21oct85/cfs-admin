import React from 'react'
import {useHistory, Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

function SingleSubSubject({sub}) {
    const history = useHistory();
    const handleDelete = async (e) => {
        history.push(`delete-data/sub-subject/delete/${e}`);
    }
    return (
        <div className="subject-card" key={sub._id} id={`card-${sub._id}`}>
        <div className="subject-card-heading">
            <div>
                <Link to={`/sub-subject/books/${sub.sub_subject.replace(' ', '-').toLowerCase()}/${sub._id}`}>
                #{sub._id}
                </Link></div>
            <div>
                <Link to={`/sub-subject/update/${sub._id}`}>
                    <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                </Link>
                <Button className="delBtn" onClick={handleDelete.bind(this,sub._id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                </Button>
            </div>
        </div>
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
                    Sub Subject: 
                </div>
                <div className="name-main date">
                    {sub.sub_subject}
                </div>
            </div> 
        </div>
    </div>
    )
}

export default SingleSubSubject
