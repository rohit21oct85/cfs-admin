import Login from '../Pages/Login.jsx'
import NotAuthorized from '../Pages/NotAuthorized.jsx'
import Dashboard from '../Pages/Dashboard.jsx'
import MyProfile from '../Pages/MyProfile.jsx'
import SubjectList from '../Pages/subject/SubjectList.jsx';
import CreateSubject from '../Pages/subject/CreateSubject.jsx';
import SubSubjectList from '../Pages/subject/SubSubjectList.jsx';
import CreateSubSubject from '../Pages/subject/CreateSubSubject.jsx';
import AllSubSubjectList from '../Pages/subject/AllSubSubjectList.jsx';
import AllBookList from '../Pages/books/AllBookList.jsx';

import DeleteData from '../Pages/DeleteData.jsx';
import ViewData from '../Pages/ViewData.jsx';

import AdminList from '../Pages/Admin/AdminList.jsx';
import CreateAdmin from '../Pages/Admin/CreateAdmin.jsx';
import RoleList from '../Pages/Role/RoleList.jsx';
import CreateRole from '../Pages/Role/CreateRole.jsx';
import ModuleList from '../Pages/Module/ModuleList.jsx';
import CreateModule from '../Pages/Module/CreateModule.jsx';
import CreateModulePassword from '../Pages/Module/CreateModulePassword.jsx';
import PermissionGroupList from '../Pages/PermissionGroup/PermissionGroupList.jsx';
import RolePermissionList from '../Pages/Permission/RolePermissionList.jsx';
import UserPermissionList from '../Pages/Permission/UserPermissionList.jsx';

export const guestRoutes =  [
    { 
        path:'/',
        component: Login
    },
    {
        path:'/login',
        component: Login
    },
    
    {
        path:'/403',
        component: NotAuthorized
    }

];

export const privateRoutes = [
    {
        path: '/dashboard',
        component: Dashboard
    },
    {
        path: '/my-profile',
        component: MyProfile
    },
    {
        path: '/subject',
        component: SubjectList
    },
    {
        path: '/subject-create',
        component: CreateSubject
    },
    {
        path: '/subject-update/:id',
        component: CreateSubject
    },
    {
        path: '/sub-subject/:subject_name/:subject_id',
        component: SubSubjectList
    },
    {
        path: '/sub-subject/:subject_name/create/:subject_id',
        component: CreateSubSubject
    },
    {
        path: '/sub-subject',
        component: AllSubSubjectList
    },
    {
        path: '/sub-subject/create',
        component: CreateSubSubject
    },
    {
        path: '/delete-data/:module/:method/:id',
        component: DeleteData
    },
    {
        path: '/view-data/:module/:rmodule/:method/:id',
        component: ViewData
    },
    {
        path: '/books',
        component: AllBookList
    }

    
];

export const adminRoutes = [
    {
        path: '/master-admin',
        component: AdminList
    },
    {
        path: '/master-admin/create',
        component: CreateAdmin
    },
    
    {
        path: '/master-admin/update/:id',
        component: CreateAdmin
    },

    {
        path: '/master-role',
        component: RoleList
    },    
    
    {
        path: '/master-module',
        component: ModuleList
    }, 
    {
        path: '/master-module/create',
        component: CreateModule
    }, 
    {
        path: '/master-module/update/:id',
        component: CreateModule
    }, 
    
    {
        path: '/master-module/password/:module_name/:module_id',
        component: CreateModulePassword
    },
     
    {
        path: '/master-module/password/:module_name/:module_id/:module_method/:id',
        component: CreateModulePassword
    },

    {
        path: '/master-role/create',
        component: CreateRole
    },

    {
        path: '/master-role/update/:id',
        component: CreateRole
    },
    
    {
        path: '/master-permission-group',
        component: PermissionGroupList
    },
        
    {
        path: '/master-permission-group/:module_name/update/:id',
        component: PermissionGroupList
    },

    {
        path: '/role-permission',
        component: RolePermissionList
    },
    
    {
        path: '/user-permission',
        component: UserPermissionList
    }

]