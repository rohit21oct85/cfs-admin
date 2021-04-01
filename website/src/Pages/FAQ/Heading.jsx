import React from 'react'
import {useHistory} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import * as utils from '../../utils/MakeSlug';

function Heading({faq}) {
    const history = useHistory();
    const handleDelete = async (e) => {
        history.push(`delete-data/manage-faq/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/faq-update/${e.faq_id}`);
    }
    
    const handleAdd = async (e) => {
        history.push(`/add-faq-question/${utils.MakeSlug(e.faq_category)}/${e.faq_id}`);
    }


    return (
        <div className="subject-card-heading">
            <div></div>
            <div>
                <Button className="delBtn pl-1 pr-1 text-black" onClick={handleAdd.bind(this,{faq_category:faq.faq_category,faq_id: faq._id})}>
                    <span className="fa fa-plus-circle text-success mr-2"></span>
                </Button>
                <Button className="delBtn pl-1 pr-1" onClick={handleUpdate.bind(this,{faq_id: faq._id})}>
                    <span className="fa fa-pencil-square-o text-secondary mr-2"></span>
                </Button>
                <Button className="delBtn pl-1 pr-1" onClick={handleDelete.bind(this,faq._id)}>
                    <span className="fa fa-trash text-danger mr-2"></span>
                </Button>
            </div>
        </div>
    )
}

export default Heading
