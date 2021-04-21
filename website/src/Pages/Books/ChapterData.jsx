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
        <div className="clearfix"></div>
        <div className="admin-name" style={{display: 'flex', justifyContent: 'start',marginTop: '15px'}}>
            {data?.answered > 0 && (
                <button className="counter btn-danger mr-2"
                onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/answered`)}
                >
                Pending QC -- {data.answered}
                </button>
            )}
            {data?.approved > 0 && (
            <button className="counter btn-success mr-2"
            onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/approved`)}
            >
            Approved -- {data.approved}
            </button>
            )}
            {data?.reworked > 0 && (
            <button className="counter btn-success mr-2"
            onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/reworked`)}
            >
            Reworked -- {data.reworked}
            </button>
            )}    
            {data?.rejected > 0 && (
            <button className="counter btn-success mr-2"
            onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/rejected`)}
            >
            Rejected -- {data.rejected}
            </button>
            )}
            {data?.count > 0 && (
            <button className="counter btn-primary"
            onClick={e => history.push(`/book-check-quality/${params.isbn}/${params.book_id}/chapter/${data._id.chapter_no}/notassigned`)}
            >
            Not Assigned -- {data.count}
            </button>
            )}
        </div>
    </div> 
    
    )
}
