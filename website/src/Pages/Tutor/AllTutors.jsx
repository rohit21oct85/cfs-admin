import React, {useContext, useRef, useState} from 'react'
import '../mainDash.css';
import {  useHistory , useParams , Link} from "react-router-dom";
import { Button } from 'react-bootstrap'

import {AuthContext} from '../../context/AuthContext';
import {Notification} from '../../components/Notification';
import {LoadingComp} from '../../components/LoadingComp';

import useTutor from '../../hooks/useTutor';
import SingleTutor from './SingleTutor';
import Pagination from '../../components/Pagination';
import * as util from '../../utils/MakeSlug';
import useAllSubSubjects from '../../hooks/useAllSubSubjects';
import axios from 'axios'
import * as cons from '../../Helper/Cons.jsx'

import { useToasts } from 'react-toast-notifications';


export default function AllTutors() {
    const { addToast } = useToasts();    
    const history = useHistory();
    const params = useParams();
    const statusRef = useRef();
    const subRef = useRef();
    const typeRef = useRef();
    const {state} = useContext(AuthContext);
    const {data, isLoading, error} = useTutor();
    const {data: allSubjects} = useAllSubSubjects();
    const [uploadForm, setUploadForm] = useState(false);
    const [btnDisabled, setBtnDisbaled] = useState(true)
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const formDataUpload = new FormData();
    const handelChangeUpload = async (e) => {
        const filename = e.target.files[0].name;
        const ext = filename.split('.')[1];
        if(ext === "csv"){
            setBtnDisbaled(false);
            setFile(e.target.files[0]);
            formDataUpload.append('file', e.target.files[0]);
        }else{
            setBtnDisbaled(true);
            addToast('Only .csv files are allowed', { appearance: 'error',autoDismiss: true });
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        let response = null;
        formDataUpload.append('file',  file);
        setLoading(true);
        setBtnDisbaled(true);
        response = await axios.post(`${API_URL}tutor/upload`,formDataUpload, options);
        if(response.status === 200){
            setLoading(false)
            setUploadForm(false)
            history.push(`/all-tutors`);
        }else{
            setBtnDisbaled(false);
            setLoading(false);
            addToast(response.message, { appearance: 'success',autoDismiss: true });
            history.push(`/all-tutors`);
        }
    }
return (
<>
{state.isLoggedIn && (
<div className="col-lg-10 col-md-10 main_dash_area">
<div className="main-area-all">
    <div className="dashboard_main-container">
        <div className="dash-main-head">
            <h2 style={{ textTransform : 'capitalize' }}>All Tutors </h2>
        </div>
        {error && <Notification>{error.message}</Notification>}
        {isLoading && <LoadingComp />}

        <div className="dash-con-heading">
            <div className="row pl-3" style={{ display: 'flex', flexContent: 'space-between' }}>
                <button className="btn btn-sm dark mr-2"
                    onClick={e => setUploadForm(!uploadForm)}
                >
                    <span className="fa fa-upload"></span>
                    &nbsp; Upload Tutor
                </button>
                <select className="mr-2"
                ref={typeRef}
                onChange={e => {
                    history.push(`/all-tutors/${statusRef.current.value}/${subRef.current.value}/${e.target.value}`)
                }}>
                    <option value="all" selected={(params?.type === 'all') ? 'selected':''}>All</option>
                    <option value="freelance" selected={(params?.type === 'freelance') ? 'selected':''}>Freelance</option>
                    <option value="cfs" selected={(params?.type === 'cfs') ? 'selected':''}>CFS</option>
                </select>
                <select 
                    ref={subRef}
                    className="mr-2" 
                    name="category"
                    onChange={e => {
                        history.push(`/all-tutors/${statusRef.current.value}/${e.target.value}/${typeRef.current.value}`)
                    }}
                >
                    <option value="all">All</option>
                    {allSubjects?.map(subcat => {
                    return (
                        <option
                        key={subcat._id}
                        value={`${subcat.sub_subject}`}
                        selected={(params.master_subject == subcat.sub_subject) ? 'selected':''}
                        >{subcat.sub_subject}</option>
                    )   
                    })}
                </select>
                <select className="col-md-1 mr-1"
                ref={statusRef}
                onChange={e => history.push(`/all-tutors/${e.target.value}/${subRef.current.value}/${typeRef.current.value}`)}
                >
                    <option value="all">All</option>
                    <option value="1" selected={(params.status === "1") ? 'selected':''}>Active</option>
                    <option value="0" selected={(params.status === "0") ? 'selected':''}>Blocked</option>
                </select>

                <Pagination pagination={data?.pagination}/>
            </div>    
        </div>
        {!isLoading && (
        <div className="dash-cont-start">
        <div className="subject-main-container">  
        {uploadForm && (
        <div className="col-md-3 p-2 card">
           <form encType="multipart/form-data">
               <div className="form-data">
                <label>Upload Tutor</label>
                <input type="file" className="form-control"
                onChange={handelChangeUpload} 
                onKeyDown={ 
                    event => {
                        if(event.key === 'Enter'){
                            event.preventDefault()
                        }
                    }
                }/>
               </div>
                
               <div className="form-data mt-2">
                <button className="btn btn-sm dark btn-full"
                onClick={handleSubmit}
                disabled={loading && btnDisabled}
                > 
                {loading ? (
                    <><span className="fa fa-spinner"></span> uploading.... </>    
                ): (
                    <><span className="fa fa-upload"></span> upload data</>    
                    )} 
                </button>
                <button className="btn btn-sm my-btn btn-danger ml-1"
                onClick={e => {
                    setLoading(false)
                    setUploadForm(false)
                }}>
                    <span className="fa fa-times"></span>
                </button>
               </div>

           </form> 
        </div>
        )}
        <div className={uploadForm ? 'row col-md-9':'row col-md-12'}>
        {data?.data?.map(tutor => <SingleTutor tutor={tutor} key={tutor._id}/> )}
        {data?.pagination?.itemCount === 0 && (
            <div className="col-md-6 text-center offset-3">
                <h1 style={{ fontSize: '2.5em',color:'#000',marginTop:'30vh',padding:'25px',background: 'yellow' }}>No Tutor Registered <br /> 
                With {params?.master_subject} In {params?.type} <br />
                </h1>    
            </div>
        )}  
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
