import React from 'react'
import {useHistory, useParams, Link } from 'react-router-dom'
import useSingleBook from '../../hooks/useSingleBook';

export default function Seobradcrumb() {
    const {data:book} = useSingleBook();
    const history = useHistory();
    const params = useParams();
    const backUrl = params?.book_id 
        ? `/books/${book?.subject_name}/${book?.sub_subject_name}/${book?.sub_subject_id}`
        : `/book-seo/${params?.isbn}/${params?.book_id}`;
    return (
        <div className="p-0">
            <Link to={backUrl} className="btn btn-sm dark">
                <span className="fa fa-arrow-left"></span>
            </Link>
            <button onClick={e => history.push(`/book-seo/${params.isbn}/${params.book_id}`)} className="btn btn-sm dark ml-2">
                <span className="fa fa-globe mr-2"></span>
                SEO
            </button>

            <button onClick={e => history.push(`/book-faq/${params.isbn}/${params.book_id}`)} className="btn btn-sm dark ml-2">
                <span className="fa fa-question-circle mr-2"></span>
                FAQ
            </button>
            
            <button onClick={e => history.push(`/book-rating-review/${params.isbn}/${params.book_id}`)} className="btn btn-sm dark ml-2">
                <span className="fa fa-star mr-2"></span>
                Rating & Review
            </button>

        </div>
    )
}