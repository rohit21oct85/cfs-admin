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

import useAxios from '../../hooks/useAxios';

export default function AllBookList() {

    const history = useHistory();
    const {state} = useContext(AuthContext);
    const {state: adminState, dispatch: adminDispatch} = useContext(AdminContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);
    const {formData, handleChange} = useFormData();
    const {response, isLoading} = useAxios({
        method: 'get', url: 'books/view-all'
    });

    useEffect(() => {
        if(response !== null){
            const Books = response.data;
            adminDispatch({ type: 'GET_ALL_BOOKS', payload: Books})
        }
        console.log(adminState.AllBooks)

    }, [response]);
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    },[errorState.error, errorState.success]);
    
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
        {errorState.success && ( <Notification>{errorState.success}</Notification>)}
        {errorState.error && ( <Notification>{errorState.error}</Notification>)}
        {isLoading && (<LoadingComp />)}
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
        <h4 className="mt-2">All Books</h4>    
        <hr />
        <div className="subject-main-container">    
            
        {adminState.AllBooks.map(books => { return (
           <div className="module-card" key={books._id} id={`card-${books._id}`}>
            <div className="subject-card-heading">
                <div>
                    <Link to={`view-permission/${books.BookName.replaceAll(' ','-').toLowerCase().trim()}/${books._id}`}>
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
