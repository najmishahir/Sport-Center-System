import React,{Fragment, useEffect, useState} from "react";
import "./bookclasses.css";
import Basket from "../../basket/Basket";
import ClassItem from "../../classItem/ClassItem";
import Navbar from '../../navbar/Navbar';
import axios from "axios"
import { useNavigate } from "react-router-dom";
  
const BookClasses = () => {
  const [classes, setClasses] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const navigate =useNavigate();
  const handleClick = () =>{
    navigate('/FacilityPage', {state: {facility: studioFacilities}});
  }


  useEffect(() => {
  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/classes/");
      const uniqueClasses = Array.from(new Set(res.data.map(c => c.className))).map(cn => {
        return res.data.find(c => c.className === cn);
      });
      setClasses(uniqueClasses);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchFacilities = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/facilities/");
      setFacilities(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchFacilities();
  fetchClasses();
}, []);

//Filter to get "Studio" Facility
const studioFacilities = facilities.find(
  (facility) => facility.facilityName === "Studio"
);

   return (
    <Fragment>
    <Navbar/>
      <div className="bookClasses">
        <div className="classWrapper">
          <div className="classes">
            <div className="bookClassesDescription">
              <h3>Book a class</h3>
              <p>Select a class to view timetables and availability.</p>
            </div>
            <div className="gridFormat">
            {classes.map((classItem) => (
            <div key={classItem.className} className="griddy" onClick={handleClick}>
              <ClassItem classes={classItem} />
            </div>
              ))}
            </div>
          </div>
          <Basket />
        </div>
      </div>
    </Fragment>
  )
};
export default BookClasses;
