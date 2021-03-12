import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';


export default function useAllSubSubjects() {
    const response  = useQuery('SubSubjects', async () => {
        const result = await api.get('sub-subject/all');
        return result.data.data; 
    });
    return response;
}
