import {useEffect, useState, useContext} from 'react'
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';

export default function useAxios({method, url, data = null}) {
    
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {state } = useContext(AuthContext);
    
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
    const fetchData = async () => {
        try {
            setIsLoading(true);
            await api[method](url, JSON.parse(data))
                    .then( res => {
                        setResponse(res.data);
                    }).finally( () => {
                        setIsLoading(false);
                    })
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect( () => {
        fetchData();
    },[method, url, data]);

    return {response, error, isLoading};
}
