import React,{useState,useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../context/AuthContext';

import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'

import { Button } from 'react-bootstrap'

function Heading({content}) {
    
    const {state} = useContext(AuthContext);
    const history = useHistory();
    const params = useParams();
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    };
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient()
    const mutation = useMutation(formData => {
        // console.log(formData, options); return;
        return axios.get(`${API_URL}faq/delete-question/${params.faq_id}/${formData.question_id}`, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('singlefaq')
            setLoading(false);
            history.push(`/add-faq-question/${params.faq_category}/${params.faq_id}`);
            var objDiv = document.getElementById("questionDiv");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    })
    const handleDelete = async (e) => {
        setLoading(true);
        const formData = {question_id: e.ques_id}
        // console.log(formData); return;
        await mutation.mutate(formData);
    }
    
    
    const handleUpdate = async (e) => {
        history.push(`/add-faq-question/${e.faq_category}/${e.faq_id}/${e.ques_id}`);
    }


    return (
        <div className="subject-card-heading">
            <div></div>
            <div>
                <Button className="delBtn btn btn-sm pl-1 pr-2" onClick={handleUpdate.bind(this,{faq_category: params.faq_category,faq_id: params.faq_id, ques_id: content._id})}>
                    <span className="fa fa-pencil-square-o text-primary"></span>
                </Button>
                <Button className="delBtn text-danger pl-1 pr-1" onClick={handleDelete.bind(this,{ques_id: content._id})}>
                    {loading ? (
                        <span className="fa fa-spinner"></span>
                    ):(
                        <span className="fa fa-trash"></span>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default Heading
