import React, { Fragment, useState, useEffect, useContext } from "react";
import "./pricing.css";
import Navbar from "../../navbar/Navbar";
import axios from "axios";
import { Auth } from "../../../context/Auth";
import useFetch from "../../../hooks/useFetch";
const url = "http://localhost:4000/api";


const PricingClass = () => {
    const [classData, setClassData] = useState([]);
    const [facilityData, setFacilityData] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const{user} = useContext(Auth);
    const {data:customerData} = useFetch ("http://localhost:4000/api/customer/");
    const selectedCustomer = (user && user.details && customerData.find((customer) => customer.customerId === user.details.customerId)) ?? {}
    useEffect(() => {
        async function fetchClassesData() {
            try {
                const res = await axios.get("http://localhost:4000/api/classes/");
                const groupedClasses = res.data.reduce((accumulator, classes) => {
                    const { classId, className, day, startTime, price } = classes;
                    if (accumulator[className]) {
                        accumulator[className].daysAndTimes.push({ day, startTime });
                    } else {
                        accumulator[className] = { classId, className, price, daysAndTimes: [{ day, startTime }] };
                    }
                    return accumulator;
                }, {});
                setClassData(Object.values(groupedClasses));
            } catch(err) {
                console.log(err.response.data);
            }
        }
        async function fetchFacilitiesData() {
            try {
                const res = await axios.get("http://localhost:4000/api/facilities/");
                setFacilityData(res.data);
            } catch(err) {
                console.log(err.response.data);
            }
        }
        async function fetchActivityData() {
            try {
                const res = await axios.get("http://localhost:4000/api/activities/");
                setActivityData(res.data);
            } catch(err) {
                console.log(err.response.data);
            }
        }
        fetchClassesData();
        fetchFacilitiesData();
        fetchActivityData();
    }, []);

    
    const handleClick = (membershipType) => async() => {
        // navigate('/MembershipCheckout')
        if(membershipType === "MONTHLY"){
        axios.post(`http://localhost:4000/api/stripe/membership-checkout-session`, {
            customerID: user.details.customerID,
            memberType: "MONTHLY",
        }).then((res) => {
            if(res.data.url){
                window.location.href = res.data.url
            }
        }).catch((err)=> console.log(err.message));
    }else if(membershipType === "ANNUAL"){
        axios.post(`http://localhost:4000/api/stripe/membership-checkout-session`, {
            customerID: user.details.customerID,
            memberType: "ANNUAL",
        }).then((res) => {
            if(res.data.url){
                window.location.href = res.data.url
            }
        }).catch((err)=> console.log(err.message));
    }
    }

    // Filter out the "Studio" facility
    const filteredFacilities = facilityData.filter(
        (facility) => facility.facilityName !== "Studio");

    return (
        <Fragment>
        <Navbar />
            <div className="pricing">
                <div className="pricing-container">
                    <div className="membership-container">
                        <h2 className="pricingTitle">GymCorp Membership</h2>
                        <p className="pricingHeader">Join GymCorp today and get full access to our facilities for a great value.</p>
                        <div className="grid-container">
                            <div className="grid-item">
                                <h3>Monthly</h3>
                                <p className="pricingPrice">£35.00</p>
                                {selectedCustomer.isMembership === false &&(<button className="join-button" onClick={handleClick("MONTHLY")}>Join Now</button>
                                )}
                            </div>
                            <div className="grid-item">
                                <h3>Annual</h3>
                                <p className="pricingPrice">£300.00</p>
                                {selectedCustomer.isMembership === false &&(<button className="join-button" onClick={handleClick("ANNUAL")}>Join Now</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="classes-container">
                    <h2 className="pricingTitle">Classes</h2>
                    <p className="pricingHeader">We hold our classes every week at the Studio.</p>
                    <div className="class-list">
                    {classData.map((classes) => (
                        <div key={classes.classId} className="class-item">
                        <h3>{classes.className}</h3>
                        {classes.daysAndTimes.map(({ day, startTime }) => {
                            const [hour, minute] = startTime.split(":")
                            const suffix = hour >= 12 ? 'PM' : 'AM';
                            const hour12 = hour % 12 || 12;
                            return (
                                <div key={`${day}-${startTime}`}>
                                <p>{day} at {hour12}:{minute} {suffix}</p>
                                </div>);
                        })}        
                        <p className="pricingPrice">£{classes.price}.00</p>        
                        </div>        
                    ))}            
                    </div>            
                </div>
                <div className="facility-container">
                    <h2 className="pricingTitle">Activities</h2>
                    <p className="pricingHeader">Check out all activities that we offer at each of our facilities.</p>
                    <div className="facility-list">
                    {filteredFacilities.map((facility) => (
                        <div key={facility.facilityName} className="facility-item">
                        <h3>{facility.facilityName}</h3>
                        <div>
                            {activityData
                            .filter((activity) => activity.facilityName === facility.facilityName)
                            .map((activity) => (
                                <p key={activity.activityId}>
                                {activity.activityName}:{" "}
                                <span className="facility-price">£{activity.price}.00</span>
                                </p>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>              
            </div>
        </Fragment>
    );
};

export default PricingClass

