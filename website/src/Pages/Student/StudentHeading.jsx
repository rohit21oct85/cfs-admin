import React from 'react'
import {useHistory} from 'react-router-dom'
import { Button } from 'react-bootstrap'

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
                    <span className="fa fa-pencil-square-o text-secondary mr-2"></span>
                </Button>
                <Button className="delBtn pl-1 pr-1" onClick={handleDelete.bind(this,student._id)}>
                    <span className="fa fa-trash text-danger mr-2"></span>
                </Button>
            </div>
        </div>
    )
}

export default BookHeading
