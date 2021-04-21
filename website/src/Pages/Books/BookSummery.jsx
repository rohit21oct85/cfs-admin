import React from 'react'
import BookImage from './BookImage';

export default function BookSummery({data, qc_data}) {
    return (
        <div className="subject-card" style={{ width: '90%'}}>
        <div className="row col-md-12 pr-0">
            <div className="col-md-4 pl-0 pr-0">
                <BookImage isbn={data.ISBN13} width="76%" />
            </div>
            <div className="col-md-8 pr-0 pl-0">
                <div className="admin-name mt-0 mb-3"> 
                    <div className="name-label">
                        Author: 
                    </div>
                    <div className="name-main">
                        {data.Author1}
                    </div>
                </div>
                <div className="admin-name mt-3 mb-3"> 
                    <div className="name-label">
                        ISBN-13: 
                    </div>
                    <div className="name-main">
                        {data.ISBN13}
                    </div>
                </div>
                <div className="admin-name mt-3 mb-3"> 
                    <div className="name-label">
                        Subject: 
                    </div>
                    <div className="name-main">
                        {data.subject_name}/{data.sub_subject_name}
                    </div>
                </div>
                <div className="admin-name mt-1 mb-1"> 
                    <div className="name-label">
                        Total Reviews: 
                    </div>
                    <div className="name-main">
                        {data.reviews.length}
                    </div>
                </div>
            </div>
        </div>
        
        <hr className="pt-1 pb-0"/> 
        <div className="admin-name mt-1 p-2" style={{ border: '1px solid #ddd'}}> 
            <div className="name-label pt-1">
                Total Question: 
            </div>
            <div className="name-main">
                <button className="counter">
                    Total - {qc_data?.total_question}
                </button>
            </div>
        </div> 
        <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
            <div className="name-label pt-1">
                Pending For QC: 
            </div>
            <div className="name-main">
                <button className="counter btn-danger">
                    Total - {qc_data?.total_pending_qc ? qc_data?.total_pending_qc: '0'}
                </button>
                
            </div>
        </div> 
        <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
            <div className="name-label pt-1">
                Solved: 
            </div>
            <div className="name-main">
                <button className="counter btn-success">
                    Total - {qc_data?.total_solved ? qc_data?.total_solved: '0'}
                </button>
            </div>
        </div> 
        
        
        <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
            <div className="name-label pt-1">
                Total Reworked: 
            </div>
            <div className="name-main">
                <button className="counter btn-primary">
                    Total -  {qc_data?.total_reworked ? qc_data?.total_reworked: '0'}
                </button>
               
            </div>
        </div> 
        <div className="admin-name mt-2 p-2" style={{ border: '1px solid #ddd'}}> 
            <div className="name-label pt-1">
                Total Rejected: 
            </div>
            <div className="name-main">
                <button className="counter btn-info">
                    Total -  {qc_data?.total_rejected ? qc_data?.total_rejected: '0'}
                </button>
            </div>
        </div> 
       
    </div>

    )
}
