import React, {useContext} from 'react'
import '../mainDash.css';
import {  useHistory  } from "react-router-dom";
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCloud } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';


import useBook from '../../hooks/useBook';

import SingleBook from './SingleBook';
import SearchBook from './SearchBook';

export default function AllBookList() {

    const history = useHistory();
const {state} = useContext(AuthContext);
const {data, isLoading, error} = useBook();
return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2>All Books</h2>
        </div>
        {error && <Notification>{error}</Notification>}
        {isLoading && <LoadingComp />}

        <div className="dash-con-heading">
            <div className="col-md-12 row">
                <Button 
                onClick={ e => history.push('/books-create')}
                className="btn btn-sm dark">
                    <FontAwesomeIcon icon={faPlus} /> Add books</Button>
                    
                <Button 
                onClick={ e => history.push('/books-upload')}
                className="btn btn-sm dark ml-2">
                    <FontAwesomeIcon icon={faCloud} /> Upload books</Button>
                
                <Button 
                onClick={ e => history.push('/books-bulk-upload')}
                className="btn btn-sm dark ml-2">
                    <FontAwesomeIcon icon={faCloud} /> Bulk Uploads books</Button>

                <SearchBook />  
            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container">    
        {data.map(books => <SingleBook books={books} key={books._id}/> )}
        </div>
        </div>
        )}
        
    </div>
</div>
</div>

)}  
</>
)
}
