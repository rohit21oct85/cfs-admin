import React, {useContext} from 'react'
import '../mainDash.css';
import {  useHistory , useParams , Link} from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useBooks from '../../hooks/useBooks';
import SingleBook from './SingleBook';
import SearchBook from './SearchBook';
import CategoryBook from './CategoryBook';
import Pagination from '../../components/Pagination';
import * as util from '../../utils/MakeSlug';

export default function AllBookList() {
const history = useHistory();
const params = useParams();
const {state} = useContext(AuthContext);

const {data, isLoading, error} = useBooks();
return (

<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2 style={{ textTransform : 'capitalize' }}>
                All Books 
                <span style={{ fontSize: '0.95rem' }}>
                &nbsp;            
                &nbsp; { params && `${util.GetName(params.subject)}`}
                &nbsp; {params && util.GetName(params.sub_subject_name)} 
                &nbsp; {data &&  ` (${data.pagination.itemCount})`}
                </span>
                </h2>
        </div>
        {error && <Notification>{error.message}</Notification>}
        {isLoading && <LoadingComp />}

        <div className="dash-con-heading">
            <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                <Button 
                onClick={ e => history.push('/books-create')}
                className="btn btn-sm dark">
                    <span className="fa fa-plus-circle text-success mr-2"></span> Add books</Button>
                    
                    
                <Button 
                onClick={ e => history.push('/books-upload')}
                className="btn btn-sm dark ml-2">
                    <span className="fa fa-cloud text-success mr-2"></span> Upload books</Button>
                <Button 
                onClick={ e => history.push('/books-bulk-upload')}
                className="btn btn-sm dark ml-2">
                    <span className="fa fa-cloud text-success mr-2"></span> Bulk Uploads books</Button>

                <SearchBook />

                <CategoryBook />    

                <Pagination pagination={data && data.pagination}/>
                
            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container">    
        {data.data.map(books => <SingleBook books={books} key={books._id}/> )}
        {data.pagination && data.pagination.itemCount === 0 && (
            <div className="col-md-6 offset-3 p-5">
                <h2 style={{ fontSize: '1.2em' }}>No Books have been Uploaded in <br />
                <span
                style={{ fontSize: '1.5em' }} 
                className="text-danger">{params.sub_subject_name} under {params.subject} Category!!!</span>
                <br /> 
                Please Uplaod Books in this subject category</h2>
                <Link to={`/books-upload`} className="btn btn-sm dark">Upload Books</Link>
            </div>
        )}    
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
