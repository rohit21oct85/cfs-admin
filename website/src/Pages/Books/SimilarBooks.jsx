import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory  } from "react-router-dom";
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import useBookSEO from '../../hooks/useBookSEO';
import useSingleBook from '../../hooks/useSingleBook';
import useAllBooks from '../../hooks/useAllBooks';
import useSimilarBooks from '../../hooks/useSimilarBooks';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import * as utils from '../../utils/MakeSlug'

import { useToasts } from 'react-toast-notifications';
import Seobradcrumb from './Seobradcrumb';
import BookImage from './BookImage';
export default function SimilarBooks() {
    

const history = useHistory();
const params = useParams();
const { addToast } = useToasts();
const {state} = useContext(AuthContext);
const {data:book} = useSingleBook();

const {data:AllBooks} = useAllBooks(book?.sub_subject_name);
const {data:similarBooks} = useSimilarBooks();
const {data:seo, isLoading} = useBookSEO();

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

const [error, setError] = useState();
const [loading, setLoading] = useState(false);

const queryClient = useQueryClient()


const mutation = useMutation(formData => {
        return axios.post(`${API_URL}books/add-similar-books`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('similarbooks')
        setLoading(false);
        history.push(`/book-similar-books/${params.isbn}/${params.book_id}`);
        setFormData([]);
        setSelectedBooks([]);
        setUpdateBooks([]);
        setUpdateSBook(false);
        addToast('Similar Book`s added successfully', { appearance: 'success',autoDismiss: true });
    }
});
const [formData, setFormData] = useState([]);

const handleSEO = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    
}
const [SelectedBooks,setSelectedBooks] = useState([]);

const handleAllBooks = async (id) => {
    setUpdateSBook(false);
    let Books = await AllBooks.filter( book => book._id === id);
    setSelectedBooks([Books[0]]);
}
const [updateSBook, setUpdateSBook] = useState(false);
const [updateBooks, setUpdateBooks] = useState([])
const handleSimilarBooks = async (id) => {
    setUpdateSBook(true);
    let Books = await similarBooks.filter( book => book._id === id);
    setUpdateBooks(Books)
    // setSelectedBooks([Books[0]]);
}

const handleDisplayTitle = async (book_id, book_isbn,edition) => {
    let id = book_id;
    let div = document.getElementById(`display-title-${id}`).value
    if(div !== ""){
        document.getElementById(`DisplayTitle-${id}`).innerHTML = div
        document.getElementById(`display-title-${id}`).value = '';   
        let array = [];
        const booksData = {
            ISBN13: book_isbn, 
            BookId: book_id,
            Edition: edition,  
            DisplayTitle: div, 
            AltImage: div
        }
        array.push(booksData)
        let SData = {similarBooks: array, book_id: params?.book_id, book_isbn: params?.isbn}
        setTimeout(async () => {
            await mutation.mutate(SData); 
            document.getElementById(id).style.display = 'none'
        }, 1000);
    }
}
const handleUpdateTitle = async (id, book_id, book_isbn, edition) => {
    
    let div = document.getElementById(`display-title-${id}`).value
    if(div !== ""){
        document.getElementById(`DisplayTitle-${id}`).innerHTML = div
        document.getElementById(`Title-${id}`).innerHTML = div
        document.getElementById(`display-title-${id}`).value = '';   
        const booksData = {
            DisplayTitle: div, 
            AltImage: div
        }
        let SData = {similarBooks: booksData, id, book_id: params?.book_id, book_isbn: params?.isbn}
        setTimeout(async () => {
            await mutation.mutate(SData); 
            
            // document.getElementById(id).style.display = 'none'
        }, 1000);
    }
}



const backUrl = params?.book_id 
        ? `/book-similar-books/${params?.isbn}/${params?.book_id}`
        : `/books/${book?.subject_name}/${book?.sub_subject_name}/${book?.sub_subject_id}`;

