import React,{useState, useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import Switch from "react-switch";

import { Button } from 'react-bootstrap'
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import {useMutation, useQueryClient} from 'react-query'
import { useToasts } from 'react-toast-notifications';

export default function FAQHeading({faq}) {
    
    const history = useHistory();
    const params = useParams();
    const { addToast } = useToasts();

    const handleUpdate = async (id) => {
        history.push(`/book-faq/${params.isbn}/${params.book_id}/${id}`);
    }
    
    const {state} = useContext(AuthContext);

    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'Bearer '+state.access_token
        }
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}books/update-faq-status`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('faqs')
            history.push(`/book-faq/${params.isbn}/${params.book_id}`);
            addToast('Status Updated Successfully', { appearance: 'success',autoDismiss: true });
            var objDiv = document.getElementById("faqDiv");
            objDiv.scrollTop = 0;
        }
    });

    const [checked, setChecked] = useState(false);
    const handleChange = async ({faq_id,status}) => {
        setChecked(status);
        const formData = {book_id: params.book_id, faq_id, status}
        await mutation.mutate(formData);
    };

    const [loading, setLoading] = useState(false);
    const deleteMutation = useMutation(formData => {
        return axios.delete(`${API_URL}books/delete-faq/${params.book_id}/${formData.faq_id}`, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('faqs')
            history.push(`/book-faq/${params.isbn}/${params.book_id}`);
            addToast('Deleted Successfully', { appearance: 'success',autoDismiss: true });
            var objDiv = document.getElementById("faqDiv");
            objDiv.scrollTop = 0;
        }
    });
    const handleDelete = async (id) => {
        setLoading(true);
        await deleteMutation.mutate({faq_id: id});
    }


    return (
        <div className="subject-card-heading">
            <div>
            <Switch
                    onChange={handleChange.bind(this,{faq_id: faq?._id,status: faq?.status === true ? checked: !checked})}
                    checked={faq?.status === true ? faq?.status : checked}
                    className="react-switch mr-2"
                    height={20}
                    width={48}
                    handleDiameter={22}
                    onHandleColor="#f00"
                    boxShadow="0px 1px 2px rgba(0, 0, 0, 0.5)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                />

            </div>
            <div>
                
                <Button className="delBtn mr-2 ml-2" title="Update FAQ" onClick={handleUpdate.bind(this,faq?._id)}>
                    <span className="fa fa-pencil-square-o text-secondary mr-2"></span>
                </Button>

                <Button className="delBtn ml-2 mr-2" title="Delete FAQ" 
                    onClick={handleDelete.bind(this,faq?._id)}>
                    {loading ? (
                        <span className="fa fa-spinner text-danger mr-2"></span>
                    ):(
                        <span className="fa fa-trash text-danger mr-2"></span>
                    )}
                </Button>
            </div>
        </div>
    )
}
