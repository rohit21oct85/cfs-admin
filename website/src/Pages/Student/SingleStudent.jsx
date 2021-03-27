import React from 'react'
import StudentHeading from './StudentHeading';

function SingleStudent({student}) {
    return (
        <div className="subject-card" key={student._id} id={`card-${student._id}`}>
            <div className="subject-card-body">
                <div className="admin-name"> 
                    <div className="name-label">
                        Name: 
                    </div>
                    <div className="name-main">
                        {student.fullname}
                    </div>
                </div> 
                
                <div className="admin-name"> 
                    <div className="name-label">
                        Email: 
                    </div>
                    <div className="name-main">
                        {student.email}
                    </div>
                </div>
                 
                <div className="admin-name"> 
                    <div className="name-label">
                        School / Colledge: 
                    </div>
                    <div className="name-main">
                        {student.school}
                    </div>
                </div>
                <div className="admin-name"> 
                    <div className="name-label">
                        Registered: 
                    </div>
                    <div className="name-main">
                        {student.created_at}
                    </div>
                </div>

                <hr className="mt-1 mb-1"/>
                <StudentHeading student={student}/>
            </div> 

        </div>
    )
}

export default SingleStudent
