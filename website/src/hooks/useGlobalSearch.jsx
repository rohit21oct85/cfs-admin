import React  from 'react'
import {useQuery, queryCache} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

export default function useGlobalSearch(isbn) {
    
        return useQuery('books', async () => {
            if(isbn.length > 5){
                const result = await api.get(`book/search/${isbn}`);
                return result.data.data; 
            }
        });
    
    
}
