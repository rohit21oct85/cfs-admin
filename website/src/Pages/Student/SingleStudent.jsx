import React from 'react'
import * as utils from '../../utils/MakeSlug';
import StudentHeading from './StudentHeading';

function SingleStudent({student}) {
    let profile;
    if(student?.social_id){
        profile = student?.img;
    }else{
        profile = `https://backup.crazyforstudy.com/uploads/student/thumb/${student?.img}`;
    }
    return (
        <tr className="subject-card" key={student._id} id={`card-${student._id}`}>
                <td>
                        {student?.img ? (
                            <img src={profile} className="img-responsive" style={{ width: '30px',height: '30px', borderRadius: '50%'}}/>
                        ): (
                            <p className="nameCard">
                                {student?.Name?.substr(0,1)}
                            </p>
                        )}
                    </td>
                    
                    <td> 
                        {student.Name}
                    </td> 
                    <td> 
                     {student.Email}
                    </td>
                    
                    <td> 
                        {student.college}
                    </td>
                    <td> 
                        {student.is_created}
                    </td>
                    <td> 
                        {student.Country}
                    </td>
                    
            <td>    
               <StudentHeading student={student}/>
            </td> 

        </tr>
    )
}

export default SingleStudent
