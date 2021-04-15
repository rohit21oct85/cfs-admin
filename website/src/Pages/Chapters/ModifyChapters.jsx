import React, {useContext,useState, useEffect} from 'react'
import '../mainDash.css';
import {  useHistory, Link, useParams  } from "react-router-dom";
import { Button,Form } from 'react-bootstrap'


import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {ErrorContext} from '../../context/ErrorContext';

import * as util from '../../utils/MakeSlug';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'
import useGetQuestion from '../../hooks/useGetQuestion';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-classic-with-mathtype';


export default function ModifyChapters() {
    const history = useHistory();
    const params = useParams();
    
    const {state} = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);

    const [loading, setLoading] = useState(false);
    
    let API_URL = '';
    if(process.env.NODE_ENV === 'development'){
        API_URL = cons.LOCAL_API_URL;
    }else{
        API_URL = cons.LIVE_API_URL;
    }
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    };
    const [btnDisabled, setBtnDisbaled] = useState(false);

    let _URL = window.URL || window.webkitURL;
    const [blogImage, setBlogImage] = useState("");
    const uploadImage = (e) => {
        e.preventDefault();
        var file, img, base64,blob, reader;
        if ((file = e.target.files[0])) {
            img = new Image();
            blob = new Blob([file],{ type: file.type })
            img.src = _URL.createObjectURL(blob);
            reader = new FileReader(); 
            reader.readAsDataURL(blob); 
            reader.onload = function () { 
               base64 = reader.result;
               setBlogImage(base64);
               setFormData({...formData,image: base64}) 
            }  
        }
    }
    const [formData, setFormData] = useState({});
    async  function handleSubmit(e){
        e.preventDefault();
        let response = null;
        setLoading(true);
        setBtnDisbaled(true);
        // console.log(formData); return;
        response = await axios.patch(`${API_URL}chapter/add-question/${params.q_id}`,formData, options);
        console.log(response);
        errorDispatch({type: 'SET_SUCCESS', payload: response.message});
        setBtnDisbaled(false);
        setLoading(false);

        history.push(`/book-chapters/${data && data.book_isbn}/${data && data.book_name}/${data && data._id}`);
    
    }
    const {data, isLoading} = useGetQuestion();
    
    useEffect( () => {
        let timerError = setTimeout(() => errorDispatch({type: 'SET_ERROR', payload: ''}), 1500);
        let timerSuccess = setTimeout(() => errorDispatch({type: 'SET_SUCCESS', payload: ''}), 1500);
        return () => {
            clearTimeout(timerError)
            clearTimeout(timerSuccess)
        }
    
    },[errorState.error, errorState.success]);
    
return (

    <>
    {state.isLoggedIn && (
      
    <div className="col-lg-10 col-md-10 main_dash_area">
        <div className="main-area-all">
            <div className="dashboard_main-container">
                <div className="dash-main-head">
                    <h2>Add Question</h2>
                </div>
                {errorState.error && ( 
                    <Notification>{errorState.error}</Notification>
                )}
                    
                {errorState.success && ( 
                    <Notification>{errorState.success}</Notification>
                )}
                <div className="dash-con-heading">
                    <div className="row">
                    <div className="col-md-1 pl-3">
                    
                    <Link to={`/book-chapters/${data && data.book_isbn}/${data && data.book_name}/${data && data._id}`} className="btn btn-sm dark">
                    <span className="fa fa-arrow-left"></span>
                    </Link>
                    </div>
                    </div>
                </div>
                <div className="dash-cont-start">
                    <div className="org-main-area">
                    <div className="col-md-12 row no-gutter p-0 mt-2">
                    {!isLoading && (
                    <Form method="POST" className="col-md-12 pl-2" encType="multipart/form-data">
                       
                    <Form.Group className="col-md-12">
                            <Form.Label>
                                Question
                            </Form.Label>
                            
                            {/* <CKEditor
                                editor={ ClassicEditor }
                                config={{
                                    toolbar: {
                                        items: [
                                            'MathType', 'ChemType','heading', 
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
                                data={data && data.question}
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFormData( { ...formData, question: data } );
                                } }
                            /> */}
                            
                        </Form.Group>
                        <Form.Group className="col-md-12">
                            <Form.Label>
                                Question Image
                            </Form.Label> 
                            <Form.Control name="image" type="file" 
                            onChange={uploadImage}
                            />  
                            <div style={{ height: '130px', overflow: 'hidden', marginTop: '10px' }}>
                                <img src={blogImage ? blogImage: data && data.image} />
                            </div>
                        </Form.Group>  
                        <Form.Group className="col-md-12">
                            <Form.Label>
                                Question Answer
                            </Form.Label>
                            
                            <CKEditor
                                editor={ ClassicEditor }
                                config={{
                                    toolbar: {
                                        items: [
                                            'MathType', 'ChemType','heading', 
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
                                data={data && data.answer}
                                onChange={ ( event, editor ) => {
                                    const data = editor.getData();
                                    setFormData( { ...formData, answer: data } );
                                } }
                            />
                            
                        </Form.Group>      
                        <Form.Group className="col-md-12">
                            <Button 
                            onClick={handleSubmit}
                            disabled={!loading && btnDisabled}
                            className="btn dark btn-md">
                                {loading ? 'processing...': 'Update Question'} 
                            </Button>
                        </Form.Group>
                        </Form>
                    )} 
                    
                     
                   
                    </div>    
                    
                    </div>
                </div>
            </div>
        </div>
        
    </div>
        
    )}  
    </>

)
}
