
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import * as cons from "../../../../Helper/Cons";

import {useParams} from 'react-router-dom'

export default function useOldBookQuestions() {
    const {state } = useContext(AuthContext);
    const params = useParams();

    let API_URL = "";
      if (process.env.NODE_ENV === "development") {
            API_URL = cons.LOCAL_API_URL;
      } else {
            API_URL = cons.LIVE_API_URL;
      }
      let chapter_no;
      if(params?.section_id?.includes('oldbook')){
            chapter_no = params?.section_id.split('-')[0];
      }else{
            chapter_no = 0;
      }
    
      let key = '';
      key = `old-questions-${params?.isbn}`;
    
    return useQuery(`${key}`, async () => {
        if(
            state.access_token && 
            params?.isbn 
        ){
            const result = await axios.get(`${API_URL}chapter/oldbook-questions/${params?.isbn}/${chapter_no}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        
            
        }
    });
    
}