return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
<div className="dashboard_main-container">
<div className="dash-main-head">
    <h2>Similar Books - ISBN13: {params?.isbn}</h2>
</div>
{error && <Notification>{error.message}</Notification>}
{isLoading && <LoadingComp />}

<div className="dash-con-heading">
    <div className="col-md-12 row">
        <Seobradcrumb />
    </div>    
</div>
{!isLoading && (
<div className="dash-cont-start">
    <div className="pl-0 pt-0 pr-0 pb-0">    
        <form>
        <div className="row col-md-12 pl-0 pr-0">
            <div className="col-md-4 pr-0">
                <p><b> All Books</b></p>
                <hr className="mt-1 mb-2"/>
                <div className="col-md-12 pl-0" style={{ height: '450px', overflowY: 'scroll'}}>
                {AllBooks?.map(books => {
                    return (
                    <div className="card mb-1" style={{ cursor: 'pointer'}}
                    key={books?._id}
                    id={books?._id}
                    onClick={handleAllBooks.bind(this, books?._id)}>
                        <div className="row col-md-12">
                            <div className="col-md-3 p-1">
                                <BookImage isbn={books?.ISBN13}  width="100%"/>
                            </div>
                            <div className="col-md-9 pl-1">
                                <div className="col-md-12 pl-0 pr-0">
                                    <b>Title:  </b>{utils.GetString(books?.BookName,50)}
                                </div>
                                <div className="col-md-12 pl-0 pr-0">
                                    <b>ISBN13:  </b>{books?.ISBN13}
                                </div>
                                <div className="col-md-12 pl-0 pr-0">
                                    <b>Edition:  </b>{books?.Edition}
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    )
                })}
                </div>
            </div>
            {!updateSBook && SelectedBooks.length > 0 && (
                <div className="col-md-4 pl-1 pr-0">
                <p>Selected Books: </p>
                <hr className="mt-1 mb-1"/>
                <div className="col-md-12 pr-0 pl-0" style={{ height: '450px', overflowY: 'scroll'}}>
                {SelectedBooks?.map(book => {
                    return (
                    <div className="card mb-1" style={{ cursor: 'pointer'}}
                        key={book?._id}
                        >
                        <div className="row col-md-12">   
                        <div className="col-md-3 p-1">
                            <BookImage isbn={book?.ISBN13}  width="100%"/>
                        </div>
                        <div className="col-md-9 pl-1 pr-0">
                            <div className="col-md-12 pl-0 pr-0">
                                    <b>Title:  </b>
                                    <span id={`Title-${book?._id}`}>{book?.BookName}</span>
                                </div>
                                <div className="col-md-12 pl-0 pr-0">
                                <b>ISBN13:  </b>{book?.ISBN13}
                            </div>
                                <div className="col-md-12 pl-0 pr-0">
                                <b>Edition:  </b>{book?.Edition}
                            </div>
                            <div className="col-md-12 pl-0 pr-0">
                                <b>Display Title:  </b>
                                <span id={`DisplayTitle-${book?._id}`}>{book?.DisplayTitle}</span>
                            </div>
                       </div>
                       </div>
                        
                        
                        <hr className="mt-2 mb-2"/>
                        <div className="row col-md-12 pr-0" style={{ display: 'flex', flexDirection: 'space-between'}}>
                            <div className="col-md-10 pl-0 pr-0">
                                <input type="text" id={`display-title-${book?._id}`} autoComplete="off" className="form-control" placeholder="enter display title"/>   
                            </div>
                            <div className="col-md-2 pr-0" style={{ display: 'flex', flexDirection: 'space-between'}}>
                                <button type="button" onClick={handleDisplayTitle.bind(this, book?._id, book?.ISBN13,book?.Edition)} className="fa fa-save dark btn btn-sm"></button>
                                <button type="button"
                                onClick={e => { 
                                    setFormData([]);
                                    setSelectedBooks([]);
                                    setUpdateSBook(false);
                                 }} className="fa fa-times dark btn btn-sm ml-1"></button>
                            </div>
                        </div>
                    </div>
                    )
                })}

                </div>
            </div>
            
            )}

            {updateSBook && (
               <div className="col-md-4 pl-1 pr-0">
               <p>Update Books: </p>
               <hr className="mt-1 mb-1"/>
               <div className="col-md-12 pr-0 pl-0" style={{ height: '450px', overflowY: 'scroll'}}>
               {updateBooks?.map(book => {
                   return (
                   <div className="card mb-1" style={{ cursor: 'pointer'}}
                       key={book?._id}
                       >
                        <div className="row col-md-12">   
                        <div className="col-md-3 p-1">
                            <BookImage isbn={book?.ISBN13}  width="100%"/>
                        </div>
                        <div className="col-md-9 pl-1 pr-0">
                            <div className="col-md-12 pl-0 pr-0">
                                    <b>Title:  </b>
                                    <span id={`Title-${book?._id}`}>{book?.DisplayTitle}</span>
                                </div>
                                <div className="col-md-12 pl-0 pr-0">
                                <b>ISBN13:  </b>{book?.ISBN13}
                            </div>
                                <div className="col-md-12 pl-0 pr-0">
                                <b>Edition:  </b>{book?.Edition}
                            </div>
                            <div className="col-md-12 pl-0 pr-0">
                                <b>Display Title:  </b>
                                <span id={`DisplayTitle-${book?._id}`}>{book?.DisplayTitle}</span>
                            </div>
                       </div>
                       </div>

                       <hr className="mt-2 mb-2"/>
                       <div className="row col-md-12 pr-0" style={{ display: 'flex', flexDirection: 'space-between'}}>
                           <div className="col-md-10 pl-0 pr-0">
                               <input type="text" id={`display-title-${book?._id}`} autoComplete="off" className="form-control" placeholder="enter display title"/>   
                           </div>
                           <div className="col-md-2 pr-0" style={{ display: 'flex', flexDirection: 'space-between'}}>
                               <button type="button" onClick={handleUpdateTitle.bind(this, book?._id,book?.BookId, book?.ISBN13, book?.Edition)} className="fa fa-save dark btn btn-sm"></button>
                               <button type="button" onClick={e => { 
                                    setFormData([]);
                                    setSelectedBooks([]);
                                    setUpdateBooks([]);
                                    setUpdateSBook(false);
                                 }} className="fa fa-times dark btn btn-sm ml-1"></button>
                           </div>
                       </div>
                   </div>
                   )
               })}

               </div>
           </div> 
            )}
            
            <div className="col-md-4 pl-1 pr-0">
                <p><b> Similar Books</b></p>
                <hr className="mt-1 mb-2"/>
                <div className="col-md-12 pl-0 pr-0" style={{ height: '450px', overflowY: 'scroll', overflowX: 'hidden'}}>
                {similarBooks?.map(sbooks => {
                    return (
                    <div className="card mr-0 mb-1" style={{ cursor: 'pointer'}}
                    key={sbooks?._id}
                    id={sbooks?._id}
                    onClick={handleSimilarBooks.bind(this, sbooks?._id)}
                    >
                        <div className="row col-md-12">
                            <div className="col-md-3 p-1">
                                <BookImage isbn={sbooks?.ISBN13}  width="100%"/>
                            </div>
                            <div className="col-md-9 pl-1">
                                <div className="col-md-12 pl-0 pr-0">
                                    <b>ISBN13:  </b>{sbooks?.ISBN13}
                                </div>
                                <div className="col-md-12 pl-0 pr-0">
                                    <b>Edition:  </b>{sbooks?.Edition}
                                </div>
                                
                                <div className="col-md-12 pl-0 pr-0">
                                    <b>Display Title:  </b>{sbooks?.DisplayTitle}
                                </div>

                            </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>
            
        
        </div>
        
        </form>
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
