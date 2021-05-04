import React ,{useState, useContext} from 'react'
import {MakeSlug, GetString} from '../../utils/MakeSlug';
import {useHistory, useParams, useLocation} from 'react-router-dom'
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import {useMutation, useQueryClient} from 'react-query'
import Switch from "react-switch";
import { useToasts } from 'react-toast-notifications';

function BookHeading({books}) {
    const history = useHistory();
    const params = useParams();
    const { addToast } = useToasts();
    const location = useLocation();
    const path = location.pathname;

    const handleDelete = async (e) => {
        history.push(`delete-data/books/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/books-create/${MakeSlug(e.subject_name)}/${e.subject_id}/${e.book_id}`);
    }
    const handleUpload = async (isbn, book, id) => {
        const book_name = MakeSlug(book);
        history.push(`/upload-chapters/${isbn}/${book_name}/${id}`);
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
    
    const handleViewChapters = async (isbn, book, id) => {
        const book_name = MakeSlug(book);
        history.push(`/book-chapters/${isbn}/${book_name}/${id}`);
    }
    
    const handleRatingAndReview = async (isbn, id) => {
        history.push(`/book-rating-review/${isbn}/${id}`);
    }

    
    const handleBookQulity = async (isbn, id) => {
        history.push(`/book-check-quality/${isbn}/${id}`);
    }

    
    const handleBookFaq = async (isbn, id) => {
        history.push(`/book-faq/${isbn}/${id}`);
    }
    
    const handleBookSEO = async (isbn, id) => {
        history.push(`/book-seo/${isbn}/${id}`);
    }



    const queryClient = useQueryClient();

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}books/update-published-status`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('books')
            history.push(`${path}`);
            addToast('Freelancer Published status updated', { appearance: 'success',autoDismiss: true });
        }
    });

    const [checked, setChecked] = useState(false);
    const handleChange = async ({book_id,status}) => {
        setChecked(status);
        const formData = {book_id: book_id, published: status}
        await mutation.mutate(formData);
    };

    return (
        <div className="subject-card-heading mt-2">
            <div>
            <Switch
                    onChange={handleChange.bind(this,{book_id: books._id,status: !checked})}
                    checked={books.published ? books.published : checked}
                    className="react-switch displayIcon mr-2"
                    height={20}
                    width={48}
                    handleDiameter={22}
                    onHandleColor="#f00"
                    boxShadow="0px 1px 2px rgba(0, 0, 0, 0.5)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    title="freelance tutoring"
                />
            </div>
            <div>

                <Button className="delBtn pl-1 pr-1" title="SEO" onClick={handleBookSEO.bind(this,books.ISBN13,books._id)}>
                    <span className={`fa fa-globe displayIcon ${books.seo === true ? 'text-success': 'text-danger'} mr-2`}></span>
                </Button>

                

                <Button className="delBtn pl-1 pr-1" title="QC Details" onClick={handleBookQulity.bind(this,books.ISBN13,books._id)}>
                    <span className="fa fa-thumbs-up displayIcon text-warning mr-2"></span>
                </Button>
                
                <Button className="delBtn pl-1 pr-1" title="View chapters & Questions" onClick={handleViewChapters.bind(this,books.ISBN13,books.BookName,books._id)}>
                    <span className="fa fa-eye displayIcon text-secondary mr-2"></span>
                </Button>
                
                <Button className="delBtn pl-1 pr-1" title="Upload Chapters and Questions" onClick={handleUpload.bind(this,books.ISBN13,books.BookName,books._id)}>
                    <span className="fa fa-cloud displayIcon text-success mr-2"></span>
                </Button>

                <Button className="delBtn pl-1 pr-1" title="Update Books" onClick={handleUpdate.bind(this,{subject_name: books.subject_name, subject_id: books.subject_id,book_id: books._id})}>
                    <span className="fa fa-pencil-square-o displayIcon text-secondary mr-2"></span>
                </Button>
                <Button className="delBtn pl-1 pr-1" title="Delete Books" onClick={handleDelete.bind(this,books._id)}>
                    <span className="fa fa-trash displayIcon text-danger mr-2"></span>
                </Button>
            </div>
        </div>
    )
}

export default BookHeading
