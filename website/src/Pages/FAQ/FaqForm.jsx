import React,{useState,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {useMutation, useQuery, QueryCache} from 'react-query'
import {AuthContext} from '../../context/AuthContext';

import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'

function FaqForm() {
    const history = useHistory();
    const {state} = useContext(AuthContext);

    let _URL = window.URL || window.webkitURL;
    const [image, setImage] = useState("");
    const [formData, setFormData] = useState({});
    
    const handleUpload = (e) => {
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
               setImage(base64);
               setFormData({...formData,faq_image: base64}) 
            }  
        }
    }
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
    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}faq/add-category`, formData, options)
    },{
        onSuccess: () => {
            setLoading(false);
            history.push(`/manage-faq`);
        }
    })
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await mutation.mutate(formData);
    }

    return (
        <form>
            <div className="form-group">
                <label>
                    Category Name
                </label>
                <input name="faq_category" onChange={e=> setFormData({...formData, faq_category: e.target.value})} className="form-control" autoComplete="off"/>
            </div>
            
            <div className="form-group">
                <label>
                    Category Image
                </label>
                <input 
                onChange={handleUpload}
                type="file" name="faq_image" className="form-control" autoComplete="off"/>
                <div style={{ height: '130px', overflow: 'hidden' }}>
                    <img src={image ? image : ''} />
                </div>
            </div>
            
            <div className="form-group">
               <button type="button" className="dark btn btn-md"
               onClick={handleSubmit}
               > {loading ? 'Processing...' : 'Save Category'}</button>
            </div>

        </form>
    )
}

export default FaqForm
