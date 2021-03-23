import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory  } from "react-router-dom";
import {ListGroup} from "react-bootstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandPointLeft } from '@fortawesome/free-solid-svg-icons'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useChapters from '../../hooks/useChapters';
import {SameSlug} from '../../utils/MakeSlug';
import axios from 'axios';
import * as cons from '../../Helper/Cons.jsx'
import {useQuery} from 'react-query'
import Highlighter from "react-highlight-words";

export default function BooksChapters() {
const history = useHistory();
const params = useParams();
    
const {state} = useContext(AuthContext);
const {data, isLoading, error} = useChapters();

const [chapters, setChapters] = useState([]);
const [sections, setSections] = useState([]);
const [excerise, setExcerise] = useState([]);
const [problems, setProblems] = useState([]);


let API_URL = '';
if(process.env.NODE_ENV === 'development'){
    API_URL = cons.LOCAL_API_URL;
}else{
    API_URL = cons.LIVE_API_URL;
}
const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization':'Bearer '+state.access_token
    }
};
const chapter_no = useRef();
const section_no = useRef();
const excerise_no = useRef();
const problem_no = useRef();

const [selectedChapter, setSelectedChapter] = useState('');
const [selectedSection, setSelectedSection] = useState('');
const [selectedExe, setSelectedExe] = useState('');
const [selectedProblem, setSelectedProblem] = useState('');
useEffect(() => {
    setChapters(data && data.chapters);
    setSections(data && data.sections);
    setExcerise(data && data.excerise);
    setProblems(data && data.problems);   
    if(data && data.chapters){
        setSelectedChapter(data && data.chapters.length > 0 && data.chapters[0].chapter_no);
    }
    if(data && data.sections){
        setSelectedSection(data && data.sections.length > 0 && data.sections[0].section_no);
    }
    if(data && data.excerise){
        setSelectedExe(data && data.excerise.length > 0 &&  data.excerise[0].excerise);
    }
    if(data && data.problems){
        setSelectedProblem(data && data.problems.length > 0 && data.problems[0].problem_no);
    }
    
},[data, isLoading])


const handleChapter = async (e) => {
    setSections([]);
    setExcerise([]);
    setProblems([]);
    setFproblems([]);
    setSearch('');
    const c_no = chapter_no.current.value
    if(section_no.current === undefined){
        const result = await axios.get(`${API_URL}chapter/only-problem/${params.isbn}/${c_no}`,options);
        setProblems(result.data.problems);
    }else{
        const result = await axios.get(`${API_URL}chapter/section/${params.isbn}/${c_no}`,options);
        setSections(result.data.sections);
    }
    
}
// const {data} = useQuery(['chapters',params.isbn], )
const handleSection = async (e) => {
    setExcerise([]);
    setProblems([]);
    setFproblems([]);
    setSearch('');
    const c_no = chapter_no.current.value
    const s_no = section_no.current.value
    const result = await axios.get(`${API_URL}chapter/exercise/${params.isbn}/${c_no}/${s_no}`,options);
    setExcerise(result.data.excerise);
}
const handleExcerise = async (e) => {
    setProblems([]);
    setFproblems([]);
    setSearch('');
    const c_no = chapter_no.current.value
    const s_no = section_no.current.value
    const e_no = excerise_no.current.value
    const result = await axios.get(`${API_URL}chapter/problem/${params.isbn}/${c_no}/${s_no}/${e_no}`,options);
    setProblems(result.data.problems);
}
const [filter, setFilter] = useState(false);
const [fproblems, setFproblems] = useState([]);
const handleProblems = async (e) => {
    setFilter(true)
    setSearch('');
    setFproblems(problems.filter(problem => problem.problem_no === e.target.value))
}
const [search, setSearch] = useState('');

