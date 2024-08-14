import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../../../context/Auth";
import {FaBars, FaTimes} from "react-icons/fa"

import "./manager-navbar.css";

const ManagerNavbar = () => {

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
    <nav className="managerNavbar">
      <Link to="/employee-profile" className="managerNavLogo">
        GymCorp
      </Link>
      <div className="managerNavLeft">
        <ul className={isBurgerNav ? "nav-links-burger" : "managerNavList"}
        onClick={() => setIsBurgerNav(false)}>
        {user.isManager &&
          <div className="managerNavDropdown managerNavItem">
            <Link to="/facilitydetails" className="managerNavDropdownTrigger managerNavLink" onClick={() => window.location.href="/facilitydetails"}>
              Amenities
            </Link>
            <ul className="managerNavDropdownList">
              <li className="managerNavItem" onClick={() => window.location.href="/facilitydetails"}>
                  Facilities
              </li>
              <li className="managerNavItem" onClick={() => window.location.href="/activitydetails"}>
                  Activities
              </li>
              <li className="managerNavItem" onClick={() => window.location.href="/classdetails"}>
                  Classes 
              </li>
            </ul>
          </div>
        }
        {user.isManager && 
          <li className="managerNavItem">
            <Link to="/staff" className="managerNavLink">
              Employees
            </Link>
          </li>
        }
        <li className="managerNavItem">
          <Link to="/membershipdetails" className="managerNavLink">
            Memberships
          </Link>
        </li>
        <li className="managerNavItem">
          <Link to="/bookingdetails" className="managerNavLink">
            Bookings
          </Link>
        </li>
        {user.isManager &&
          <li className="managerNavItem">
            <Link to="/statistics" className="managerNavLink">
              Statistics
            </Link>
          </li>
        }
        {user && 
          <li className="managerNavItem">
            <Link to="/employee-profile" className="managerNavLink" >
              Profile
            </Link>
          </li>
        }
        </ul>
      </div>
      <div className="managerNavRight">      
      {user && 
        <ul className="managerNavListLogout">
          <li className="managerNavItemLogout">
          <Link to="/" className="managerNavLink managerNavLogout" onClick={() => dispatch({ type: "LOGOUT" }) && window.location.reload()}>
            Logout
          </Link>
          </li>
        </ul>
      }
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

export default ManagerNavbar;
