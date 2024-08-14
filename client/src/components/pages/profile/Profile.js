import React,{Fragment, useState, useEffect, useContext} from "react";
import "./profile.css";
import { Link } from "react-router-dom";
import ProfileInfo from "../../profileInfo/ProfileInfo";
import {Auth} from "../../../context/Auth"
import axios from "axios";
import Navbar from "../../navbar/Navbar";


const MemberProfile = () => {

    const {user} = useContext(Auth);
    const [bookings, setBookings] = useState([]);
    const [activityNames, setActivityNames] = useState([]);
    const [classNames, setClassNames] = useState([]);


    //get bookings 
    useEffect(() => {
        async function fetchUserBooking() {
          try{
                const res = await axios.get("http://localhost:4000/api/bookings/bookings/"+ user.details.customerId);
                setBookings(res.data);
                // console.log("bookings",bookings[0]);
                console.log(res.data);
          }
          catch(err){
              console.log(err.response.data);
          }
        }
        fetchUserBooking();
    }, [user.details.customerId]);

    //get booking activity inspired by gpt
    useEffect(() => {
        async function fetchBookingActivity() {
            try{
                //maps each arr in bookings and gets the activity name
                const activityName = bookings.map(async booking => {
                    if (booking.activityId !== null){
                        const res = await axios.get("http://localhost:4000/api/activities/find/"+booking.activityId);
                        return res.data.activityName;
                    }
                });
                //array of activity names. Promise.all resolves each promise (name of each booking)
                const activityNames = await Promise.all(activityName);
                setActivityNames(activityNames);
            }
            catch(err){
                console.log(err.response.data);
            }
        } 
        if (bookings.length > 0) {
            fetchBookingActivity();
        }
    }, [bookings]);

    //get booking class
    useEffect(() => {
        async function fetchBookingClass() {
            try{
                //maps each arr in bookings and gets the class name
                const className = bookings.map(async booking => {
                    if (booking.classId !== null) {
                        const res = await axios.get("http://localhost:4000/api/classes/find/"+booking.classId);
                        console.log("testres",res.data.className);
                        return res.data.className;
                    }
                });
                //array of activity names. Promise.all resolves each promise (name of each booking)
                const classNames = await Promise.all(className);
                setClassNames(classNames);
            }
            catch(err){
                console.log(err.response.data);
            }
        } 
        if (bookings.length > 0) {
            fetchBookingClass();
        }
    }, [bookings]);

    //delete booking
    const handleDelete = async (bookingId) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
        try {
            await axios.delete("http://localhost:4000/api/bookings/"+ bookingId);
            const newBookings = bookings.filter(booking => booking.bookingId !== bookingId);
            setBookings(newBookings);
          // Redirect to login page or show success message
        } catch (err) {
          console.log(err.response.data);
        }
        }
      };

    return (
        <Fragment>
        <Navbar />
            <div className="profile">
                <div className="profileWrapper">
                    <ProfileInfo />
                    <div className="profileRight">
                        <span className="userBookingsTitle">Your bookings</span>
                        <div className="userBookingsTable">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Facility</th>
                                        <th>Class/Activity</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking, index) => (
                                        <tr key={booking.bookingId}>
                                        <td>{booking.facilityName}</td>
                                        <td>{activityNames[index] || classNames[index]}</td>
                                        <td>{booking.date.split("T")[0]}</td>
                                        <td>{booking.startTime.substring(0,5)}</td>
                                        <td><button className="profileDeleteBookingBtn" onClick={() => handleDelete(booking.bookingId)}>Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
     );
};

export default MemberProfile;