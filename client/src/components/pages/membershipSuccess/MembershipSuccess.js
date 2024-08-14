import React, { useEffect, useContext, Fragment } from "react";
import axios from "axios";
import { Auth } from "../../../context/Auth";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import "../success/successpage.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function MembershipSuccess() {
  const { user } = useContext(Auth);
  const navigate = useNavigate();
  const query = useQuery();
  const membershipType = query.get("membershipType");
  const location = useLocation();

  useEffect(() => {
    //Searching through the URL for the success
    const searchParameter = new URLSearchParams(location.search);
    const success = searchParameter.get("success");

    if (!success) {
      navigate("/pricing");
    }
    //Function to post the membership details into the membership database table
    const createMembership = async () => {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/membership/buy/${user.details.customerId}`,
          {
            customerId: user.details.customerId,
            membershipType: membershipType,
          }
        );

        console.log("Response data:", response.data);

        // Check response status for success or adjust the condition accordingly
        if (response.status === 200) {
          console.log("Membership created successfully");
          alert("Congratulations on becoming a member!");
        } else {
          console.log("Failed to create membership");
          alert("Membership sign Up unsuccessful!");
        }
      } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred while signing up for membership.");
      }
    };

    createMembership();
  }, []);

  return (
    <Fragment>
      <Navbar />
      <div>
        <div className="success-page">
          <div className="successpage-container">
            <h1 className="success-heading">MEMBERSHIP SIGNUP SUCCESSFUL</h1>
            <p className="success-text">
              Congratulations,{" "}
              {user && user.details && user.details.customerName}! You have
              successfully signed up for a {membershipType} membership.
            </p>
            <button className="success-button" onClick={() => {navigate("/");}}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
      <div className="footer-container">
        <div className="footer-item">
          <h2 style={{ color: "#fa991c" }}>CONTACT US</h2>
          <ul>
            <li>Phone: (123) 456-7890</li>
            <li>Email: info@gymcorp.com</li>
          </ul>
        </div>
        <div className="footer-item">
          <h2 style={{ color: "#fa991c" }}>OPENING TIMES</h2>
          <ul>
            <li>8:00am - 10:00pm</li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default MembershipSuccess;
