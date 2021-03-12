import {  useParams  } from "react-router-dom";
import {useQuery} from 'react-query';
import * as api from '../Helper/ApiHelper.jsx';


export default function useGetSubSubjects() {
    const params = useParams();
    const subject_id = params.subject_id;
    const response  = useQuery(['SubSubjects', subject_id], async () => {
        const result = await api.get(`sub-subject/subject/${subject_id}`);
        return result.data.data; 
    });
    return response;
}
