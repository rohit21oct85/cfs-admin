import React, {useEffect} from 'react'
import {Button} from 'react-bootstrap'
import {Link, useHistory, useParams} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faEdit} from '@fortawesome/free-solid-svg-icons'

function SinglePermission({permission_group}) {
    const history = useHistory();
    const params = useParams();
    const handleDelete = async (e) => {
        history.push(`delete-data/master-permission-group/delete/${e}`) 
    }
    const handleUpdate = async (e) => {
        history.push(`/master-permission-group/${e.module_name}/update/${e.id}`);
    }

    return (
        <>
            <div className="subject-card" id={`card-${permission_group._id}`}>
            <div className="subject-card-body mt-2">
                <div className="admin-name"> 
                    <div className="name-label">
                        Module ID: 
                    </div>
                    <div className="name-main">
                        {permission_group.module_name}
                    </div>
                </div> 
                
               
                
                <div className="admin-name"> 
                    <div className="name-label">
                        Status: 
                    </div>
                    <div className="name-main">
                        {(permission_group.status == 1) ? 'Active':'Inactive'}
                    </div>
                </div> 
                
                
                <div className="admin-name"> 
                    <div className="name-label">
                        Created On: 
                    </div>
                    <div className="name-main">
                        {permission_group.created_at.split('T')[0]}
                    </div>
                </div> 
                <div className="admin-name"> 
                    <div className="name-label">
                        Methods: 
                    </div>
                    <div className="name-main-method">
                        {permission_group.module_method.map( method => {
                            return (
                                <p>{method.name}</p>
                            );
                        })}
                    </div>
                </div> 
                
            </div>
            <hr className="mt-1 mb-1"/>
            <div className="subject-card-heading">
                <div>
                </div>
                <div>
                    <Button className="delBtn" onClick={handleUpdate.bind(this,{id: permission_group._id, module_name: permission_group.module_name})}>
                    <span className="fa fa-pencil-square-o text-success mr-2"></span>
                    </Button>
                    <Button className="delBtn" onClick={handleDelete.bind(this,permission_group._id)}>
                        <span className="fa fa-trash text-danger"></span>
                    </Button>
                </div>
            </div>
        </div>
        </>
    )
}

export default SinglePermission
