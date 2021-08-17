import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from "../../../../Helper/Cons";
import { useToasts } from 'react-toast-notifications';

import {AuthContext} from '../../../../context/AuthContext';

export default function useImportChapter() {
      const queryClient = useQueryClient()
      const {state} = useContext(AuthContext);
      const params = useParams();
      const location = useLocation();
      const path = location.pathname;
      const history = useHistory();
      let API_URL = "";
      if (process.env.NODE_ENV === "development") {
            API_URL = cons.LOCAL_API_URL;
      } else {
            API_URL = cons.LIVE_API_URL;
      }
      
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }      
      const { addToast } = useToasts();
      
      const key = `chapters-${params?.isbn}`;
    
      return useMutation(formData => {
            return axios.post(`${API_URL}chapter/quizlet-import-chapters`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
                localStorage.removeItem('chapters');
                history.push(`/books-freelance/${params?.solution_type}/${params?.isbn}/get-chapter`);
                addToast('Chapters added successfully', { appearance: 'success', autoDismiss: true });
                
            }
        });
      
}
