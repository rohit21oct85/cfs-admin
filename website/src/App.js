import React from 'react'
import {
BrowserRouter as Router,
Switch,
Route,
} from "react-router-dom";
import Navigation from './components/Navigation.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

import PrivateRoute from './Helper/PrivateRoute.jsx';
import AdminRoute from './Helper/AdminRoute.jsx';
import GuestRoute from './Helper/GuestRoute.jsx';

import { guestRoutes, privateRoutes, adminRoutes } from './routes/index.jsx';

import AuthProvider from './context/AuthContext.jsx';
import AdminProvider from './context/AdminContext.jsx';
import SubjectProvider from './context/SubjectContext.jsx';
import ErrorProvider from './context/ErrorContext.jsx';
import { ToastProvider } from 'react-toast-notifications';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
function App() {
return (
<Router>
  <div className="wrapper">
    <div className="row no-gutters">
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <AdminProvider>
    <SubjectProvider>
    <ErrorProvider>
    <ToastProvider>
    <Navigation />
    <React.StrictMode>
    <Switch>
    {guestRoutes && guestRoutes.map((route => (
      <Route exact={true} key={route.path} path={route.path} component={route.component} />
    )))}

    {privateRoutes && privateRoutes.map((route => (
      <PrivateRoute exact={true} key={route.path} path={route.path} component={route.component} />
    )))}

    {adminRoutes && adminRoutes.map((route => (
      <AdminRoute exact={true} key={route.path} path={route.path} component={route.component} />
    )))}


    </Switch>
    </React.StrictMode>
    </ToastProvider>  
    </ErrorProvider> 
    </SubjectProvider> 
    </AdminProvider>  
    </AuthProvider>  
    </QueryClientProvider>
</div>
  </div>
</Router>


);
}

export default App;
