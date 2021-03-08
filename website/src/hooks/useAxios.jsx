import {useEffect, useState, useContext} from 'react'
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import {ErrorContext} from '../context/ErrorContext';

export default function useAxios({method, url, data = null}) {
    
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {state } = useContext(AuthContext);
    const {state: errorState, dispatch: errorDispatch} = useContext(ErrorContext);

    if(process.env.NODE_ENV === 'development'){
        var API_URL = 'http://localhost:8080/api/v1/';
    }else{
        var API_URL = 'https://cfs-admin.herokuapp.com/api/v1/';
    }
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+ state.access_token
        }
    });
    

    useEffect( () => {
        const fetchData = async () => {
            try {
                const splitUrl = url.split('/');
                var lastItem = splitUrl.pop();
                if(lastItem !== 'undefined'){
                    setIsLoading(true);
                    await api[method](url, JSON.parse(data))
                        .then( res => {
                            setResponse(res.data);
                        }).finally( () => {
                            setIsLoading(false);
                        })
                }
                
            } catch (error) {
                errorDispatch({type: 'SET_ERROR', payload: error.message});
            }
        }
        return fetchData();
    },[method, url, data]);

    return {response, isLoading};
}