const searchQuestion = async (search) => {
    const result = await axios.get(`${API_URL}chapter/search-question/${params.isbn}/${search}`);
    console.log(result);
    setFproblems(result.data.problems);
}
useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        if(search.length > 5 && search != ''){
            searchQuestion(search);
        }
      }, 1500);
    if(search.length > 0 && search != ''){
        setFilter(true);
    }else{
        setFilter(false);
        setProblems(data && data.problems)
    }
    return () => clearTimeout(delayDebounceFn)
},[search])
const manageQuestion = (e) => {
    history.push(`/book-chapter-add-question/${e.q_id}`)
}
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
                <div className="p-0">
                <Link to={`/books`} className="btn btn-sm dark">
                <FontAwesomeIcon
                    icon={faHandPointLeft}
                    className="text-white mr-2"
                    varient="solid"
                />
                </Link>
                </div>
                <div className="row col-md-10">
                {chapters && (
                <div className="col-md-6 pr-0">
                  <select className="form-control" name="chapter_no"
                      onChange={handleChapter}
                      ref={chapter_no}
                    >
                    <option value="-1">Chapters</option>
                    {chapters && chapters.map(chapter => {
                        return (
                            <option 
                            key={chapter.chapter_name}
                            value={chapter.chapter_no}
                            selected={chapter.chapter_no == selectedChapter ? 'selected':''}
                            >{chapter.chapter_no} - {chapter.chapter_name}</option>
                        );
                    })}
                    </select>
                    </div>
                  )}
                {sections && sections.length > 0 && (    
                <div className="col-md-3 pr-0">
                  <select className="form-control" name="section_no"
                  ref={section_no}
                  onChange={handleSection}
                  >
                    <option value="-1">Sections</option>
                    {sections && sections.map( (section, index) => {
                        let i = index+1
                        return (
                            <option 
                            key={section.section_no}
                            value={section.section_no}
                            selected={section.section_no == selectedSection ? 'selected':''}
                            >{section.section_no} - {section.section_name}</option>
                        );
                    })}
                  </select>  
                </div>
                 )}
                {excerise && excerise.length > 0 &&   ( 
                <div className="col-md-3 pr-0">
                  <select className="form-control" name="excerise"
                  ref={excerise_no}
                  onChange={handleExcerise}
                  >
                    <option value="-1">Excerise</option>
                    {excerise && excerise.map((exe, index) => {
                        let i = index+1
                        return (
                            <option 
                            key={exe.excerise}
                            value={exe.excerise}
                            selected={exe.excerise == selectedExe ? 'selected':''}
                            >{i} - {exe.excerise}</option>
                        );
                    })}
                  </select>  
                </div>
                )}
                {problems && ( 
                <div className="col-md-6 pr-0">
                  <select className="form-control" name="excerise"
                  ref={problem_no}
                  onChange={handleProblems}
                  >
                    <option value="-1">Problems</option>
                    {problems && problems.map((problem, index) => {
                        let i = index+1
                        return (
                            <option 
                            key={problem.problem_no}
                            value={problem.problem_no}
                            selected={problem.problem_no == selectedProblem ? 'selected':''}
                            >{problem.problem_no} - {problem.question}</option>
                        );
                    })}
                  </select>  
                </div>
                )}

                <div className="col-md-6 pr-0">
                    <input name="search" className="form-control" autoComplete="off" placeholder="search questions..." value={search} onChange={e => setSearch(e.target.value)}/>
                </div>    
            </div>
            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container p-3">    
            {!filter && (
                <>
                <h3 className="mt-3">Question: </h3>  
                <div className="clearfix"></div>      
                {problems && problems.map(problem => {
                    return (
                        <>
                        <div className="card col-md-12 mb-2" key={problem.problem_no}>
                        <div className="card-title col-md-12" id={problem.problem_no}> 
                            <div className="subject-card-heading pt-2"> 
                                <div className="problem_no">Question ID: {problem.problem_no}: </div>
                                
                                <div>
                                    <button className="btn btn-sm dark"
                                    onClick={manageQuestion.bind(this,{q_id: problem.q_id})}>Manage Question</button>
                                </div>    
                                
                            </div>
                        </div>
                        {problem && problem.question != '' && (
                            <div className="card-body" style={{ padding: '0px 0px 20px 10px' }}>
                            <hr />
                            <span className="card-text">
                                
                                {problem.question}
                            </span> 
                            </div>
                        )}
                        
                        </div>    
                        </>
                    )
                } )}
                </>
            )}
            {filter && (
                <>
                <h3>Question: {search}</h3>  
                <div className="clearfix"></div>    
                {fproblems && fproblems.map(problem => {
                    return (
                        <>
                        <div className="card col-md-12 mb-2" key={problem.problem_no}>
                        <div className="card-title col-md-12" id={problem.problem_no}> 
                            <div className="subject-card-heading pt-2"> 
                                <div className="problem_no">Question ID: {problem.problem_no}: </div>
                                <div>
                                    <button className="btn btn-sm dark"
                                    onClick={manageQuestion.bind(this,problem._id)}>Manage Question</button>
                                </div> 
                            </div>
                            <hr />
                        </div>
                        {problem && problem.question != '' && (
                            <div className="card-body" style={{ padding: '0px 0px 20px 10px' }}>
                            <span className="card-text">
                            <Highlighter
                                    highlightClassName="highlight"
                                    searchWords={[search]}
                                    autoEscape={true}
                                    textToHighlight={problem.question}
                                />
                            </span> 
                            </div>
                        )}
                        
                        </div>    
                        </>
                        
                    )
                } )}   
                </>
            )}
            
            {data.error && (
                <div className="col-md-12 pl-0 text-danger">
                    <strong style={{ fontSize: '1.2rem' }}>{data.message}</strong>
                    <Link to={`/upload-chapters/${params.isbn}/${params.book_name}/${params.book_id}`}>Upload Books</Link>
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
