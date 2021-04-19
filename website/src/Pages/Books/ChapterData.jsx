import React from 'react'
import {useHistory, useParams} from 'react-router-dom'

export default function ChapterData({data}) {
    const history = useHistory();
    const params = useParams();
    return (
    <div className="mt-2 pl-2 pr-2 pt-1 pb-1" style={{  border: '1px solid #ddd'}}> 
        <div className="name-label">
            <strong>{data._id.chapter_no}. &nbsp; </strong>
            {data._id.chapter_name} 
        </div>
        <hr className="mt-1 mb-1"/>
        <div className="admin-name" style={{display: 'flex', justifyContent: 'start',}}>
            <button className="counter btn-danger mr-2"
            onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/answered`)}
            >
            Pending For QC -- {data.answered}
            </button>
            <button className="counter btn-success mr-2"
            onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/approved`)}
            >
            Total Approved -- {data.approved}
            </button>
            <button className="counter btn-primary"
            onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/assigned`)}
            >
            Total Question -- {data.count}
            </button>
            
        </div>
    </div> 
    
    )
}
