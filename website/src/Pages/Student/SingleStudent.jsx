import React from 'react'
import * as utils from '../../utils/MakeSlug';
import StudentHeading from './StudentHeading';

function SingleStudent({student}) {
    return (
        <div className="subject-card" key={student._id} id={`card-${student._id}`}>
            <div className="subject-card-body">
                <div className="row col-md-12">
                    <div className="col-md-3 pl-0 pr-0">
                        {student?.img ? (
                            <img src={student?.img} className="img-responsive" style={{ width: '100%', borderRadius: '50%'}}/>
                        ): (
                            <p className="nameCard">
                                {utils.GetString(student.fullname, 1)}
                            </p>
                        )}
                    </div>
                    <div className="col-md-9">
                        <div className="admin-name mb-2"> 
                            <span className="fa fa-user"></span>{student.fullname}
                        </div> 
                        <div className="admin-name mb-2"> 
                            <span className="fa fa-envelope"></span> {student.email}
                        </div>
                        
                        <div className="admin-name mb-2"> 
                            <span className="fa fa-building"></span>{student.college}
                        </div>
                        <div className="admin-name mb-2"> 
                            <span className="fa fa-calendar"></span>{student.created_at}
                        </div>
                    </div>
                </div>
                
                

                <hr className="mt-1 mb-1"/>
                <StudentHeading student={student}/>
            </div> 

        </div>
    )
}

export default SingleStudent
