import React,{Fragment, useState, useEffect, useContext} from "react";
import "./profileInfo.css";
import {Auth} from "../../context/Auth"
// import {Link} from "react-router-dom";
import axios from "axios";

export default function MemberProfileInfo() {
    
    const {user} = useContext(Auth);
    // State: Edit mode for update profile
    const [isEditMode, setIsEditMode] = useState(false);
        
    //keeps track of whether changes made

    const handleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const [customerName, setCustomerName] = useState(user.details.customerName);
    const [customerNumber, setCustomerNumber] = useState(user.details.customerNumber);
    const [customerEmail, setCustomerEmail] = useState(user.details.customerEmail);
    const [password, setPassword] = useState(user.details.password);
    const [confirmPassword, setConfirmPassword] = useState("")

    const [updatedCustomerName, setUpdatedCustomerName] = useState(user.details.customerName);
    const [updatedCustomerNumber, setUpdatedCustomerNumber] = useState(user.details.customerNumber);
    const [updatedCustomerEmail, setUpdatedCustomerEmail] = useState(user.details.customerEmail);

    const [error, setError] = useState("");


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsEditMode(false);
        if ((password || confirmPassword) && (confirmPassword !== password)) {
            setError("Passwords do not match");
            setIsEditMode(true);
        }

        if (customerNumber.length !== 11) {
            setError("Phone number should be 11 digits long");
            setIsEditMode(true);
            return;
        }


        //Updates customerName, customerNumber, customerEmail
        try {
            const res = await axios.put("http://localhost:4000/api/customer/"+ user.details.customerId,{
                customerName,
                customerNumber,
                customerEmail,
            }); 
            setUpdatedCustomerName(res.data.customerName);
            setUpdatedCustomerNumber(res.data.customerNumber);
            setUpdatedCustomerEmail(res.data.customerEmail);
            localStorage.setItem("user", JSON.stringify({...user, details:
                {
                    "createdAt" : res.data.createdAt,
                    "customerEmail" : res.data.customerEmail,
                    "customerId":res.data.customerId,
                    "customerName": res.data.customerName,
                    "customerNumber":res.data.customerNumber,
                    "isMembership":res.data.isMembership,
                    "membershipType":res.data.membershipType,
                    "updatedAt":res.data.updatedAt,
                }
            })); 
        } 
        catch (err) {
            console.log(err.response.data);
        }

        //Updates password
        try {
            await axios.put("http://localhost:4000/api/customer/change-password/"+user.details.customerId, 
                {password}
            );  
        } catch (err) {
            console.log(err.response.data);
        }
    };

    const [membershipType, setMembershipType] = useState("NULL");
    const [membershipStartDate, setMembershipStartDate] = useState("NULL");
    const [membershipEndDate, setMembershipEndDate] = useState("NULL");

    useEffect(() => {
      async function fetchMembershipDetails() {
        try{
            const res = await axios.get("http://localhost:4000/api/membership/membership-info/"+user.details.customerId);
            setMembershipType(res.data.membership.membershipType);
            setMembershipStartDate(res.data.membership.startDate.split("T")[0]);
            setMembershipEndDate(res.data.membership.endDate.split("T")[0]);
        }
        catch(err){
            console.log(err.response.data);
        }
      }
      fetchMembershipDetails();
    }, [user.details.customerId],membershipType);

    const cancelMembership = async () => {
        if (window.confirm("Are you sure you want to cancel membership?")) {
            try {
                await axios.post("http://localhost:4000/api/membership/cancel/"+ user.details.customerId);
            } catch (err) {
                console.log(err.response.data);
            }
        }
    };


    return (
        <Fragment>
                <div className="editInfo">
                    <form className="userDetailsForm" onSubmit={handleFormSubmit}>
                        <span className="editInfoTitle">Update Info</span>
                        <div className="userDetails"> 
                            <label>Name</label>
                            {isEditMode ? ( <input type="text" defaultValue={updatedCustomerName} onChange={(e)=> setCustomerName(e.target.value)}/> ) : 
                            (
                                <p>{updatedCustomerName}</p>
                            )}
                            <label>Email</label>
                            {isEditMode ? ( <input type="email" defaultValue={updatedCustomerEmail} onChange={(e)=> setCustomerEmail(e.target.value)} /> ) : 
                            (
                                <p>{updatedCustomerEmail}</p>
                            )}
                            <label>Number</label>
                            {isEditMode ? ( <input defaultValue={updatedCustomerNumber} onChange={(e)=> setCustomerNumber(e.target.value)}/>) : 
                            (
                                <p>{updatedCustomerNumber}</p>
                            )}
                            {isEditMode && (
                            <div className="editModePassword">
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" defaultValue="" onChange={(e)=> setPassword(e.target.value)}/>
                                <label htmlFor="retypePassword">Re-type Password</label>
                                <input id="retypePassword" type="password" defaultValue="" onChange={(e)=> setConfirmPassword(e.target.value)}/>
                            </div>
                            )}
                            {!isEditMode && (
                                <div className="membershipDetails">
                                    <label>Membership</label>
                                    <p className="membershipDetails">Type: {membershipType}</p>
                                    <p className="membershipDetails">Start: {membershipStartDate}</p>
                                    <p className="membershipDetails">End: {membershipEndDate}</p>
                                </div>
                            )}

                        </div>
                        {isEditMode && <button className="updateProfileButton" type="submit">Update</button>}
                        {error && <span className="registerErrorMsg">{error}</span>}
                        {!isEditMode && <button className="editProfileButton" onClick={handleEditMode}>Edit Profile</button>}
                        {!isEditMode && membershipType !== "NULL" && <button className="cancelMembershipButton" onClick={cancelMembership}>Cancel membership</button>}
                    </form>
            </div>
        </Fragment>
  )
}
