import React, { Fragment, useState } from "react";
import "./managerProfile.css";
import { Link } from "react-router-dom";
import ManagerProfileInfo from "./managerProfileInfo";
import Navbar from "../../managerPages/managerNavbar/ManagerNavbar"

const ManagerProfile = () => {
    const [bookings, setBookings] = useState([
        { id: 1, facility: "Sports Hall", classes: "Volleyball" },
        { id: 2, facility: "Swimming Pool", classes: "Lap Swim" },
        { id: 3, facility: "Gym", classes: "Weights"}
    ]);

    return (
        <Fragment>
            <Navbar/>
            <div className="manager-profile">
                <div className="managerProfileWrapper">
                    < ManagerProfileInfo/>
                    {/* <div className="managerProfileRight">
                        <span className="userBookingsTitle">Usage and Sales</span>
                        <div className="userBookingsTable">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Facilities</th>
                                        <th>Classes</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td>{booking.facility}</td>
                                            <td>{booking.classes}</td>
                                            <td>{booking.time}</td>
                                            <td>{booking.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div> */}
                </div>
            </div>
        </Fragment>
     );
};

export default ManagerProfile;