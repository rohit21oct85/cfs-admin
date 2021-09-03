import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { htmlConverterReact } from "html-converter-react";
import "../../table.css";
import useImportChapter from "./hooks/useImportChapter";
import useQuizletChapters from "./hooks/useQuizletChapters";

export default function ImportChapters() {
  const params = useParams();
  const history = useHistory();
  const [sourceCode, setSourceCode] = useState(null);
  const [chapters, setChapetrs] = useState([]);
  const [clicked, setCLicked] = useState(false);
  const [outSections, setOutSections] = useState([]);
  const [innerSections, setInnerSections] = useState([]);

  async function handleCreateChapters(e) {
    e.preventDefault();
    setCLicked(true);
    if (sourceCode.length > 0) {
      
      let content = document.querySelectorAll(".c1xb40y7");
      content.forEach(value => {
        let chapter_no = value.children[0].innerText.split(":")[0].split(" ")[1];
        let chapter_name = value.children[0].innerText.split(":")[1];
        let checkChapters = chapters.some((ch) => ch.chapter_no == chapter_no)
        if (checkChapters === false) {
          setChapetrs((chapters) => [
            ...chapters,
            {
              chapter_no: chapter_no,
              chapter_name: chapter_name,
              book_isbn: params?.isbn,
              sec_uploaded: 0,
              answer_uploaded: 0,
              total_section: 0,
            },
          ]);
        }
      });
  }
  setSourceCode("");
}

  const { data: quizletChapters , isLoading} = useQuizletChapters();
  let LocalChapters;
  useEffect(() => {
    localStorage.setItem("chapters", JSON.stringify(chapters));
  }, [chapters]);
  useEffect(() => {
    setChapetrs(quizletChapters)
  }, [quizletChapters]);

  const ImportChapters = useImportChapter();
  async function handleImportChapters() {
    let data = {
      book_isbn: params?.isbn,
      quizlet: chapters,
    };
    if (chapters?.length > 0) {
      await ImportChapters.mutate(data, {
        onSuccess: () => {
          setChapetrs(LocalChapters);
        },
      });
    }
  }
  
  return (
    <div className="col-md-12 pl-0 ">
      {sourceCode && (
        <div className="col-md-7" id="renderContent" style={{ display: "none" }}>
          {htmlConverterReact(sourceCode)}
        </div>
      )}
      {chapters?.length === 0 && (
        <div className="col-md-12 pl-0">
          <p><span className="text-danger">*</span> Open Quizlet and search this ISBN {params?.isbn} then go to Textbook then click right click then select content from Element 
          <br /><b className="text-danger">{`<div className="cjzx4co">Copy All Content Including this div</div>`}</b>.</p>
      
          <form>
            <div className="form-group">
              <textarea
                value={sourceCode?.length > 0 ? sourceCode : ""}
                id="sourceCode"
                onChange={(e) => {
                  e.preventDefault();
                  setSourceCode(e.target.value);
                }}
                className="form-control p-2"
                style={{ height: "440px", width: "100%", overflow: 'hidden scroll' }}
                placeholder="Enter Source Code for Chapters"
              ></textarea>
            </div>

            <div className="form-group flex">
              <button
                className="btn btn-sm dark"
                onClick={handleCreateChapters}
              >
                <span className="fa fa-save mr-2"></span>
                Get Chapter
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
      {chapters?.length > 0 && (
        <div>
          <div
            className="col-md-12 pl-0 table table-responsive"
            style={{
              height: "440px",
              background: "white",
              overflow: "hidden scroll",
            }}
          >
            <table className="table">
              <thead>
                <tr>
                  <th>Ch No</th>
                  <th>Chapter Name</th>
                  <th>Total Sections</th>
                  <th>Sec Uploaded</th>
                  <th>Ans Uploaded</th>
                  <th>Add Questions</th>
                </tr>
              </thead>
              <tbody>
                {chapters?.map((chap, index) => {
                  return (
                    <tr key={`tr-${chap?.book_isbn}_${index}`}>
                      <td>{chap?.chapter_no}</td>
                      <td 
                      style={{
                        cursor: "pointer"
                      }}
                      onClick={e => history.push(`/books-freelance/QZ/${params?.isbn}/${(chap?.total_section > 0 ? 'get-section' : 'add-section')}/${chap?._id}/${chap?.chapter_name?.replace(/ /g,'-')}`)}>{chap?.chapter_name?.substr(0,60)}</td>
                      <td>{chap?.total_section ?? 0}</td>
                      <td>{chap?.sec_uploaded}</td>
                      <td>{chap?.total_question}</td>
                      {(chap?.total_section === 0 || chap?.type === 'old-book') && (
                        <td 
                        style={{
                          cursor: "pointer"
                        }}
                        onClick={e => {
                          history.push(`/books-freelance/${params?.solution_type}/${params?.isbn}/add-questions/${chap?.type ? chap?.chapter_no+'-oldbook' :chap?._id}/${chap?.chapter_name?.replace(/ /g,'-')}`)
                        }}>
                          Add Questions
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr />
          </div>
          {console.log(quizletChapters)}
          {quizletChapters?.length === 0 && (
            <div className="col-md-12">
              <button
                type="button"
                className="btn btn-sm bg-success text-white"
                onClick={handleImportChapters}
              >
                <span className="bi bi-upload mr-2 "></span>
                Import Chapters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
