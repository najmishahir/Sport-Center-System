import React, { useEffect, useContext, Fragment } from "react";
import axios from "axios";
import { Auth } from "../../../context/Auth";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import "./successpage.css";

function SuccessPage() {
  const { user } = useContext(Auth);
  const navigate = useNavigate();

  useEffect(() => {
    //New function to post the items from the basket into the booking database table upon  entry of this page.
    const createBooking = async () => {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/bookings/bookingid`,
          {
            customerId: user.details.customerId,
          }
        );

        // Check response status for success or adjust the condition accordingly
        if (response.status === 200) {
          alert("Booking completed!");
        } else {
          alert("Booking not complete");
        }
      } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred while completing the booking.");
      }
    };
    createBooking();
  }, []);

  const handleClick = () => {
    navigate("/");
  };

  return (
    <Fragment>
      <Navbar />
      <div className="success-page">
        <div className="successpage-container">
          <h1 className="success-heading">BOOKING SUCCESSFUL!</h1>
          <p className="success-text">Thank you for booking with us.</p>
          <button className="success-button" onClick={handleClick}>
            Back to home
          </button>
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

export default SuccessPage;
