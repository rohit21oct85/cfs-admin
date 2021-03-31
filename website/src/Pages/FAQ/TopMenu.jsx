import React from 'react';
import {  useHistory , useParams , Link} from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCloud ,faHandPointLeft} from '@fortawesome/free-solid-svg-icons'

import Pagination from '../../components/Pagination';

function TopMenu({data}) {
    const history = useHistory();
    const params = useParams();
    return (
        <div className="dash-con-heading">
            <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                <Button className="dark mr-1"
                    onClick={e => history.push('/manage-faq')}
                >
                    <FontAwesomeIcon icon={faHandPointLeft}/>
                </Button>
                <Button className="dark mr-1"
                    onClick={e => history.push('/manage-faq-category')}
                >
                    <FontAwesomeIcon icon={faPlus}/>
                    &nbsp; 
                    Add Faq Category
                </Button>

                <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                    <Pagination pagination={data && data.pagination}/>
                </div>    
            </div>
        </div>
    )
}

export default TopMenu
