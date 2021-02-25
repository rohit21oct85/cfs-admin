import React, {createContext, useReducer} from 'react'
export const AdminContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'GET_ALL_ADMIN':
            return {
                ...state,
                Admins: action.payload
            }
            
        case 'GET_ALL_ROLE':
            return {
                ...state,
                Roles: action.payload
            }
        case 'GET_ROLE':
            return {
                ...state,
                role: action.paylaod
            }    
        default:
            return state;
    }
}

function AdminProvider({children}){
    const [state, dispatch] = useReducer(reducer, {
        Admins: [],
        Roles: [],
        role: {
            id: '',
            name: '',
            description: '',
            role: ''
        }
    });
    return (
        <AdminContext.Provider value={{ state, dispatch}}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminProvider;
