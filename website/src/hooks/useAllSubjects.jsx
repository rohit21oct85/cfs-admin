import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';

export default function useAllSubjects() {
    const response  = useQuery('Subjects', async () => {
        const result = await api.get('subject/all');
        return result.data.data; 
    });
    return response;
}
