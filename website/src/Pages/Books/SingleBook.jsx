import React from 'react'
import {useHistory, Link} from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import {MakeSlug, GetString} from '../../utils/MakeSlug';

export default function SingleBook({books}) {
    const history = useHistory();
    const handleDelete = async (e) => {
        history.push(`delete-data/books/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/books/update/${e}`);
    }
    const handleAdd = async (isbn, book, id) => {
        // const book_name = book.replace(/\s+/g, '-').toLowerCase();
        const book_name = MakeSlug(book);
        history.push(`/upload-chapters/${isbn}/${book_name}/${id}`);
    }
    return (
    <div className="module-card" key={books._id} id={`card-${books._id}`}>
        <div className="row">
        <div className="col-md-3 pr-0">
            <img src={`https://www.crazyforstudy.com/uploads/book-images-with-text/IMG-${books.ISBN13}.jpg`} className="img-responsive" style={{ width: "100%" }}/>
        </div>
        <div className="col-md-9">    
            <div className="subject-card-heading">
                <div>
                    <Link to={`view-permission/${books._id}`}>
                    #{books._id}
                    </Link></div>
                <div>
                    <Button className="delBtn" onClick={handleAdd.bind(this,books.ISBN13,books.BookName,books._id)}>
                        <FontAwesomeIcon icon={faUpload} alt="upload chapters" className="text-success mr-2"  varient="solid"/>
                    </Button>
                    <Button className="delBtn" onClick={handleUpdate.bind(this,books._id)}>
                        <FontAwesomeIcon icon={faEdit} className="text-success mr-2"  varient="solid"/>
                    </Button>
                    <Button className="delBtn" onClick={handleDelete.bind(this,books._id)}>
                        <FontAwesomeIcon icon={faTrash} className="text-danger"  varient="solid"/>
                    </Button>
                </div>
            </div>
            <div className="subject-card-body mt-2">
                <div className="admin-name"> 
                    <div className="name-label">
                        BookName: 
                    </div>
                    <div className="name-main">
                        {GetString(books.BookName,20)}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        Subject: 
                    </div>
                    <div className="name-main">
                        {books.subject_name}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        Sub Subject: 
                    </div>
                    <div className="name-main">
                        {books.sub_subject_name}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        ISBN13: 
                    </div>
                    <div className="name-main">
                        {books.ISBN13}
                    </div>
                </div> 
                
                <div className="admin-name"> 
                    <div className="name-label">
                        Book Edition: 
                    </div>
                    <div className="name-main">
                        {books.Edition}
                    </div>
                </div> 

                
                
                
            
            
            
             
        </div>
        </div>
        </div>
    </div>
    )
}


