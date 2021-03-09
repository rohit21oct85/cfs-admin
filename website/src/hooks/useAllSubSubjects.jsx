import React  from 'react'
import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

const fetchAllSubSubjects = async () => {
    const result = await api.get('sub-subject/all');
    return result.data.data; 
}

export default function useAllSubSubjects() {
    const response  = useQuery('subSubjects', fetchAllSubSubjects);
    return response;
}
