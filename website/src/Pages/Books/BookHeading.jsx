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
        history.push(`/books-upload-chapters/${isbn}/${book_name}/${id}`);
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
        history.push(`/books-chapters/${isbn}/${book_name}/${id}`);
    }

    
    const handleBookQulity = async (isbn, id) => {
        history.push(`/books-check-quality/${isbn}/${id}`);
    }

    

    const handleBookSEO = async (isbn, id) => {
        history.push(`/books-seo/${isbn}/${id}`);
    }
    
    const handleBookData = async (isbn,solution_type) => {
        history.push(`/books-freelance/${solution_type}/${isbn}`);
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
                {(params?.type == 'all' || params?.type == undefined) && state.role == '1' && (
                <> 
                    <Button className="dark text-warning br-10" title="Update Books" onClick={handleUpdate.bind(this,{subject_name: books.subject_name, subject_id: books.subject_id,book_id: books._id})}>
                        <span className="fa fa-pencil-square-o displayIcon mr-2"></span>
                        Edit Books
                    </Button>
                    <Button className="btn-danger text-white br-10" title="Delete Books" onClick={handleDelete.bind(this,books._id)}>
                        <span className="fa fa-trash displayIcon text-white mr-2"></span>
                        Delete Books
                    </Button>
                </>     
                )}
                {params?.type == 'freelance' && (
                    <div className="flex col-md-12 pl-0 pr-0" style={{ 
                        justifyContent: 'space-between',
                        
                    }}>
                    <Button className="dark text-warning br-10" onClick={handleBookData.bind(this,books.ISBN13, 'BB')}>
                        <span className={`fa fa-cog displayIcon mr-2`}></span>
                        Solution By BB
                    </Button>
                    <Button className="dark text-warning br-10" onClick={handleBookData.bind(this,books.ISBN13,'QZ')}>
                        <span className={`fa fa-cog displayIcon mr-2`}></span>
                        Solution By QZ
                    </Button>
                    </div>
                )}
                
                {params?.type == 'seo' && (
                    <Button className="dark text-warning pl-2 pr-2 br-10" onClick={handleBookSEO.bind(this,books.ISBN13,books._id)}>
                        <span className={`fa fa-globe displayIcon ${books.seo === true ? 'text-success': 'text-danger'} mr-2`}></span>
                        Manage Text Book Seo
                    </Button>
                )}
                {params?.type == 'check-quality' && (
                    <Button className="dark text-warning pl-2 pr-2 br-10" onClick={handleBookQulity.bind(this,books.ISBN13,books._id)}>
                    <span className="fa fa-thumbs-up displayIcon text-warning mr-2"></span>
                    Manage Books Answers Quality
                    </Button>
                )}
                
                {params?.type == 'chapters' && (
                    <>
                    <Button className="dark text-warning pl-2 pr-2 br-10" title="View chapters & Questions" onClick={handleViewChapters.bind(this,books.ISBN13,books.BookName,books._id)}>
                        <span className="fa fa-eye displayIcon text-white mr-2"></span>
                        View Chapters and Questions
                    </Button>
                    </>
                )}
                {params?.type == 'upload-chapters' && (
                    <>
                    <Button className="dark text-warning pl-2 pr-2 br-10" title="Upload Chapters and Questions" onClick={handleUpload.bind(this,books.ISBN13,books.BookName,books._id)}>
                        <span className="fa fa-cloud displayIcon text-success mr-2"></span>
                        Upload Books Chapters Questions
                    </Button>
                    </>
                )}
                {params?.type == 'authoring' && (
                    <div>
                    {state.role == '1' && (
                        <>
                        Authoring Tutor

                        <Switch
                            onChange={handleChange.bind(this,{book_id: books._id,status: !checked})}
                            checked={books.published ? books.published : checked}
                            className="react-switch displayIcon ml-2"
                            height={20}
                            width={48}
                            handleDiameter={22}
                            onHandleColor="#f00"
                            boxShadow="0px 1px 2px rgba(0, 0, 0, 0.5)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            title="freelance tutoring"
                        />
                        
                            
                        </>
                    )}
                    </div>
                )}
                


        </div>
    )
}

export default BookHeading
