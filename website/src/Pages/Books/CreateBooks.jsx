import React, { useContext, useState, useEffect } from "react";
import "../mainDash.css";
import { useHistory, Link, useParams } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import * as api from "../../Helper/ApiHelper.jsx";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../context/AuthContext";
import { Notification } from "../../components/Notification";
import { ErrorContext } from "../../context/ErrorContext";
import { SubjectContext } from "../../context/SubjectContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointLeft } from "@fortawesome/free-solid-svg-icons";

import useAllSubjects from '../../hooks/useAllSubjects';
import useGetSubSubjects from '../../hooks/useGetSubSubjects';


export default function UploadBooks() {
  const history = useHistory();
  const params = useParams();
  const { state } = useContext(AuthContext);
  const { state: errorState, dispatch: errorDispatch } = useContext(
    ErrorContext
  );
  const { state: sState, dispatch: sDispatch } = useContext(SubjectContext);
  const {data, isLoading, error} = useAllSubjects();
  const {data:SubSubjects} = useGetSubSubjects();

  const formDataUpload = new FormData();
  const [formData, setFormData] = useState({});
  const [subSubjectName, setSubSubjectName] = useState(null);
  const [subSubjectId, setSubSubjectId] = useState(null);
  const [btnDisabled, setBtnDisbaled] = useState(true);
  const [fileDisabled, setFileDisbaled] = useState(true)
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    let response = null;
    if (formDataUpload.sub_subject_name == "") {
      errorDispatch({
        type: "SET_ERROR",
        payload: "Please Select sub subject",
      });
    } else {
      formDataUpload.append("subject_name", params.subject_name);
      formDataUpload.append("subject_id", params.subject_id);
      formDataUpload.append("sub_subject_name", subSubjectName);
      formDataUpload.append("sub_subject_id", subSubjectId);
      formDataUpload.append('file',  file);
      formDataUpload.append('BookName',formData.BookName);
      formDataUpload.append('Edition',formData.Edition);
      formDataUpload.append('ISBN13',formData.ISBN13);
      formDataUpload.append('ISBN10',formData.ISBN10);
      formDataUpload.append('Author1',formData.Author1);
      formDataUpload.append('Author2',formData.Author2);
      formDataUpload.append('Author3',formData.Author3);
      formDataUpload.append('description',formData.description);
      
      response = await api.post("books/create", formDataUpload);
      errorDispatch({ type: "SET_SUCCESS", payload: response.message });
      history.push(`/books`);
    }
  }
  
    async function handelChangeUpload(e){
        const filename = e.target.files[0].name;
        console.log('file onchange ' ,  filename);
        const ext = filename.split('.')[1];
        console.log(ext)
        if(ext === "jpg" || ext === 'png' || ext === 'gif' || ext === 'jpeg'){
            setBtnDisbaled(false);
            setFile(e.target.files[0]);
            formDataUpload.append('file', e.target.files[0]);
        }else{
            setBtnDisbaled(true);
            errorDispatch({type: 'SET_ERROR', payload: 'Only .csv files are allowed'});
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
                        <Form.Group>
                          <Form.Label>Subject Name</Form.Label>
                          {params.subject_name ? (
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
                          ) : (
                            <select
                              className="form-control"
                              name="subject"
                              autoComplete="off"
                              onChange={(event) => {
                                const value = event.target.value;
                                const subject_name = value.split("_")[0];
                                const subject_id = value.split("_")[1];
                                history.push(
                                  `/books-create/${subject_name
                                    .trim()
                                    .replace(" ", "-")
                                    .toLowerCase()}/${subject_id}`
                                );
                              }}
                            >
                              <option>Select Subject</option>
                              {data && data.map((sub) => {
                                return (
                                  <option
                                    key={sub._id}
                                    value={sub.subject + "_" + sub._id}
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
                                  const subject_name = value.split("_")[0];
                                  const sub_subject_id = value.split("_")[1];
                                  const sub_subject_name = subject_name
                                    .trim()
                                    .replace(" ", "-")
                                    .toLowerCase();

                                  setSubSubjectName(sub_subject_name);
                                  setSubSubjectId(sub_subject_id);
                                  setFileDisbaled(false);
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
                            onChange={handleFormField}
                          />
                        </Form.Group>
                        
                        </div>
                    </div>    
                      <Form.Group>
                        <Button
                          onClick={handleSubmit}
                          disabled={btnDisabled}
                          className="btn dark btn-sm"
                        >
                          Save Book
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
