import React,{Fragment, useState} from "react";
import "./register.css";
import { Link} from "react-router-dom";
import axios from "axios";


const Register = () => {
    const [credentials, setCredentials] = useState({
        name: "",
        number: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
    
      const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
      };
    
      const handleClick = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (credentials.password !== credentials.confirmPassword) {
          setError("Passwords do not match");
          return;
        }
        try {
          const res = await axios.post( "http://localhost:4000/api/auth/register", credentials);
          console.log(res);
          setSuccess(res.data.message);
          // Redirect to login page or show success message
        } catch (err) {
          console.log(err.response.data);
          setError(err.response.data.message);
        }
      };
      
    return (
        <Fragment>
        <div className="register">
            <div className="registerWrapper">
                <div className="registerLeft">
                    <h3 className="registerLogo">GymCorp</h3>
                    <span className="registerDesc">Log in or register and start booking with GymCorp!</span>
                </div>
                <div className="registerRight">
                    <div className="registerBox">
                        <span className="registerBoxDesc">Create an account</span>
                        <input id="name" placeholder="Name" required value={credentials.name} onChange={handleChange} className="registerInput"/>
                        <input id="number" placeholder="Number" required value={credentials.number} onChange={handleChange} className="registerInput"/>
                        <input id="email" type="email" placeholder="Email" required value={credentials.email} onChange={handleChange} className="registerInput"/>
                        <input id="password" type="password" placeholder="Password" required value={credentials.password} onChange={handleChange}className="registerInput"/>
                        <input id="confirmPassword" type="password" placeholder="Retype your password" required value={credentials.confirmPassword} onChange={handleChange} className="registerInput"/>
                        <button className="registerButton" type="submit" onClick={handleClick}>Sign Up</button>
                        {error && <span className="registerErrorMsg">{error}</span>}
                        {success && <span className="registerSuccessMsg">{success}</span>}
                        <Link to="/login" className="registerLoginButton">
                            <button className="buttonInLink">Login</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </Fragment>
    );
};
export default Register;

