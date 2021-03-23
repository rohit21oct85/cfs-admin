import React, { useContext, useState, useEffect } from "react";
import "../mainDash.css";
import { useHistory, Link, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";

import { AuthContext } from "../../context/AuthContext";
import { ErrorContext } from "../../context/ErrorContext";
import { SubjectContext } from "../../context/SubjectContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointLeft } from "@fortawesome/free-solid-svg-icons";

import useAllSubjects from '../../hooks/useAllSubjects';
import useGetSubSubjects from '../../hooks/useGetSubSubjects';
import useSingleBook from '../../hooks/useSingleBook';
import { MakeSlug } from '../../utils/MakeSlug';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'

export default function CreateBooks() {
  const history = useHistory();
  const params = useParams();
  const { state } = useContext(AuthContext);
  const { state: errorState, dispatch: errorDispatch } = useContext(
    ErrorContext
  );
  const { state: sState, dispatch: sDispatch } = useContext(SubjectContext);
  const {data, isLoading, error} = useAllSubjects();
  const {data:SubSubjects} = useGetSubSubjects();
  const {data:SingleBook} = useSingleBook();

  const formDataUpload = new FormData();
  const [formData, setFormData] = useState({});
  const [subSubjectName, setSubSubjectName] = useState(null);
  const [subSubjectId, setSubSubjectId] = useState(null);
  const [btnDisabled, setBtnDisbaled] = useState(true);
  
  let API_URL = '';
  if(process.env.NODE_ENV === 'development'){
      API_URL = cons.LOCAL_API_URL;
  }else{
      API_URL = cons.LIVE_API_URL;
  }
  const options = {
      headers: {
          'Content-Type': 'Application/json',
          'Authorization':'Bearer '+state.access_token
      }
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    let response = null;
    if (formDataUpload.sub_subject_name == "") {
      errorDispatch({
        type: "SET_ERROR",
        payload: "Please Select sub subject",
      });
    } else {
      formData['subject_name'] = params.subject_name;
      formData['subject_id'] = params.subject_id
      formData['sub_subject_name'] = subSubjectName;
      formData['sub_subject_id'] = subSubjectId;
      let book_id = params.book_id
      console.log(formData);
      if(book_id){
        response = await axios.patch(`${API_URL}books/update/${book_id}`, formData,options);
      }else{
        response = await axios.post(`${API_URL}books/create`, formData, options);
      }
      errorDispatch({ type: "SET_SUCCESS", payload: response.message });
      history.push(`/books`);
    }
  }
  
    async function handleFormField(e){
      setFormData({...formData, [e.target.name]: e.target.value});
    }


  return (
    <>
      {state.isLoggedIn && (
        <div className="col-lg-10 col-md-10 main_dash_area">
          <div className="main-area-all">
            <div className="dashboard_main-container">
              <div className="dash-main-head">
                <h2>Create Books {params.subject_name}</h2>
              </div>
                            
              <div className="dash-con-heading">
                {params.subject_name ? (
                  <Link to={`/books-create`} className="btn btn-sm dark">
                    <FontAwesomeIcon
                      icon={faHandPointLeft}
                      className="text-white mr-2"
                      varient="solid"
                    />
                  </Link>
                ) : (
                  <Link to={`/books`} className="btn btn-sm dark">
                    <FontAwesomeIcon
                      icon={faHandPointLeft}
                      className="text-white mr-2"
                      varient="solid"
                    />
                  </Link>
                )}
              </div>
              <div className="dash-cont-start">
                <div className="org-main-area">
                  <div className="col-md-12 no-gutter p-0 mt-2">
                    <Form
                      method="POST"
                      className="col-md-12 p-0"
                      encType="multipart/form-data"
                    >
                    <div className="row">
                        <div className="col-md-4">
                        <Form.Group style={{ position: 'relative' }}>
                          <Form.Label>Subject Name</Form.Label>
                          {params.subject_name && !params.book_id ? (
                            <>
                            <Form.Control
                              name="subject"
                              autoComplete="off"
                              defaultValue={params.subject_name}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                }
                              }}
                              placeholder="Subject Name"
                            />
                            <span 
                              className="dark pt-1 pb-1 pr-2 pl-2"
                              style={{ 
                                position: 'absolute', 
                                right:'0%', 
                                top: '50%', 
                                cursor: 'pointer' 
                              }}
                            onClick={(event) => {history.push(`/books-create`)}}  
                            >x</span>
                            </>
                          ) : (
                            <select
                              className="form-control"
                              name="subject"
                              autoComplete="off"
                              onChange={(event) => {
                                const value = event.target.value;
                                const subject_name = MakeSlug(value.split("_")[0]);
                                const subject_id = value.split("_")[1];
                                let url = '';
                                if(params.book_id === SingleBook._id){
                                  url = `/books-create/${subject_name}/${subject_id}/${params.book_id}`
                                }else{
                                  url = `/books-create/${subject_name}/${subject_id}`
                                }
                                history.push(
                                  `${url}`
                                );
                              }}
                            >
                              <option>Select Subject</option>
                              {data && data.map((sub) => {
                                return (
                                  <option
                                    key={sub._id}
                                    value={sub.subject + "_" + sub._id}
                                    selected={SingleBook && SingleBook.subject_id === sub._id ? 'selected':''}
                                  >
                                    {sub.subject}
                                  </option>
                                );
                              })}
                            </select>
                          )}
                        </Form.Group>

                        {params.subject_name && (
                          <>
                            <Form.Group>
                              <Form.Label>SubSubject Name</Form.Label>
                              <select
                                className="form-control"
                                name="sub_subject"
                                autoComplete="off"
                                onChange={(event) => {
                                  const value = event.target.value;
                                  const sub_subject_name = MakeSlug(value.split("_")[0]);
                                  const sub_subject_id = value.split("_")[1];
                                  
                                  setSubSubjectName(sub_subject_name);
                                  setSubSubjectId(sub_subject_id);
                                  
                                  setBtnDisbaled(false);
                                }}
                              >
                                <option>Select Sub Subject</option>
                                {SubSubjects && SubSubjects.map((subsubject) => {
                                  const sub_subject = subsubject.sub_subject
                                    .toLowerCase()
                                    .trim()
                                    .replaceAll(" ", "-");
                                  const subSubjectId =
                                    sub_subject + "_" + subsubject._id;
                                  return (
                                    <option
                                      key={subsubject._id}
                                      value={subSubjectId}
                                      selected={SingleBook && SingleBook.sub_subject_id == subsubject._id ? 'selected':''}
                                    >
                                      {sub_subject}
                                    </option>
                                  );
                                })}
                              </select>
                            </Form.Group>
                          </>
                        )}
                        <Form.Group>
                          <Form.Label>Book Name</Form.Label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            defaultValue={SingleBook && SingleBook.BookName}
                            name="BookName"
                            onChange={handleFormField}
                          />
                        </Form.Group>

                        
                        <Form.Group>
                          <Form.Label>Edition</Form.Label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Edition"
                            defaultValue={SingleBook && SingleBook.Edition}
                            onChange={handleFormField}
                          />
                        </Form.Group>
                        
                      </div>
                       <div className="col-md-4">
                       <Form.Group>
                          <Form.Label>ISBN13</Form.Label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="ISBN13"
                            defaultValue={SingleBook && SingleBook.ISBN13}
                            onChange={handleFormField}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>ISBN10</Form.Label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="ISBN10"
                            defaultValue={SingleBook && SingleBook.ISBN10}
                            onChange={handleFormField}
                          />
                        </Form.Group>
                                
                        <Form.Group>
                          <Form.Label>Author 1</Form.Label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Author1"
                            defaultValue={SingleBook && SingleBook.Author1}
                            onChange={handleFormField}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Author 2</Form.Label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Author2"
                            defaultValue={SingleBook && SingleBook.Author2}
                            onChange={handleFormField}
                          />
                        </Form.Group>
                        
                        
                        </div>          
                        <div className="col-md-4">
                        <Form.Group>
                          <Form.Label>Author 3</Form.Label>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Author3"
                            defaultValue={SingleBook && SingleBook.Author3}
                            onChange={handleFormField}
                          />
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>Description</Form.Label>
                          <textarea
                            type="text"
                            autoComplete="off"
                            className="form-control"
                            name="Description"
                            defaultValue={SingleBook && SingleBook.Description}
                            style={{ height: '190px' }}
                            onChange={handleFormField}
                          />
                        </Form.Group>
                        
                        </div>
                    </div>    
                      <Form.Group>
                        <Button
                          onClick={handleSubmit}
                          defaultValue={SingleBook && SingleBook.Author1}
                          disabled={SingleBook && SingleBook._id ? '' :btnDisabled}
                          className="btn dark btn-sm"
                        >
                          {SingleBook && SingleBook._id ? 'Update Book' : 'Save Book'}
                        </Button>
                        
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
