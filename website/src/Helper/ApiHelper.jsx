import React, {useContext} from 'react';

import axios from 'axios';
import * as cons from './Cons.jsx'

const access_token = localStorage.getItem('access_token');

let API_URL = '';
if(process.env.NODE_ENV === 'development'){
    API_URL = cons.LOCAL_API_URL;
}else{
    API_URL = cons.LIVE_API_URL;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'Application/json',
        'Authorization':'Bearer '+access_token
    }
});
export async function get(url){
    const response = await api.get(url);
    return response;
}

export async function post(url, payload){
    try {
        const response = await api.post(url, payload);
        return response;    
    } catch (error) {
        return error;
    }
    
}

export async function patch(url, payload){
    const response = await api.patch(url, payload);
    return response;
}

export async function del(url, payload){
    const response = await api.delete(url, payload);
    return response;
}
