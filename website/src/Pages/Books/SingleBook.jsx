import React from 'react'
import {GetName, GetString} from '../../utils/MakeSlug';
import BookImage from './BookImage';
import BookHeading from './BookHeading';

export default function SingleBook({books, width, heading}) {
    return (
    <div className="lg-card pt-2" style={{ width: width+'%'}} key={books._id} id={`card-${books._id}`}>
        <div className="row">
        <div className="col-md-3 pl-2 pr-3">
            <BookImage isbn={books.ISBN13}  width="115%"/>
        </div>
        <div className="col-md-9 pr-3 pl-3">    
           <div className="subject-card-body pl-2">
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
                        {GetName(books.sub_subject_name)}
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
                <div className="admin-name"> 
                    <div className="name-label">
                        Question: 
                    </div>
                    <div className="name-main">
                        {books?.question_uploaded ? (
                        <><span className="fa fa-check-circle mt-1 mr-2 text-success"></span> Uploaded</>) : (
                        <><span className="fa fa-times-circle mt-1 mr-2 text-danger"></span> Not Uploaded</>
                        )}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        Total Question: 
                    </div>
                    <div className="name-main">
                        {books?.total_question}
                    </div>
                </div> 

        </div>
        
        </div>
        </div>
        
        {heading && (<>
            <hr className="mt-1 mb-1"/>
            <BookHeading books={books}/>
        </>)}
    </div>
    )
}


