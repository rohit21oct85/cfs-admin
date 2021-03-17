import React, {useContext} from 'react'
import '../mainDash.css';
import {  useHistory,useParams, Link  } from "react-router-dom";
import {ListGroup} from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';


import useChapters from '../../hooks/useChapters';
import SingleBook from './SingleBook';

export default function BooksChapters() {

    
const {state} = useContext(AuthContext);
const {data, isLoading, error} = useChapters();

return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2>Books Chapters</h2>
        </div>
        {error && <Notification>{error.message}</Notification>}
        {isLoading && <LoadingComp />}

        <div className="dash-con-heading">
            <div className="col-md-12 row">
                <div className="col-md-1">
                <Link to={`/books`} className="btn btn-sm dark">
                <FontAwesomeIcon
                    icon={faHandPointLeft}
                    className="text-white mr-2"
                    varient="solid"
                />
                </Link>
                </div>
                <div className="row pl-0 col-md-10">
                <div className="col-md-3">
                  <select className="form-control" name="chapter_no">
                    <option >Chapters</option>
                    {data && data.chapters.map(chapter => {
                        return (
                            <option 
                            key={chapter.chapter_name}
                            value={chapter.chapter_no}
                            >{chapter.chapter_no} - {chapter.chapter_name}</option>
                        );
                    })}
                  </select>  
                </div>
                <div className="col-md-3">
                  <select className="form-control" name="section_no">
                    <option >Sections</option>
                    {data && data.sections.map( (section, index) => {
                        return (
                            <option 
                            key={section.section_name}
                            value={section.section_no}
                            >{index+1} - {section.section_name}</option>
                        );
                    })}
                  </select>  
                </div>
                <div className="col-md-3">
                  <select className="form-control" name="excerise">
                    <option >Excerise</option>
                    { data && data.excerise.map((exe, index) => {
                        return (
                            <option 
                            key={exe.excerise}
                            value={exe.excerise}
                            >{index+1} - {exe.excerise}</option>
                        );
                    })}
                  </select>  
                </div>
            </div>
            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container p-3">    
            <h3 className="mt-3">Question: </h3>        
            <ListGroup>
            {data && data.problems.map(problem => {
                return (
                    <ListGroup.Item style={{ display: "flex", flexContent: 'space-between'  }}> 
                        <span className="problem_no">{problem.problem_no}: </span>
                        
                        <span className="question">{problem.question}</span>
                    </ListGroup.Item>
                )
            } )}
            </ListGroup>
            {data.error && (
                <div className="col-md-12 pl-0 text-danger">
                    <strong style={{ fontSize: '1.2rem' }}>{data.message}</strong>
                    <Link to={`/books-upload`}>Upload Books</Link>
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
