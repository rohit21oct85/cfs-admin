import React from 'react'
import {GetName, GetString} from '../../utils/MakeSlug';
import BookImage from './BookImage';
import BookHeading from './BookHeading';

export default function SingleBook({books}) {
    
    return (
    <div className="module-card" key={books._id} id={`card-${books._id}`}>
        <div className="row">
        <div className="col-md-3 pr-0">
            <BookImage isbn={books.ISBN13}  width="86%"/>
        </div>
        <div className="col-md-9">    
           
            <div className="subject-card-body">
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
        </div>
        <BookHeading books={books}/>
        </div>
        </div>
    </div>
    )
}


