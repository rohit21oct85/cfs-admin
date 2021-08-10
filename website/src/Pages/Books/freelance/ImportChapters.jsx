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
      //old class: c1xb40y7
      let renderContent = document.querySelector("#renderContent").children;
      let className = renderContent[0].firstChild.firstChild.firstChild.firstChild.className;
      
      let sectionClassName = renderContent[0].firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.className;
      let sections = document.querySelectorAll("."+sectionClassName);
      
      let content = document.querySelectorAll("."+className);
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
              exe_uploaded: 0,
              answer_uploaded: 0,
            },
          ]);
        }
      });

      // sections.forEach( (value, index) => {
      //       Array.from(value.children).forEach(d => {
      //         let section_no = d.ariaLabel.split(":")[0].split(" ")[1];
      //         let section_name = d.ariaLabel.split(":")[1];
      //         let checkSections = innerSections.some((ins) => ins.section_no == section_no)   
      //         if(checkSections === false){
      //           setInnerSections(innerSections => [
      //             ...innerSections,
      //             {
      //               section_no,
      //               section_name,
      //               chapter_no: chapters[index].chapter_no,
      //               chapter_name: chapters[index].chapter_name
      //             }
      //           ])
      //         }
      //     })
      // });
      // console.log(innerSections);
    }
    setSourceCode("");

  }
  const { data: quizletChapters , isLoading} = useQuizletChapters();
  useEffect(() => {
    if (quizletChapters?.length > 0) {
      setChapetrs(quizletChapters);
    }
  },[quizletChapters, isLoading])
  useEffect(() => {
    localStorage.setItem("chapters", JSON.stringify(chapters));
  }, [chapters]);

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
      {(chapters?.length === 0 && quizletChapters?.length === 0) && (
        <div className="col-md-3 pl-0">
          <form>
            <div className="form-group">
              <textarea
                value={sourceCode?.length > 0 ? sourceCode : ""}
                id="sourceCode"
                onChange={(e) => {
                  e.preventDefault();
                  setSourceCode(e.target.value);
                }}
                className="form-control"
                style={{ height: "240px", width: "300px" }}
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
                  <th>ISBN</th>
                  <th>Chapter No</th>
                  <th>Chapter Name</th>
                  <th>Sec Uploaded</th>
                  <th>Exe Uploaded</th>
                  <th>Ans Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {chapters?.map((chap, index) => {
                  return (
                    <tr key={`tr-${chap?.book_isbn}_${index}`}>
                      <td>{chap?.book_isbn}</td>
                      <td>{chap?.chapter_no}</td>
                      <td>{chap?.chapter_name}</td>
                      <td>{chap?.sec_uploaded}</td>
                      <td>{chap?.exe_uploaded}</td>
                      <td>{chap?.answer_uploaded}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr />
          </div>
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
