import React , {useState, useEffect,useRef, useContext} from 'react';
import { NavLink, useHistory } from 'react-router-dom'
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import * as api from '../Helper/ApiHelper.jsx';
import {AuthContext} from '../context/AuthContext.jsx';
import {AdminContext} from '../context/AdminContext.jsx';
import useAxios from '../hooks/useAxios';

import axios from 'axios';
import * as cons from '../Helper/Cons'

import './login.css';

export default function Login() {
    const history = useHistory();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState(null);
    const { dispatch:adminDispatch } = useContext(AdminContext);
    const {state,dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
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
            setLoading(true);
            const formData = {email: emailRef.current.value , password: passwordRef.current.value};
            const response = await api.post('admin/login', formData);
            // console.log(response)
            if(response.response && response.response.status){
                setError("Email or password not matched");
                setLoading(false);
            }else{
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
                    
                    history.push('/dashboard');
                }
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
            <div className="row no-gutter">
                <div className="col-md-3 loginDiv">
                    
                <h4>Administrator Login </h4>    
                {error && (<p style={{ color: 'red', margin: '0px' }}>{error}</p>)} 
                <hr />
                <Form autoComplete="new-password" onSubmit={submitForm}>
                    <Form.Group controlId="formBasicEmail" className="text-left">
                        <Form.Label><span className="fa fa-envelope text-success"></span> Email address</Form.Label>
                        <Form.Control type="email" autoComplete="Off" ref={emailRef} placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword"  className="text-left">
                        <Form.Label><span className="fa fa-key text-success"></span> Password</Form.Label>
                        <div style={{ position: 'relative'}}>
                            <Form.Control type="password" autoComplete="Off" id="pwd" ref={passwordRef} placeholder="Password" />
                            <span className="fa fa-eye text-success"
                            onClick={e=>{ e.preventDefault(); document.getElementById("pwd").style.type = 'text' }}
                            style={{ position: 'absolute', right: '-10px', top: '12px', display: 'block', width: '40px', cursor: 'pointer'}}></span>
                        </div>
                    </Form.Group>
                    <Button 
                        className="btn btn-md btn-block dark mt-3" 
                        type="submit"
                        style={{ width: '100%'}}
                    >
                        <span className="fa fa-lock mr-2 p-2"></span>
                        {loading ? 'Authenticating...':'Login Account'}
                    </Button>
                    </Form>
                </div>
            </div>
            
        </div>
    )
}
 