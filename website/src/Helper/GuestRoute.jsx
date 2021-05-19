import React,{useContext} from 'react';
import { Route, Redirect } from "react-router-dom"
import {AuthContext} from '../context/AuthContext.jsx';

const GuestRoute = ({ ...rest }) => {
    const {state} = useContext(AuthContext);
    return (
        <Route {...rest} render={props => (
            state.isLoggedIn ? <Redirect to={{ pathname: '/dashboard'}} /> : <Redirect to={{ pathname: '/' }} />
        )} />
    )
    
}

export default GuestRoute;