import React, { Fragment, useState, useEffect } from "react";
import "./bookfacility.css";
import Basket from "../../basket/Basket";
import FacilityItem from "../../facilityItem/FacilityItem";
import Navbar from "../../navbar/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

  
const BookFacility = () => {

  const [facilities, setFacilities] = useState([]);
  const navigate =useNavigate();
  
  const handleClick = (facility) =>{
    navigate('/FacilityPage', { state: {facility} });
  }

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/facilities/");
        setFacilities(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFacilities();
  }, []);
    
  // Filter out the "Studio" facility
  const filteredFacilities = facilities.filter(
    (facility) => facility.facilityName !== "Studio"
  );

  return (
    <Fragment>
    <Navbar />
      <div className="bookFacilities">
        <div className="facWrapper">
          <div className="facilities">
            <div className="bookFacilityDescription">
              <h3>Book a facility</h3>
              <p>Select a facility to view timetables and availability.</p>
            </div>
            <div className="gridFormat">
            {filteredFacilities.map((facility) => (
              <div className="griddy" key={facility.facilityName} onClick={() => handleClick(facility)}>
                <FacilityItem facility={facility} />
              </div>
            ))}
          </div>
          </div>
          <Basket/>
        </div>
      </div>
    </Fragment>
  );
};
export default BookFacility;