import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { htmlConverterReact } from "html-converter-react";
import "../../table.css";
import axios from "axios";
import * as cons from "../../../Helper/Cons";
import { AuthContext } from "../../../context/AuthContext";
import { useToasts } from "react-toast-notifications";
import { useMutation, useQueryClient } from "react-query";
import useQuizletChapters from "./hooks/useQuizletChapters";
import useOldBookQuestions from "./hooks/useOldBookQuestions";
import useSingleBook from "../../../hooks/useSingleBook";

export default function AddQuestion() {
      const { state } = useContext(AuthContext);
      const { addToast } = useToasts();
      const queryClient = useQueryClient();
      let API_URL = "";
      if (process.env.NODE_ENV === "development") {
            API_URL = cons.LOCAL_API_URL;
      } else {
            API_URL = cons.LIVE_API_URL;
      }
      const options = {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + state.access_token,
            },
          };
      const params = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState(null);
  const [sourceCode, setSourceCode] = useState(null);
  const [question, setQuestion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [converted, setConverted] = useState([]);

  const {data: QuizletChapters } = useQuizletChapters();
  const {data:oldQuestions}  = useOldBookQuestions();
  const {data: singleBook}    = useSingleBook();
  async function handleExtractAnswer(e) {
    e.preventDefault();
    if (sourceCode.length > 0) {
      let content = document.querySelectorAll(
            ".r8gl7vf"
      );
      
      content.forEach((value, index) => {
            setConverted((converted) => [
            ...converted,
            {
                  data: value,
            },
            ]);
      });
      console.log(content)
  }
  setSourceCode("");

  }
  
  async function UpdateExpertAnswer(e) {
      e.preventDefault();
      setUploading(true);
      let AnswersArray = [];
      let answer = {};
      let chapters;
      let qid;
      let chapter_no;
      let section_id;
      let type;
      if(params?.question_id){
        qid = params?.question_id?.split('::');  
      }else{
        qid = ["",""]
      }
      // qid = params?.question_id?.split('::');
      await converted?.map((answers, i) => {
        answer = { answer_sequence: i, answer: answers.data.innerHTML };
        AnswersArray.push(answer);
      });
      if(params?.section_id?.includes('oldbook')){
        chapter_no = params?.section_id.split('-')[0];
        section_id = '';
        type = 'oldbook'
      }else{
        chapters = QuizletChapters?.filter(qc => qc?._id === params?.section_id);
        chapter_no = chapters && chapters[0]?.chapter_no
        section_id = params?.section_id;
        type = 'quizlet'
      }
      const convertedAnswer = JSON.stringify(AnswersArray);
      let data;
      if(params?.section_id?.includes('oldbook')){
        data = {
          question_id: formData['question_id'],
          source: type,
          type : type,
          book_isbn: params?.isbn,
          chapter_id: section_id,
          book_name: singleBook?.BookName,
          book_id: singleBook?._id,
          answer: convertedAnswer,
          question: question,
          section_id: qid[0],
          section_no: qid[1],
          section_name: params?.exe_name,
          chapter_no: chapter_no,
          chapter_name: params?.sub_section_id?.replace(/-/g,' '),
          problem_no: `${formData['problem_no']}`,
          flag: 'notassigned',
          answer_uploaded: true,
        };
      }else{
        data = {
          source: type,
          type : type,
          book_isbn: params?.isbn,
          chapter_id: section_id,
          book_name: singleBook?.BookName,
          book_id: singleBook?._id,
          answer: convertedAnswer,
          question: question,
          section_id: qid[0],
          section_no: qid[1],
          section_name: params?.exe_name,
          chapter_no: chapter_no,
          chapter_name: params?.sub_section_id?.replace(/-/g,' '),
          problem_no: `Exe - ${formData['problem_no']}`,
          flag: 'notassigned',
          answer_uploaded: true,
        };
      }
      
      // console.log(data); return;
      await MutateExpertAnswer.mutate(data);
    }
  
    const MutateExpertAnswer = useMutation(
      (formData) => {
        return axios.post(
          `${API_URL}chapter/quizlet-add-answer`,
          formData,
          options
        );
      },
      {
        onSuccess: () => {
          setFormData({...formData, ['problem_no']: formData['problem_no'] +1})
          setSourceCode([]);
          setConverted([]);
          setUploading(false);
          addToast("Expert Answer Updated", {
              appearance: "success",
              autoDismiss: true,
            });
          queryClient.invalidateQueries([
            `old-questions-${params?.isbn}`,
          ]);
          let path;  
          if(params?.section_id?.includes('oldbook')){
            path = `/books-freelance/${params?.solution_type}/${params.isbn}/add-question/${params?.section_id}/${params?.sub_section_id}`;
          }else{
            path = `/books-freelance/${params?.solution_type}/${params.isbn}/add-question/${params?.section_id}/${params?.sub_section_id}/${problems[1]?._id}`;
          }  
          history.push(path);
          
        },
      }
    );

  return (
    <div className="col-md-12 flex pl-0 ">
      
      {params?.status === 'add-questions'  && (
        <div className="col-md-5 p-2 bg-white">
            <p>Chapter Name: {params?.sub_section_id}</p>
            <p>Chapter No: {params?.section_id}</p>
            {params?.question_id && (
            <p>Section No: {params?.question_id?.split('::')[1]?.replace(/_/g,' ')}</p>
            )}
            {params?.exe_name && (
            <p>Section Name: {params?.exe_name}</p>
            )}
          <form>
            <div className="form-group pb-0">
              {params?.section_id?.includes('oldbook') ? (
                <select className="form-control"
                onChange={e => {
                  let problems = e.target.value;
                  setFormData({...formData, ['question_id']: problems?.split('-')[0],['problem_no']: problems?.split('-')[1]})
                }}>
                  <option value="">
                    Select Question
                  </option>
                  {oldQuestions?.map(oq => {
                    if(oq?.answer_uploaded === false)
                    return(
                      <option value={oq?._id+'-'+oq?.problem_no}>{oq?.problem_no} - {oq?.question?.substr(0,10)}</option>
                    )
                  })}
                </select>
              ) : (
                <input type="text" className="form-control" placeholder="Enter Q. No" onChange={e => setFormData({...formData, ['problem_no']: e.target.value})}/>
              )}
            </div>
            <div className="form-group pb-0">
              <input type="text" className="form-control" placeholder="Enter Question" onChange={e => setQuestion(e.target.value)}/>
            </div>
            <div className="form-group">
            <p><span className="text-danger">*</span> Open Quizlet and search this ISBN {params?.isbn} then go to Textbook then click right click then select content from Element 
            <br /><b className="text-danger">{`<div data-testid="ExplanationsSolution" class="e1sw891e">Copy All Content Including this div</div>`}</b>.</p>
                
              <textarea
                value={sourceCode?.length > 0 ? sourceCode : ""}
                id="sourceCode"
                onChange={(e) => {
                  e.preventDefault();
                  setSourceCode(e.target.value);
                }}
                className="form-control p-2"
                style={{ height: "160px" }}
                placeholder="Enter Source Code for Sections"
              ></textarea>
            </div>

            <div className="form-group flex">
              <button
                className="btn btn-sm dark"
                onClick={handleExtractAnswer}
              >
                <span className="fa fa-save mr-2"></span>
                Extrect Answer
              </button>
              <button
                className="btn btn-sm bg-danger"
                onClick={() => history.push(`/books/freelance`)}
              >
                <span className="fa fa-times"></span>
              </button>
            </div>
          </form>
        </div>
      )}
      {sourceCode && (
      <div className="col-md-7" style={{ display: "none" }}>
      {htmlConverterReact(sourceCode)}
      </div>
      )}
      <div className="col-md-7 ml-2 bg-white p-2">
      <h4> Expert Solutions {converted?.length}{" "} {sourceCode?.length}</h4>
      <hr className="mt-1 mb-2" />
      <div
      className="col-md-12 pl-0 pr-0"
      style={{
            height: "420px",
            overflow: "scroll",
            borderBottom: "1px solid #ededed",
      }}
      >
      {converted?.map((content, i) => {
            return (
            <div
            className="card p-2 br-5 mb-2"
            key={Date.now() + i}
            >
            {htmlConverterReact(content?.data)}
            </div>
            );
      })}
      </div>
      <div className="col-md-12 mt-3 pr-0 pull-right">
      <button className="dark bg-succcess"
      onClick={() => {

            history.push(`/books-freelance/${params?.solution_type}/${params?.isbn}/view-uploaded-chapter/${params?.section_id}/${params?.sub_section_id}/${params?.question_id}`)
      }}>
            <span className="fa fa-times mr-2"></span>
            Cancel
      </button>
      <button
            className="btn btn-md dark pull-right"
            onClick={UpdateExpertAnswer}
            disabled={converted?.length === 0}
      >
            {uploading ? (
            <>
            <span className="fa fa-spinner mr-2"></span>
            Updating ....
            </>
            ) : (
            <>
            <span className="fa fa-save mr-2"></span>
            Update Solutions
            </>
            )}
      </button>
      </div>
      </div>
    </div>
  );
}
