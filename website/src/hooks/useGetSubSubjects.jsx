import {  useParams  } from "react-router-dom";
import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';


export default function useGetSubSubjects() {
    const params = useParams();
    const response  = useQuery('SubSubjectsBySubject', async () => {
        const result = await api.get(`sub-subject/subject/${params.subject_id}`);
        return result.data.data; 
    });
    return response;
}
