import React , {useState, useEffect,useRef, useContext} from 'react';
import { NavLink, useHistory } from 'react-router-dom'
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import * as api from '../Helper/ApiHelper.jsx';
import {AuthContext} from '../context/AuthContext.jsx';

import './login.css';

export default function Login() {
    const history = useHistory();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(null);

    const {state,dispatch } = useContext(AuthContext);
    
    const submitForm = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if(email === ''){
            setError("Please enter email address");
            return false;
        }else if(password === ''){
            setError("Please enter password");
            return false;
        }else{
            const formData = {email: emailRef.current.value , password: passwordRef.current.value};
            const response = await api.post('admin/login', formData);

            let access_token = response.data.accessToken
            let refresh_token = response.data.refreshToken
            let fullname = response.data.admin.fullname
            let email = response.data.admin.email
            let role = response.data.admin.role
            let created_at = response.data.admin.created_at
            
            let isLoggedIn = true;
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('fullname', fullname);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
            localStorage.setItem('created_at', created_at);
            localStorage.setItem('isLoggedIn', isLoggedIn);
            const payloadData = {
                isLoggedIn,
                fullname,
                email,
                role,
                created_at,
                access_token,
                refresh_token
            }
            if(isLoggedIn){
                dispatch({type: 'LOGIN', payload: payloadData});
                // window.location.href = '/dashboard';
                history.push('/dashboard');
            }
        }   
    }

    useEffect( () => {
        let timer1 = setTimeout(() => setError(null), 2500);
        return () => {
        clearTimeout(timer1)
        }
    },[error]);

    return (
        <div className="container-fluid p-0 m-0 text-center LoginBg">
            <NavLink to="/">
                <img className="logo" src="/logo.png" />
            </NavLink>
            <div className="row no-gutter mt-5">
                <div className="col-md-6 offset-1">
                    <img src="/bg_img.jpeg" style={{ width: '100%' }} />
                </div>
                <div className="col-md-3 card pl-3 pr-3 pt-5 pb-5">
                <h4>Login </h4>    
                {error && (<p style={{ color: 'red' }}>{error}</p>)} 
                <hr />
                <Form autoComplete="new-password" onSubmit={submitForm}>
                    <Form.Group controlId="formBasicEmail" className="text-left">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" autoComplete="nope" ref={emailRef} placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword"  className="text-left">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" autoComplete="nope" ref={passwordRef} placeholder="Password" />
                    </Form.Group>
                    <Button 
                        className="btn btn-md btn-block dark mt-3" 
                        type="submit"
                    >
                        Login
                    </Button>
                    </Form>
                    <div className="col-md-12 text-center mt-3">
                        Forgot Password ?
                        <NavLink 
                            className="ml-2"
                            to='/forgot-password'
                        >change password</NavLink>
                    </div>
                </div>
            </div>
            
        </div>
    )
}
 