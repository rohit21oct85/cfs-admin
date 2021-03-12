import React  from 'react'
import {useQuery, queryCache} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

export default function useBooks() {
    return useQuery('books', async () => {
        const result = await api.get('books/view-all');
        return result.data.data; 
    });
    
}
