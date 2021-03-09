import React  from 'react'
import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

export default function useAllBooks() {
    const response  = useQuery('books', async () => {
        const result = await api.get('books/view-all');
        return result.data.data; 
    });
    
    return response;
}
