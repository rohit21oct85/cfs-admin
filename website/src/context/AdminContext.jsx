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
        case 'GET_ALL_MODLISTS': 
            return {
                ...state,
                ModLists: action.payload
            }    
        case 'GET_REMOVE_ALL_DATA': 
            return {
                ...state,
                RemoveAllDatas: action.payload
            }       
        case 'GET_MODLIST': 
            return {
                ...state,
                ModList: action.payload
            }    
        case 'SET_USER': 
            return {
                ...state,
                user: action.payload
            }    
        case 'GET_ROLE':
            return {
                ...state,
                role: action.paylaod
            } 
        case 'GET_ALL_PERMISSION_GROUPS':
            return {
                ...state,
                permissionGroups: action.payload
            }  
        case 'SET_SELECTED_METHOD':{
            return {
                ...state,
                selected_methods: action.payload
            }
        }
        default:
            return state;
    }
}

function AdminProvider({children}){
    const [state, dispatch] = useReducer(reducer, {
        Admins: [],
        Roles: [],
        ModLists: [],
        RemoveAllDatas: [],
        permissionGroups: [],
        role: {
            id: '',
            name: '',
            description: '',
            role: ''
        },
        ModList: {
            id:'',
            module_name:'',
            description: ''
        },
        methods: [{name: 'create',value:'Create Module', checked: false},{name: 'update',value:'Update Module', checked: false},
            {name: 'delete',value:'Delete Module',checked: false},{name: 'view',value:'View Module',checked: false},
            {name: 'view-all',value:'View All Module',checked: false},{name: 'delete-all',value:'Delete All Module',checked: false},
            {name: 'upload',value:'Uplaod Module',checked: false}
        ],
        selected_methods: []
    });
    return (
        <AdminContext.Provider value={{ state, dispatch}}>
            {children}
        </AdminContext.Provider>
    );
}

export default AdminProvider;
