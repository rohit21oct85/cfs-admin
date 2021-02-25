import React,{createContext, useReducer} from 'react';

export const ErrorContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            }
            
        case 'SET_SUCCESS':
            return {
                ...state,
                success: action.payload
            }
        default:
            return state;
    }
}

function ErrorProvider({children}){
    const [state, dispatch] = useReducer(reducer, {
        error: null
    });
    return (
        <ErrorContext.Provider value={{ state, dispatch}}>
            {children}
        </ErrorContext.Provider>
    );
}

export default ErrorProvider;
