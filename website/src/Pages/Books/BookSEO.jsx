import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory  } from "react-router-dom";
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import useBookSEO from '../../hooks/useBookSEO';
import useSingleBook from '../../hooks/useSingleBook';
import useTotalBookQuestion from '../../hooks/useTotalBookQuestion'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import * as utils from '../../utils/MakeSlug'

import FAQHeading from './FAQHeading'

import { useToasts } from 'react-toast-notifications';
import Seobradcrumb from './Seobradcrumb';

export default function BookSEO() {

const history = useHistory();
const params = useParams();
const { addToast } = useToasts();
const {state} = useContext(AuthContext);
const {data:book} = useSingleBook();
const {data:total} = useTotalBookQuestion();
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

const [formData, setFormData] = useState({});

const [error, setError] = useState();
const [loading, setLoading] = useState(false);

const queryClient = useQueryClient()

const urlsRef = useRef('');
const MetaTitleRef = useRef('');
const MetaDescriptionRef = useRef('');
const MetaKeywordsRef = useRef('');
const NoIndexRef = useRef('');
const DisplayTitleRef = useRef('');
const AuthorRef = useRef('');
const DescriptionRef = useRef('');
const AltImageRef = useRef('');

const mutation = useMutation(formData => {
        return axios.post(`${API_URL}books/add-seo`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('faqs')
        setLoading(false);
        history.push(`/book-seo/${params.isbn}/${params.book_id}`);
        addToast('FAQ`s added successfully', { appearance: 'success',autoDismiss: true });
    }
});


const handleSEO = async (e) => {
    e.preventDefault();
    if(MetaTitleRef.current.value === ''){
        addToast('Please enter question', { appearance: 'error',autoDismiss: true });
        MetaDescriptionRef.current.focus();
        return;
    }
    
    formData['book_id'] = params.book_id;
    formData['isbn'] = params.isbn;
    formData['MetaTitle'] = formData.MetaTitle !== '' ? MetaTitleRef.current.value : formData.MetaTitle
    formData['MetaDescription'] = formData.MetaDescription !== '' ? MetaDescriptionRef.current.value : formData.MetaDescription
    formData['MetaKeywords'] = formData.MetaKeywords !== '' ? MetaKeywordsRef.current.value : formData.MetaKeywords
    formData['urls'] = formData.urls !== '' ? urlsRef.current.value : formData.urls
    formData['NoIndex'] = formData.NoIndex !== '' ? NoIndexRef.current.value : formData.NoIndex
    formData['DisplayTitle'] = formData.DisplayTitle !== '' ? DisplayTitleRef.current.value : formData.DisplayTitle
    formData['Author2'] = formData.Author2 !== '' ? AuthorRef.current.value : formData.Author2
    formData['AltImage'] = formData.AltImage !== '' ? AltImageRef.current.value : formData.AltImage
    formData['Description'] = formData.Description !== '' ? DescriptionRef.current.value : formData.Description
    formData['status'] = true
    setLoading(true);
    console.log(formData);
    await mutation.mutate(formData);
}


useEffect(() => {
    let timerError = setTimeout(() => setError(''), 1500);
    return () => {
    clearTimeout(timerError)
}
}, [error]);


const backUrl = params?.faq_id 
        ? `/books/${book?.subject_name}/${book?.sub_subject_name}/${book?.sub_subject_id}`
        : `/books/${book?.subject_name}/${book?.sub_subject_name}/${book?.sub_subject_id}`;

return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
<div className="dashboard_main-container">
<div className="dash-main-head">
    <h2>Book Landing Page SEO</h2>
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
        <div className="row col-md-12">
            
            <div className="col-md-4">
                
                    <div className="form-group">
                        <label>urls</label>
                        <badge className="badge badge-success pull-right">{total?.count}</badge>
                        <input 
                            ref={urlsRef}
                            readonly
                            defaultValue={seo?.urls === '' ? seo?.urls : utils.MakeSlug(book?.BookName)}
                            onChange={e => setFormData({...formData, urls: e.target.value})}
                            className="form-control" autoComplete="off" placeholder="Enter urls"/>

                        <badge className="badge btn-block text-left badge-success pull-right mt-1"
                        style={{ fontStyle: 'normal'}}>{seo?.urls}</badge>
                    </div>
                    <div className="form-group">
                        <label>Meta Title</label>
                        <input 
                            ref={MetaTitleRef}
                            defaultValue={seo?.MetaTitle}
                            onChange={e => setFormData({...formData, MetaTitle: e.target.value})}
                            className="form-control" autoComplete="off" placeholder="Enter MetaTitle"/>
                    </div>
                    <div className="form-group">
                        <label>Meta Keywords</label>
                        <input 
                            ref={MetaKeywordsRef}
                            defaultValue={seo?.MetaKeywords}
                            onChange={e => setFormData({...formData, MetaKeywords: e.target.value})}
                            className="form-control" autoComplete="off" placeholder="Enter MetaKeywords"/>
                    </div>
                    <div className="form-group">
                        <label>Meta Description</label>
                        <input 
                            ref={MetaDescriptionRef}
                            defaultValue={seo?.MetaDescription}
                            onChange={e => setFormData({...formData, MetaDescription: e.target.value})}
                            className="form-control" autoComplete="off" placeholder="Enter MetaDescription"/>
                    </div>

                    <div className="form-group">
                        <label>No Index</label>
                        <select className="form-control"
                        ref={NoIndexRef}
                        onChange={e => setFormData({...formData, NoIndex: e.target.value})}
                        >
                            <option value="noindex" selected={total?.count === 0 ? 'selected':''}>No Index</option>
                            <option value="index" selected={total?.count > 0 ? 'selected':''}>Index</option>
                        </select>
                    </div>
                    
            </div>
            <div className="col-md-4">
                <div className="form-group">
                    <label>Display Title</label>
                    <input 
                        ref={DisplayTitleRef}
                        defaultValue={seo?.DisplayTitle}
                        onChange={e => setFormData({...formData, DisplayTitle: e.target.value})}
                        className="form-control" autoComplete="off" placeholder="Enter DisplayTitle"/>
                </div>
                <div className="form-group">
                    <label>Author 2</label>
                    <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    ref={AuthorRef}
                    defaultValue={seo?.Author2}
                    placeholder="Enter Author Name"
                    onChange={e => setFormData({...formData, Author2: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Alt Image</label>
                    <input
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    ref={AltImageRef}
                    defaultValue={seo?.AltImage}
                    placeholder="Enter Alt Image Name"
                    onChange={e => setFormData({...formData, AltImage: e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        type="text"
                        autoComplete="off"
                        className="form-control"
                        ref={DescriptionRef}
                        defaultValue={seo?.Description}
                        style={{ height: '125px' }}
                        onChange={e => setFormData({...formData, Description: e.target.value})}
                    />
                </div>
                
            </div>
            <div className="col-md-4">
                <label htmlFor="">Similar Books</label>   
            </div>
            
        
        </div>
        <hr />
        <div className="form-group col-md-6">
            <button className="btn btn-md text-success block dark" onClick={handleSEO}>
            {loading ? (
                <><span className="fa fa-spinner"></span> Processing</>
            ):(
                <><span className="fa fa-save"></span> Save SEO</> 
            )}
            </button>
            {params && params.book_id && (
                <button 
                className="btn btn-md pull-right dark text-success"
                onClick={e => history.push(backUrl)}
                > <span className="fa fa-times"></span> Cancel </button>
            )}        
            
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
