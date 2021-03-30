import React from 'react'
import {MakeSlug, GetString} from '../../utils/MakeSlug';
import {useHistory, Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'

function BookHeading({student}) {
    const history = useHistory();
    const handleDelete = async (e) => {
        history.push(`delete-data/all-students/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/student-update/${e.student_id}`);
    }


    return (
        <div className="subject-card-heading">
            <div></div>
            <div>
                <Button className="delBtn pl-1 pr-1" onClick={handleUpdate.bind(this,{student_id: student._id})}>
                    <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                </Button>
                <Button className="delBtn pl-1 pr-1" onClick={handleDelete.bind(this,student._id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                </Button>
            </div>
        </div>
    )
}

export default BookHeading
