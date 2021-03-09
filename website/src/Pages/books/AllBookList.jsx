import React, {useContext, useEffect, useState} from 'react'
import '../mainDash.css';
import {  useHistory, Link  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit, faPlus, faCloud } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {AdminContext} from '../../context/AdminContext';
import {ErrorContext} from '../../context/ErrorContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import {useFormData} from '../../hooks/useFormData';

import useAllBooks from '../../hooks/useAllBooks';

export default function AllBookList() {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {formData, handleChange} = useFormData();
    
    const {data, isLoading, error} = useAllBooks();

    const handleSubmit = async () => {
        console.log(formData);
    }

    const handleDelete = async (e) => {
        history.push(`delete-data/books/delete/${e}`) 
    }
    
    const handleUpdate = async (e) => {
        history.push(`/books/update/${e}`);
    }

return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2>All Books</h2>
        </div>
        {error && <Notification>{error}</Notification>}
        {isLoading && <LoadingComp />}

        <div className="dash-con-heading">
            <div className="col-md-12 row">
                <Button 
                onClick={ e => history.push('/books-create')}
                className="btn btn-sm dark">
                    <FontAwesomeIcon icon={faPlus} /> Add books</Button>
                    
                <Button 
                onClick={ e => history.push('/books-upload')}
                className="btn btn-sm dark ml-2">
                    <FontAwesomeIcon icon={faCloud} /> Upload books</Button>

            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container">    
            
        {data.map(books => { return (
           <div className="module-card" key={books._id} id={`card-${books._id}`}>
            <div className="subject-card-heading">
                <div>
                    <Link to={`view-permission/${books._id}`}>
                    #{books._id}
                    </Link></div>
                <div>
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
                        BookName: 
                    </div>
                    <div className="name-main">
                        {books.BookName}
                    </div>
                </div> 
                
                <div className="admin-name"> 
                    <div className="name-label">
                        Book Edition: 
                    </div>
                    <div className="name-main">
                        {books.BookEdition}
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
                        Created On: 
                    </div>
                    <div className="name-main">
                        {books.created_at.split('T')[0]}
                    </div>
                </div> 
                 
            </div>
        </div>
        )})}
        </div>
        </div>
        )}
        
    </div>
</div>
</div>

)}  
</>
)
}
