import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory, useLocation  } from "react-router-dom";

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useChapters from '../../hooks/useChapters';
import axios from 'axios';
import * as cons from '../../Helper/Cons.jsx'

import Question from './Question';

export default function BooksChapters() {

const history = useHistory();
const params = useParams();
const location = useLocation();

const {state} = useContext(AuthContext);

const {data, isLoading, error} = useChapters();

const [chapters, setChapters] = useState([]);
const [sections, setSections] = useState([]);
const [excerise, setExcerise] = useState([]);
const [problems, setProblems] = useState([]);

useEffect(()=> {
    if(location?.pathname === '/books-chapters'){
        history.push(`/books/chapters`)
    }
},[state, params?.isbn]);

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

useEffect(() => {
    setChapters(data && data.chapters);
    setSections(data && data.sections);
    setExcerise(data && data.excerise);
    setProblems(data && data.problems);  
    
},[data, isLoading, params])


const handleChapter = async (e) => {
    setSections([]);
    setExcerise([]);
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
const handleSection = async (e) => {
    setSearch('');
    const c_no = chapter_no.current.value
    const s_no = section_no.current.value
    const result = await axios.get(`${API_URL}chapter/exercise/${params.isbn}/${c_no}/${s_no}`,options);
    setExcerise(result.data.excerise);
    setProblems(result.data.problems);
}
const handleExcerise = async (e) => {
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
    const result = await axios.get(`${API_URL}chapter/search-question/${params.isbn}/${search}`, options);
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
        setSearch('');
        if(search){
            setProblems(problems)
        }
    }
    return () => clearTimeout(delayDebounceFn)
},[search]);


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
                <span className="fa fa-arrow-left"></span>
                </Link>
                <br />
                <Link to={`/books-upload-chapters/${params.isbn}/${params.book_name}/${params.book_id}`} className="btn btn-sm mt-2 dark">
                <span className="fa fa-cloud"></span>
                </Link>

                </div>
                <div className="row col-md-10">
                {chapters && chapters.length > 0 &&  (
                <div className="col-md-6 pr-0">
                  <select className="form-control" name="chapter_no"
                      onChange={handleChapter}
                      ref={chapter_no}
                    >
                    {chapters && chapters.map(chapter => {
                        return (
                            <option 
                            key={chapter.chapter_name}
                            value={chapter.chapter_no}
                            
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
                    {sections && sections.map( (section, index) => {
                        let i = index+1
                        return (
                            <option 
                            key={i}
                            value={section.section_no}
                            >{section.section_no === "NULL" ? '' : section.section_no} {section.section_name}</option>
                        );
                    })}
                  </select>  
                </div>
                 )}
                {excerise && excerise.length > 0 && excerise[0].excerise && ( 
                <div className="col-md-3 pr-0">
                  <select className="form-control" name="excerise"
                  ref={excerise_no}
                  onChange={handleExcerise}
                  >
                    {excerise && excerise.map((exe, index) => {
                        let i = index+1
                        return (
                            <option 
                            key={exe.excerise}
                            value={exe.excerise}
                            >{i} - {exe.excerise}</option>
                        );
                    })}
                  </select>  
                </div>
                )}
                {problems && problems.length > 0 && ( 
                <div className="col-md-6 pr-0">
                  <select className="form-control" name="excerise"
                  ref={problem_no}
                  onChange={handleProblems}
                  >
                    {problems && problems.map((problem, index) => {
                        let i = index+1
                        return (
                            <option 
                            key={problem.problem_no}
                            value={problem.problem_no}
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
        <div className="subject-main-container pl-0 pt-0 pr-0 pb-0">    
            {!filter && (
                <>
                <h3 className="mt-0">Question: </h3>  
                <div className="clearfix"></div>      
                {problems?.map(problem => {
                    return (
                        <Question key={problem?._id} problem={problem} search={search}/>
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
                        <Question key={problem._id} problem={problem} search={search}/>
                    )
                } )}   
                </>
            )}
            
            {data.error && (
                <div className="col-md-12 pl-0 text-danger">
                    <strong style={{ fontSize: '1.2rem' }}>{data?.message}</strong>
                    <Link to={`/upload-chapters/${params?.isbn}/${params?.book_name}/${params?.book_id}`}>Upload Books</Link>
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
