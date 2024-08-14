import React,{Fragment, useState, useEffect, useContext} from "react";
import "./managerProfileInfo.css";
import {Auth} from "../../../context/Auth"
// import {Link} from "react-router-dom";
import axios from "axios";

export default function ManagerProfileInfo() {

    
    const {user} = useContext(Auth);
    // State: Edit mode for update profile
    const [isEditMode, setIsEditMode] = useState(false);
        
    //keeps track of whether changes made

    const handleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    
    const [staffId, setStaffId] = useState(user.details.staffId);
    const [staffName, setStaffName] = useState(user.details.staffName);
    const [staffNumber, setStaffNumber] = useState(user.details.staffNumber);
    const [staffEmail, setStaffEmail] = useState(user.details.staffEmail);
    const [password, setPassword] = useState(user.details.password);
    const [confirmPassword, setConfirmPassword] = useState("")

    const [updatedStaffName, setUpdatedStaffName] = useState(user.details.staffName);
    const [updatedStaffNumber, setUpdatedStaffNumber] = useState(user.details.staffNumber);
    const [updatedStaffEmail, setUpdatedStaffEmail] = useState(user.details.staffEmail);

    const [error, setError] = useState("");


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsEditMode(false);
        if ((password || confirmPassword) && (confirmPassword !== password)) {
            setError("Passwords do not match");
            setIsEditMode(true);
        }


        //Updates customerName, customerNumber, customerEmail
        try {
            const res = await axios.put("http://localhost:4000/api/employee/"+ user.details.staffId,{
                staffName,
                staffNumber,
                staffEmail,
            }); 
            setUpdatedStaffName(res.data.staffName);
            setUpdatedStaffNumber(res.data.staffNumber);
            setUpdatedStaffEmail(res.data.staffEmail);
            localStorage.setItem("user", JSON.stringify({...user, details:
                {
                    "createdAt" : res.data.createdAt,
                    "staffEmail" : res.data.staffEmail,
                    "staffId":res.data.staffId,
                    "staffName": res.data.staffName,
                    "staffNumber":res.data.staffNumber,
                    "updatedAt":res.data.updatedAt,
                }
            })); 
        } 
        catch (err) {
            console.log(err.response.data);
        }

        //Updates password
        try {
            const res = await axios.put("http://localhost:4000/api/employee/change-password/"+user.details.staffId, 
                {password}
            );  
            console.log(res.data);
        } catch (err) {
            console.log(err.response.data);
        }
    };



    return (
        <Fragment>
                <div className="editInfo">
                    <form className="userDetailsForm" onSubmit={handleFormSubmit}>
                        <span className="editInfoTitle">Update Info</span>
                        <div className="userDetails"> 
                            <label>Name</label>
                            {isEditMode ? ( <input type="text" defaultValue={updatedStaffName} onChange={(e)=> setStaffName(e.target.value)}/> ) : 
                            (
                                <p>{updatedStaffName}</p>
                            )}
                            <label>Email</label>
                            {isEditMode ? ( <input type="email" defaultValue={updatedStaffEmail} onChange={(e)=> setStaffEmail(e.target.value)} /> ) : 
                            (
                                <p>{updatedStaffEmail}</p>
                            )}
                            <label>Number</label>
                            {isEditMode ? ( <input defaultValue={updatedStaffNumber} onChange={(e)=> setStaffNumber(e.target.value)}/>) : 
                            (
                                <p>{updatedStaffNumber}</p>
                            )}
                            {isEditMode && (
                            <div className="editModePassword">
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" defaultValue="" onChange={(e)=> setPassword(e.target.value)}/>
                                <label htmlFor="retypePassword">Re-type Password</label>
                                <input id="retypePassword" type="password" defaultValue="" onChange={(e)=> setConfirmPassword(e.target.value)}/>
                            </div>
                            )}

                        </div>
                        {isEditMode && <button className="updateProfileButton" type="submit">Update</button>}
                        {error && <span className="registerErrorMsg">{error}</span>}
                        {!isEditMode && <button className="editProfileButton" onClick={handleEditMode}>Edit Profile</button>}
                    </form>
            </div>
        </Fragment>
  )
}
