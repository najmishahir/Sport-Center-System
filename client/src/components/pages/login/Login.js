import React,{Fragment, useState, useContext} from "react";
import "./login.css";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { Auth } from "../../../context/Auth";

const Login = () => {

    const [credentials, setCredentials] = useState({
        customerEmail: "",
        password: "",
    });

    const {loading, error, dispatch } = useContext(Auth);
    
    const navigate = useNavigate()

    const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post("http://localhost:4000/api/auth/login", credentials);
        console.log(res);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate('/')
    } catch (err) {
        console.log(err.response.data);
        dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
    };


    return (
        <Fragment>
            <div className="login">
                <div className="loginWrapper">
                    <div className="loginLeft">
                        <h3 className="loginLogo">GymCorp</h3>
                        <span className="loginDesc">Log in or register and start booking with GymCorp!</span>
                    </div>
                    <div className="loginRight">
                        <div className="loginBox">
                            <span className="loginBoxDesc">Login</span>
                            <input id="customerEmail" placeholder="Email" className="loginInput" onChange={handleChange}/>
                            <input id="password" type="password" placeholder="Password" className="loginInput" onChange={handleChange}/>
                            <button disabled={loading} onClick={handleClick} className="loginButton">Log In</button>
                            {error && <span className="loginErrorMsg">{error.message}</span>}
                            <Link to="/register" className="loginRegisterLink">
                                <button className="buttonInLink">Create a New Account</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
export default Login;