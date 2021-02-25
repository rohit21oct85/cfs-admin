import React, {createContext, useReducer} from 'react'
export const SubjectContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'GET_ALL_SUBJECT':
            return {
                ...state,
                Subjects: action.payload
            }
            
        case 'GET_ALL_SUB_SUBJECT':
            return {
                ...state,
                SubSubjects: action.payload
            }

        case 'SET_SUBJECT':
            return {
                ...state,
                singleSubject: action.payload
            }    
        default:
            return state;
    }
}

function SubjectProvider({children}){
    const [state, dispatch] = useReducer(reducer, {
        Subjects: [],
        SubSubjects: [],
        singleSubject: null
    });
    return (
        <SubjectContext.Provider value={{ state, dispatch}}>
            {children}
        </SubjectContext.Provider>
    );
}

export default SubjectProvider;
