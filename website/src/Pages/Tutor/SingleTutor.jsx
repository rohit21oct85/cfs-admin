import React from 'react'
import TutorHeading from './TutorHeading';

export default function SingleTutor({tutor}) {
    return (
        <div className="subject-card" key={tutor._id} id={`card-${tutor._id}`}>
            <div className="subject-card-body">
                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        Name: 
                    </div>
                    <div className="name-main">
                        {tutor.fname} {tutor.lname}
                    </div>
                </div> 
                
                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        Email: 
                    </div>
                    <div className="name-main">
                        {tutor.email}
                    </div>
                </div>
                 
                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        Master Subject: 
                    </div>
                    <div className="name-main">
                        {tutor.master_subject}
                    </div>
                </div>

                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        Class: 
                    </div>
                    <div className="name-main">
                        {tutor.class}
                    </div>
                </div>
                
                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        Subject: 
                    </div>
                    <div className="name-main">
                        {tutor.subject}
                    </div>
                </div>

                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        City: 
                    </div>
                    <div className="name-main">
                        {tutor.city}
                    </div>
                </div>
                
                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        ZipCode: 
                    </div>
                    <div className="name-main">
                        {tutor.zipcode}
                    </div>
                </div>

                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        Country: 
                    </div>
                    <div className="name-main">
                        {tutor.country}
                    </div>
                </div>
                <div className="admin-name mt-2 mb-2"> 
                    <div className="name-label">
                        Status: 
                    </div>
                    <div className="name-main">
                        {tutor.status == "1" ? (
                            
                            <>
                            <span className="fa fa-lock text-success pr-2 pt-1"></span>
                            <span className="text-success">Active</span>
                            </>
                        ):(
                            <>
                            <span className="fa fa-ban text-danger pr-2 pt-1"></span>
                            <span className="text-danger">Blocked</span>
                            </>
                        )}
                    </div>
                </div>


                <hr className="mt-1 mb-1"/>
                <TutorHeading tutor={tutor}/>
            </div> 

        </div>
    )
}


