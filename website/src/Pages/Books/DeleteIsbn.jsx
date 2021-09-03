import React, {useState, useContext} from 'react'
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import * as cons from "../../Helper/Cons.jsx";
import { AuthContext } from "../../context/AuthContext";
import { useToasts } from "react-toast-notifications";
import { useParams,Link, useHistory, useLocation } from "react-router-dom";

export default function DeleteIsbn() {
      const { addToast } = useToasts();
      const { state } = useContext(AuthContext);
      const history = useHistory();
      const params = useParams();
      const location = useLocation();
      
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
      const queryClient = useQueryClient();
      const [doDeleteISBN, setDoDeleteISBN] = useState(false)
      const [deleteISBN, setDeleteISBN] = useState(false);
      async function deleteBooksByISBN(){
            setDeleteISBN(true);
            let formData = {
            book_isbn: params?.isbn,
            };
            await DeleteChapters.mutate(formData);
      }
      const DeleteChapters = useMutation(
      (formData) => {
            return axios.post(
            `${API_URL}chapter/bartelby-delete-all`,
            formData,
            options
            );
      },
      {
            onSuccess: () => {
            queryClient.invalidateQueries("chapters-bartelby");
            setDeleteISBN(false);
            history.push(
            `/books-freelance/${params?.solution_type}/${params?.isbn}/import-chapter/${params?.section_id}`
            );
            },
      }
      );

      return (
            <div className="p-0">
                     {doDeleteISBN === false && (
                      <button className="ml-2 btn-sm dark bg-danger"
                      onClick={e => {
                        let uConfirm = confirm("Do you have rights to delete all data related to this ISBN " + params?.isbn, "yes", "No");
                        if(uConfirm){
                          let answer = prompt("please enter the delete Password");
                          if(answer === 'wrong-password'){
                            setDoDeleteISBN(true);
                          }else{
                            alert("your have entered a wong-password...?")
                          }
                        }
                      }}
                      >
                        <span className="fa fa-times"></span>
                      </button>
                    )}
                    {state.role == "1" && doDeleteISBN && (
                      <button className="ml-2 btn-sm dark bg-danger"
                      onClick={deleteBooksByISBN}
                      disabled={deleteISBN}>
                        {deleteISBN 
                        ? 
                        <span className="fa fa-spinner"></span>
                        :
                        <span className="fa fa-trash"></span>
                        }
                      </button>
                    )}
                  </div>
      )
}
