import React,{useState,useEffect,useContext, useRef} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../context/AuthContext';

import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'

function AddQuestionForm({data}) {

    const history = useHistory();
    const params = useParams();
    const {state} = useContext(AuthContext);
    const [singleQuestion, setSingleQuestion] = useState({});
    useEffect( () => {
        const que = data.filter(que => que._id === params.question_id);
        setSingleQuestion(que[0]);
        var objDiv = document.getElementById("questionDiv");
        objDiv.scrollTop = objDiv.scrollHeight;
    },[
        params.question_id
    ])
    const [formData, setFormData] = useState({});
    
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
    const [loading, setLoading] = useState(false);
    
    const queryClient = useQueryClient()
    const queref = useRef(null);
    const ansref = useRef(null);

    const mutation = useMutation(formData => {
        formData['question_id'] = params.question_id
        formData['question'] = formData.question !== '' ? queref.current.value : formData.question
        formData['answer'] = formData.answer !== '' ? ansref.current.value : formData.answer
        return axios.post(`${API_URL}faq/add-question/${params.faq_id}`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('singlefaq')
            setLoading(false);
            queref.current.value = '';
            ansref.current.value = '';
            history.push(`/add-faq-question/${params.faq_category}/${params.faq_id}`);
            var objDiv = document.getElementById("questionDiv");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    })
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await mutation.mutate(formData);
    }

    return (
        <form>
            <h4>Add Faq Question - {params.faq_category}</h4>
            <hr />
            <div className="form-group">
                <label>
                    Question
                </label>
                <input 
                    type="text" name="question"
                    ref={queref}
                    defaultValue={singleQuestion && singleQuestion.question}
                    onChange={e=> setFormData({...formData, question: e.target.value})}
                    className="form-control" autoComplete="off"/>
            </div>
            
            <div className="form-group">
                <label>
                    Answer
                </label>
                <input 
                type="text" name="answer" 
                ref={ansref}
                defaultValue={singleQuestion && singleQuestion.answer}
                onChange={e=> setFormData({...formData, answer: e.target.value})}
                className="form-control" autoComplete="off"/>
            </div>

            
            <div className="form-group">
               {params.question_id ? (
                   <>
                   <button type="button" className="dark btn btn-md"
                   onClick={handleSubmit}
                   > 
                   {loading ? (
                        <><span className="fa fa-spinner"></span> Processing</>
                   ) : (
                       <><span className="fa fa-save"></span> Update Category</>
                   ) }
                   </button>
                   <button type="button" className="btn btn-danger ml-2"
                    onClick={e => history.push(`/add-faq-question/${params.faq_category}/${params.faq_id}`)}
                   >
                       Cancel
                   </button>
                   </>
               ) : (
                   <button type="button" className="dark btn btn-md"
                   onClick={handleSubmit}
                   > {loading ? (
                        <><span className="fa fa-spinner"></span> Processing</>
                   ) : (
                       <><span className="fa fa-save"></span> Save Category</>
                   ) }</button>
               )} 
               
            </div>

        </form>
    )
}

export default AddQuestionForm
