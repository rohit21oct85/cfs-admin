import React  from 'react'
import {useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

export default function useBook() {
    const params = useParams();
    const sub_subject_id = params.sub_subject_id;
    const response  = useQuery(['books',sub_subject_id], async () => {
        const result = await api.get(`books/subject/${sub_subject_id}`);
        return result.data.data; 
    });
    return response;
}
