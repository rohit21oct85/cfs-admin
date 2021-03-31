import React from 'react'
import {MakeSlug, GetString} from '../../utils/MakeSlug';
import {useHistory, Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash,faPlus, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'
import * as utils from '../../utils/MakeSlug';

function Heading({content}) {
    const history = useHistory();
    
    const handleDelete = async (e) => {
       const ques_id = e;
       console.log(ques_id);
    }
    
    
    const handleUpdate = async (e) => {
        history.push(`/update-faq-question/${e.ques_id}`);
    }


    return (
        <div className="subject-card-heading">
            <div></div>
            <div>
                <Button className="delBtn pl-1 pr-1" onClick={handleUpdate.bind(this,{ques_id: content._id})}>
                    <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                </Button>
                <Button className="delBtn pl-1 pr-1" onClick={handleDelete.bind(this,content._id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                </Button>
            </div>
        </div>
    )
}

export default Heading
