import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { htmlConverterReact } from "html-converter-react";
import "../../table.css";
import useImportSection from "./hooks/useImportSection";
import useQuizletSections from "./hooks/useQuizletSections";


export default function ImportSections() {
  const params = useParams();
  const history = useHistory();
  const [sourceCode, setSourceCode] = useState(null);
  const [chapters, setChapetrs] = useState([]);
  const [clicked, setCLicked] = useState(false);
  const { data: quizletChapters , isLoading} = useQuizletSections();
  
  async function handleCreateChapters(e) {
    e.preventDefault();
    setCLicked(true);
    if(sourceCode?.length > 0) {
      let content = document.querySelectorAll(".i73vo82");
      content.forEach(value => {
        let section_no = value.children[0].innerText.split(":")[0];
        let section_name = value.children[0].innerText.split(":")[1];
        let checkChapters = chapters?.some((ch) => ch.section_no === section_no)
        if(checkChapters === false){
            setChapetrs(chapters => [
                  ...chapters,
                  {
                        chapter_no: params?.section_id,
                        section_no: section_no.replace(/ /g,'_'),
                        section_name: section_name,
                        book_isbn: params?.isbn,
                        answer_uploaded: 0,
                  },
            ]);
        }
      
      });
  }else{
    alert("enter source code")
  }
  
  history.push(`/books-freelance/QZ/${params?.isbn}/get-section/${params?.section_id}/${params?.sub_section_id?.replace(/ /g,'-')}`)
  setSourceCode("");
  }
  useEffect(filterSections, [quizletChapters])
  async function filterSections(){
      let chapter = quizletChapters?.filter(qc => qc._id === params?.section_id);
      if(chapter && chapter[0]?.sections?.length > 0){
        setChapetrs(chapter && chapter[0]?.sections);
      }
  }
  useEffect(() => {
    localStorage.setItem("chapters", JSON.stringify(chapters));
    if(chapters?.length > 0){
      setChapetrs(chapters);
    }
  }, [chapters]);

  const ImportSections = useImportSection();
  async function handleImportSections() {
    let data = {
      _id: params?.section_id,
      book_isbn: params?.isbn,
      sections: chapters,
      total_section: chapters?.length,
    };
    if (chapters?.length > 0) {
      await ImportSections.mutate(data, {
        onSuccess: () => {
          window.location.href = `books-freelance/${params?.solution_type}/${params?.isbn}/get-chapter`
          // setChapetrs(LocalChapters);
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
      <h2>Chapter Name: {params?.sub_section_id}</h2>
      {params?.sub_section_id && chapters?.length === 0 && quizletChapters && quizletChapters[0]?.total_section === undefined && (
        <div className="col-md-12 pl-0">
          <p><span className="text-danger">*</span> Open Quizlet and search this ISBN {params?.isbn} then go to Textbook then click right click then select content from Element 
          <br /><b className="text-danger">{`<div data-testid="TextbookTableOfContentList" class="twe4x3d">Copy All Content Including this div</div>`}</b>.</p>
      
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
                style={{ height: "400px", width: "100%" }}
                placeholder="Enter Source Code for Sections"
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
                  <th>Section No</th>
                  <th>Section Name</th>
                  <th>Ans Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {chapters?.map((chap, index) => {
                  return (
                    <tr key={`tr-${chap?.book_isbn}_${index}`}>
                      <td>{chap?.section_no?.replace(/_/g,' ')}</td>
                      <td onClick={
                            e => {
                                  history.push(`/books-freelance/${params?.solution_type}/${params?.isbn}/add-questions/${params?.section_id}/${params?.sub_section_id}/${chap?._id}::${chap?.section_no?.replace(/ /g,'-')}/${chap?.section_name?.replace(/ /g,'-')}`)
                            }
                      }>{chap?.section_name}</td>
                      <td>{chap?.answer_uploaded}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <hr />
          </div>
          {chapters?.length > 0 && quizletChapters[0]?.total_section === undefined && (
            <div className="col-md-12 pl-0">
              <button
                type="button"
                className="btn btn-sm bg-success text-white"
                onClick={handleImportSections}
              >
                <span className="bi bi-upload mr-2 "></span>
                Import Section- {params?.sub_section_id}
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
