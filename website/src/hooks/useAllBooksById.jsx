import React  from 'react'
import {useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

export default function useAllBooksById() {
    const params = useParams();
    const sub_subject_id = params.sub_subject_id;
    const response  = useQuery('booksbyid', async () => {
        const result = await api.get(`books/subject/${sub_subject_id}`);
        return result.data.data; 
    });
    console.log(response);
    return response;
}
