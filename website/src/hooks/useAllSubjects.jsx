import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

const fetchAllSubjects = async () => {
    const result = await api.get('subject/all');
    return result.data.data; 
}

export default function useAllSubjects() {
    const response  = useQuery('Subjects', fetchAllSubjects);
    return response;
}
