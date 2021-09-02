import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useQuizletChapters from './hooks/useQuizletChapters';
import ImportChapters from './ImportChapters';
import ImportSections from './ImportSections';
import AddQuestion from './AddQuestion';
import DeleteIsbn from "../DeleteIsbn";

export default function QZSolution() {
      const params = useParams();
      const history = useHistory();
      return (
            <div className="main_dash_area">
               
              <div className="dash-con-heading">
                <div className="col-md-12 row">
                  <div className="p-0">
                    <button onClick={() => history.push(`/books/freelance`)} className="btn btn-sm dark">
                      <span className="fa fa-arrow-left"></span>
                    </button>

                  </div>
                  <DeleteIsbn />
                  <div className="p-0 ml-2">
                      <button
                        className="btn btn-sm dark"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(
                            `/books-freelance/${params?.solution_type}/${params?.isbn}/get-chapter`
                          );
                        }}
                      >
                        <span className="fa fa-download mr-2"></span>
                        Get Chapters
                      </button>
                    {params?.sub_section_id && (
                      <button
                        className="btn btn-sm bg-success text-white ml-2"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(
                            `/books-freelance/${params?.solution_type}/${params?.isbn}/get-section/${params?.section_id}/${params?.sub_section_id}`
                          );
                        }}
                      >
                        <span className="fa fa-download mr-2"></span>
                        Get Sections
                      </button>
                    )}
                    
                  </div>

                </div>
              </div>
              <div className="flex">
                  {params?.status === 'get-chapter' && (
                     <ImportChapters />   
                  )} 
                     
                  {(params?.status === 'add-section' || params?.status === 'get-section') && (
                     <ImportSections />   
                  )}
                   
                  {(params?.status === 'add-questions') && (
                     <AddQuestion />   
                  )}


              </div>  

            </div>
      )
}
