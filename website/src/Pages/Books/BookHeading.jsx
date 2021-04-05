import React from 'react'
import {MakeSlug, GetString} from '../../utils/MakeSlug';
import {useHistory, Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'

function BookHeading({books}) {
    const history = useHistory();
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
    
    const handleViewChapters = async (isbn, book, id) => {
        const book_name = MakeSlug(book);
        history.push(`/book-chapters/${isbn}/${book_name}/${id}`);
    }

    return (
        <div className="subject-card-heading">
            <div></div>
            <div>
                <Button className="delBtn pl-1 pr-1" onClick={handleViewChapters.bind(this,books.ISBN13,books.BookName,books._id)}>
                    <span className="fa fa-eye-o text-secondary mr-2"></span>
                </Button>
                
                <Button className="delBtn pl-1 pr-1" onClick={handleUpload.bind(this,books.ISBN13,books.BookName,books._id)}>
                    <span className="fa fa-cloud text-success mr-2"></span>
                </Button>

                <Button className="delBtn pl-1 pr-1" onClick={handleUpdate.bind(this,{subject_name: books.subject_name, subject_id: books.subject_id,book_id: books._id})}>
                    <span className="fa fa-pencil-square-o text-secondary mr-2"></span>
                </Button>
                <Button className="delBtn pl-1 pr-1" onClick={handleDelete.bind(this,books._id)}>
                    <span className="fa fa-trash text-danger mr-2"></span>
                </Button>
            </div>
        </div>
    )
}

export default BookHeading
