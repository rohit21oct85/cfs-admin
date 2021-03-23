import React, {useContext} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import useAllSubSubjects from '../../hooks/useAllSubSubjects';
import * as util from '../../utils/MakeSlug';
import {AdminContext} from '../../context/AdminContext';

function CategoryBook() {
    const history = useHistory();
    const {dispatch} = useContext(AdminContext);
    const params = useParams();
    const {data} = useAllSubSubjects();
    return (
        <div style={{ width: '220px' }} className="mr-1">
            <select 
            className="form-control" 
            name="category"
            onChange={e=>{
                if(e.target.value === "1"){
                    history.push(`/books`)    
                }else{
                    const data = util.getAllValue(e.target.value)
                    window.localStorage.setItem('pageno',1)
                    dispatch({type: 'Book_CurrentPage',payload: 1});
                    history.push(`/books/${data.value2}/${data.value}/${data.id}`)
                }
            }}
            >
                <option value="1">Subject</option>
                {data && data.map(subcat => {
                return (
                    <option
                    value={`${subcat._id}-${subcat.sub_subject}-${subcat.subject}`}
                    selected={(params.sub_subject_id === subcat._id) ? 'selected':''}
                    >{subcat.sub_subject}</option>
                )   
                })}
            </select>
        </div>
    )
}

export default CategoryBook
