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
        history.push(`/books/update/${e}`);
    }
    const handleAdd = async (isbn, book, id) => {
        const book_name = MakeSlug(book);
        history.push(`/upload-chapters/${isbn}/${book_name}/${id}`);
    }
    
    const handleViewChapters = async (isbn, book, id) => {
        const book_name = MakeSlug(book);
        history.push(`/view-books-chapters/${isbn}/${book_name}/${id}`);
    }

    return (
        <div className="subject-card-heading">
            <div>
                <Button className="delBtn" onClick={handleViewChapters.bind(this,books.ISBN13,books.BookName,books._id)}>
                    <FontAwesomeIcon icon={faEye} title="View chapters" className="text-danger mr-2"  varient="solid"/>
                </Button>
                
                <Button className="delBtn" onClick={handleAdd.bind(this,books.ISBN13,books.BookName,books._id)}>
                    <FontAwesomeIcon icon={faUpload} title="upload chapters" className="text-success mr-2"  varient="solid"/>
                </Button>

                <Button className="delBtn" onClick={handleUpdate.bind(this,books._id)}>
                    <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                </Button>
                <Button className="delBtn" onClick={handleDelete.bind(this,books._id)}>
                    <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                </Button>
            </div>
        </div>
    )
}

export default BookHeading
