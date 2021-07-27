import { useContext } from 'react'
import {useLocation, useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import * as cons from '../../../Helper/Cons';

import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../context/AuthContext';

export default function useDeletePermission(formData) {
      const location = useLocation();
      const path  = location.pathname;
      const params = useParams();
      const history = useHistory();
      const queryClient = useQueryClient()
      const {state} = useContext(AuthContext);
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }   
      let API_URL = '';

      if(process.env.NODE_ENV === 'development'){
            API_URL = cons.LOCAL_API_URL;
      }else{
            API_URL = cons.LIVE_API_URL;
      }   
      const { addToast } = useToasts();
      const status =  useMutation((formData) => {
            return axios.post(`${API_URL}role-module/delete`,formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries(`roledmoules-${params?.role}-${params?.email}`)
            queryClient.invalidateQueries(`all-permissions-${params?.role}-${params?.email}`)
            history.push(`${path}`);
            addToast('Module deleted successfully', { appearance: 'success',autoDismiss: true });
        }
        });
      return status;
}
