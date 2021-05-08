import React, {useContext, useState, useEffect, useRef} from 'react'
import '../mainDash.css';
import {  useParams, Link, useHistory  } from "react-router-dom";
import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';
import useBookFaq from '../../hooks/useBookFaq';
import useSingleBook from '../../hooks/useSingleBook';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import Rating from 'react-rating';
import FAQHeading from './FAQHeading'
import { useToasts } from 'react-toast-notifications';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-classic-with-mathtype';
import Seobradcrumb from './Seobradcrumb';

export default function BookFaqQuestion() {

const history = useHistory();
const params = useParams();
const { addToast } = useToasts();
const {state} = useContext(AuthContext);
const {data:book} = useSingleBook();
const {data, isLoading} = useBookFaq();

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
const questionRef = useRef('');
const answerRef = useRef('');

const mutation = useMutation(formData => {
        return axios.post(`${API_URL}books/add-faq`, formData, options)
    },{
    onSuccess: () => {
        queryClient.invalidateQueries('faqs')
        setLoading(false);
        questionRef.current.value = '';
        answerRef.current.value = '';
        history.push(`/book-faq/${params.isbn}/${params.book_id}`);
        var objDiv = document.getElementById("faqDiv");
        objDiv.scrollTop = 0;
        addToast('FAQ`s added successfully', { appearance: 'success',autoDismiss: true });
    }
});


const handleFaq = async (e) => {
    e.preventDefault();
    if(questionRef.current.value === ''){
        addToast('Please enter question', { appearance: 'error',autoDismiss: true });
        questionRef.current.focus();
        return;
    }
    formData['book_id'] = params.book_id;
    formData['isbn'] = params.isbn;
    formData['faq_id'] = params.faq_id;
    formData['question'] = formData.question !== '' ? questionRef.current.value : formData.question
    formData['answer'] = formData.answer !== '' ? answerRef.current.value : formData.answer
    
    formData['stats'] = true
    setLoading(true);
    await mutation.mutate(formData);
}


useEffect(() => {
    let timerError = setTimeout(() => setError(''), 1500);
    return () => {
    clearTimeout(timerError)
}
}, [error]);
const [singleFaq, setSingleFaq] = useState({question: '',answer:''});
useEffect(filterFaq,[data])
async function filterFaq(){
    const faqs = data?.data;
    let faq_single = faqs?.filter( faq => faq?._id === params?.faq_id); 
    setSingleFaq(faq_single && faq_single[0]);
    return singleFaq;
}

const backUrl = params?.faq_id 
        ? `/book-faq/${book?.subject_name}/${book?.sub_subject_name}/${book?.sub_subject_id}`
        : `/book-seo/${params?.isbn}/${params?.book_id}`;

return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
<div className="dashboard_main-container">
<div className="dash-main-head">
    <h2>Books Frquently Asked Question - ISBN13: {params?.isbn}</h2>
</div>
{error && <Notification>{error.message}</Notification>}
{isLoading && <LoadingComp />}

<div className="dash-con-heading">
    <div className="col-md-12 row">
        <div className="p-0">
            <Seobradcrumb />
        </div>
    </div>    
</div>
{!isLoading && (
<div className="dash-cont-start">
    <div className="subject-main-container pl-0 pt-0 pr-0 pb-0">    
        <div className="row col-md-12">
            <div className="col-md-4">
                <h6> <span className="fa fa-star"></span> Manage Faq`s</h6>
                <hr />
                <form>
                
                    <div className="form-group">
                        <label>Question</label>
                        <input 
                            ref={questionRef}
                            defaultValue={singleFaq?.question}
                            onChange={e => setFormData({...formData, question: e.target.value})}
                            className="form-control" autoComplete="off" placeholder="Enter question"/>
                    </div>
                    
                    <div className="form-group">
                        <label>Answers</label>
                        {/* <textarea
                            ref={answerRef}
                            className="form-control" 
                            defaultValue={singleFaq?.answer}
                            onChange={e => setFormData({...formData, answer: e.target.value})}
                            style={{  height: '150px'}}></textarea> */}
                        <CKEditor
                                editor={ ClassicEditor }
                                config={{
                                    toolbar: {
                                        items: [
                                            'heading', 
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            'imageUpload',
                                            'mediaEmbed',
                                            'insertTable',
                                            'blockQuote',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                }}
                                data={singleFaq?.answer ? singleFaq?.answer : 'Enter Answer'}
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFormData( { ...formData, answer: data } );
                                } }
                            />    
                    </div>
                    
                    <div className="form-group">
                        
                        <button className="btn btn-md text-success block dark" onClick={handleFaq}>
                        {loading ? (
                            <><span className="fa fa-spinner"></span> Processing</>
                        ):(
                            <><span className="fa fa-save"></span> Save FAQ</> 
                        )}
                        </button>
                    
                        {params && params.faq_id && (
                            <button 
                            className="btn btn-md pull-right dark text-success"
                            onClick={e => history.push(backUrl)}
                            > <span className="fa fa-times"></span> Cancel </button>
                        )}        
                        
                    </div>

                </form>
            </div>
            <div className="col-md-7 offset-1">
                <h6> <span className="fa fa-star"></span> 
                {data?.data?.length ? data?.data?.length : 'All ' } FAQ`s for - ISBN <b>{params?.isbn}</b></h6>
                <hr />
                <div style={{ height: '420px', overflowY: 'scroll', paddingRight: '15px'}} id="faqDiv">
                    
                    {data?.data?.map(faq => {
                        return (
                            <div className="subject-card"
                            style={{width: '100%'}}
                            key={faq._id}>
                                
                                <div className="subject-card-body">
                                    
                                    <div className=""> 
                                        <div className="">
                                            <span className="fa fa-user fa-1x mr-2 pt-1"></span> 
                                            &nbsp; Question: 
                                        </div>
                                        <div className="text-danger">
                                            {faq?.question}
                                        </div>
                                    </div> 
                                    <hr className="mb-1 mt-1"/>
                                    <div className=""> 
                                        <div className="">
                                            <span className="fa fa-comments fa-1x mr-2 pt-1"></span> 
                                            &nbsp; Answer: 
                                        </div>
                                        <div className="clearfix"></div>
                                        <div className="text-justify text-info">
                                            {faq?.answer?.substr(0,80) + '...'}
                                        </div>
                                    </div> 
                                    

                                </div> 
                                <hr className="mt-1 mb-2"/>
                                <FAQHeading faq={faq} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
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
