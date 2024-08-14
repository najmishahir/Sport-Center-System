import React,{Fragment, useState, useContext} from "react";
import "./managerLogin.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { Auth } from "../../../context/Auth";

const ManagerLogin = () => {

    const [credentials, setCredentials] = useState({
        staffEmail: "",
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
        const res = await axios.post("http://localhost:4000/auth/staff/login", credentials);
        console.log(res);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate('/employee-profile')
        
        dispatch({
            type: "SET_MANAGER",
            payload: res.data.isManager,
          });
        
          window.location.reload();

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
                        <span className="loginDesc">Have a great day at work!</span>
                    </div>
                    <div className="loginRight">
                        <div className="loginBox">
                            <span className="loginBoxDesc">Employee Login</span>
                            <input id="staffEmail" placeholder="Email" className="loginInput" onChange={handleChange}/>
                            <input id="password" type="password" placeholder="Password" className="loginInput" onChange={handleChange}/>
                            <button disabled={loading} onClick={handleClick} className="loginButton">Log In</button>
                            {error && <span className="loginErrorMsg">{error.message}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
export default ManagerLogin;