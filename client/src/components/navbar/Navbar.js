import React, { useContext,useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../../context/Auth";
import {FaBars, FaTimes} from "react-icons/fa"

import "./navbar.css";

const Navbar = () => {
  const { dispatch } = useContext(Auth);
  const {user} = useContext(Auth);
  const [isBurgerNav, setIsBurgerNav] = useState(false);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsBurgerNav(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navLogo">
          GymCorp
      </Link>
      <div className="navLeft">
        <ul className={isBurgerNav ? "nav-links-burger" : "navList"}
        onClick={() => setIsBurgerNav(false)}>
          <li className="navItem">
            <Link to="/" className="navLink">
              Home
            </Link>
          </li>
          <li className="navItem">
            <Link to="/book-facility" className="navLink">
              Facility
            </Link>
          </li>
          <li className="navItem">
            <Link to="/book-class" className="navLink">
              Classes
            </Link>
          </li>
          <li className="navItem">
            <Link to="/pricing" className="navLink">
              Pricing
            </Link>
          </li>
          {user && 
          <li className="navItem">
            <Link to="/profile" className="navLink" onClick={() => window.location.href="/profile"}>
              Profile
            </Link>
          </li>
          }
          {user ? (
            <li className="navItem">
              <Link to="/" className="navLink navLogout" onClick={() => dispatch({ type: "LOGOUT" })}>
                Logout
              </Link>
            </li>
          ):(
          <div className="navDropdown navItem ">
            <Link to="/login" className="navDropdownTrigger navLink" onClick={() => window.location.href="/login"}>
              Login
            </Link>
            <ul className="navDropdownList">
              <li className="navItem" onClick={() => window.location.href="/login"}>
                  User
              </li>
              <li className="navItem" onClick={() => window.location.href="/manager-login"}>
                  Employee
              </li>
            </ul>
          </div>
          )}
        </ul>
      </div>
    
      <div className="navRight">
      </div>
      <button className="burger-menu-icon"
      onClick={() => setIsBurgerNav(!isBurgerNav) }>
        {
          isBurgerNav ? (
            <FaTimes/>
          ):(
            <FaBars/>
          )
        }
      </button>
      
    </nav>
  );
};

export default Navbar;
