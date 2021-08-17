import React, { useEffect } from 'react';
import {  useHistory , useParams , Link} from "react-router-dom";
import { Button } from 'react-bootstrap'

import Pagination from '../../components/Pagination';
import useAccessModules from '../../hooks/useAccessModules';
import useAccessModulePermission from '../../hooks/useAccessModulePermission';

function TopMenu({data}) {
    const history = useHistory();
    const params = useParams();

    let accessUrl = useAccessModules();

    useEffect(checkPageAccessControl,[accessUrl]);
    function checkPageAccessControl(){
        if(accessUrl === false){
            history.push('/403');
        }
    }
    const create = useAccessModulePermission('create');
    
    useEffect(manageAccess,[create]);
    function manageAccess(){
        if(create === false){
            history.push(`/master-admin`)
        }
    }
    return (
        <div className="dash-con-heading">
            <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                <Button className="dark mr-1"
                    onClick={e => history.push('/manage-faq')}
                >
                    <span className="fa fa-arrow-left"></span>
                </Button>
                {create && (
                <Button className="dark mr-1"
                    onClick={e => history.push('/master-admin/create')}
                >
                    <span className="fa fa-plus-circle"></span>   
                    &nbsp; 
                    Add New Admin
                </Button>
                )}

                {!params.faq_id && (
                    <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                        <Pagination pagination={data && data.pagination}/>
                    </div>    
                )}
            </div>
        </div>
    )
}

export default TopMenu
