import React  from 'react'
import {useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

export default function useChapters() {
    const params = useParams();
    const isbn = params.isbn;
    const response  = useQuery(['chapters',isbn], async () => {
        const result = await api.get(`chapter/questions/${isbn}`);
        return result.data; 
    });
    return response;
}
