import React from 'react';
import {useEffect, useState} from 'react';
import "./activityDetails.css";
import Navbar from "../../../managerNavbar/ManagerNavbar";
import { Link } from 'react-router-dom';
import useFetch from "../../../hooks/useFetch"
import axios from 'axios';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import EditActivityForm from "./editActivityForm";
import AddActivityForm from "./addActivityForm";


const ActivityDetails = () => {

    //useFetch to fetch data from database
    const {data:activityData, loading:activityLoading, error:activityError} = useFetch ("http://localhost:4000/api/activities/");

    const [activityDetails, setActivityDetails] = useState()
    const [editableRows, setEditableRows] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const handleClose = () => {
      setShow(false);
      setShowAdd(false);
    }

    useEffect(() => {
      setActivityDetails(activityData.map(({ activityId, activityName, day, startTime, endTime, price, facilityName }) => {
        return {
          activityId,
          activityName,
          day,
          startTime,
          endTime,
          price,
          facilityName
        };
      }));      
    }, [activityData]);

    const [formInputs, setFormInputs] = useState({
          activityName: "",
          day: "",
          startTime: "",
          endTime: "",
          price: "",
          facilityName: ""
    });

    //Show edit activity form
    const handleShow = (activityId) => {
      const selectedActivity = activityDetails.find(activity => activity.activityId === activityId);
      setSelectedActivity(selectedActivity);
      setShow(true);

      if (selectedActivity) {
      setFormInputs({
        activityId: selectedActivity.activityId,
        activityName: selectedActivity.activityName,
        day: selectedActivity.day,
        startTime: selectedActivity.startTime,
        endTime: selectedActivity.endTime, 
        price: selectedActivity.price,
        facilityName: selectedActivity.facilityName
      });
    }
    };


    //Handle add activity form
    const handleAdd = () => {
      setShowAdd(true);
      if (selectedActivity) {
      setFormInputs({
          activityName: "",
          day: "",
          startTime: "",
          endTime: "",
          price: "",
          facilityName: ""
      });
    }
    };

    //Handle submit edit activity form
    const handleSubmit = (event) => {
      event.preventDefault();
      // Update facility details with formInputs values
      setActivityDetails((prevState) => {
      const updatedDetails = [...prevState];
      const index = updatedDetails.findIndex(
          (activity) => activity.activityId === selectedActivity.activityId
      );
      updatedDetails[index].activityId = formInputs.activityId;
      updatedDetails[index].activityName = formInputs.activityName;
      updatedDetails[index].day = formInputs.day;
      updatedDetails[index].startTime = formInputs.startTime;
      updatedDetails[index].endTime =  formInputs.endTime;
      updatedDetails[index].price =  formInputs.price;
      updatedDetails[index].facilityName =  formInputs.facilityName;

      return updatedDetails;
      });

      // Send updated facility details to backend
      axios.put(`http://localhost:4000/api/activities/${selectedActivity.activityId}`, {

        activityName: formInputs.activityName,
        day: formInputs.day,
        startTime: formInputs.startTime,
        endTime: formInputs.endTime,
        price: formInputs.price,
        facilityName:  formInputs.facilityName
        })
        .then(response => {
        console.log(response.data);
        })
        .catch(error => {
        console.log(error);
        alert('Failed to save data')
        });

      handleClose();
    };


    //Handle submit add activity form
    const handleAddSubmit = (event) => {
      event.preventDefault();

      setActivityDetails((prevState) => {
        const updatedDetails = [...prevState];
        
        //updatedDetails[index].staffId = formInputs.staffId;
        updatedDetails.activityName = formInputs.activityName;
        updatedDetails.day = formInputs.day;
        updatedDetails.startTime = formInputs.startTime;
        updatedDetails.endTime = formInputs.endTime;
        updatedDetails.price =  formInputs.price;
        updatedDetails.facilityName =  formInputs.facilityName;
  
        return updatedDetails;
        });
    
      // Send new staff details to backend
      axios.post('http://localhost:4000/api/activities/activityId', {
        name: formInputs.activityName,
        day: formInputs.day,
        start: formInputs.startTime,
        end: formInputs.endTime,
        price: formInputs.price,
        facilityName: formInputs.facilityName,
      })
        .then(response => {
          console.log(response.data);
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
          alert('Failed to add activity');
        });
    
      handleClose();
    };


    //Handle delete activity
    const handleDelete = (activityId) => {
      const selectedActivity = activityDetails.find(activity => activity.activityId === activityId);
      setSelectedActivity(selectedActivity);
      
      if (window.confirm("Are you sure you want to delete this activity?")) {
        axios.delete(`http://localhost:4000/api/activities/${selectedActivity.activityId}`)
          .then(() => {
            setActivityDetails(activityDetails.filter(activity => activity.activityId !== selectedActivity.activityId));
          })
          .catch(err => console.error('Failed to delete activity', err));
      }
    };


    return(
        <div>
            <Navbar/>
            <EditActivityForm 
              show={show}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              activity={selectedActivity}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <AddActivityForm 
              showAdd={showAdd}
              handleClose={handleClose}
              handleAddSubmit={handleAddSubmit}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <div className="activityDetails">
                <div className="activityDetailsTable">
                  <h1 className="activityDetailsTitle">Activities</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Activity</th>
                                    <th>Available Days</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Price</th>
                                    <th>Facility</th>
                                    <th> </th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {activityDetails && activityDetails.map(({ activityId, activityName, day, startTime, endTime, price, facilityName }) => (
                                <tr key = {activityId}>
                                    <td>
                                      <span>{activityName}</span>
                                    </td>
                                    <td>
                                      <span>{day}</span>
                                    </td>
                                    <td>
                                      <span>{startTime}</span>
                                    </td>
                                    <td>
                                      <span>{endTime}</span>
                                    </td>
                                    <td>
                                      <span>{price}</span>
                                    </td>
                                    <td>
                                      <span>{facilityName}</span>
                                    </td>
                                    {isEditable && (
                                    <td>
                                    <button className="button deleteButton" >
                                        Delete Activity
                                    </button>
                                    </td>
                                     )}
                                    <td>
                                    <button className="button editActivityButton" onClick={() => {setSelectedActivity({activityId, activityName, day, startTime, endTime, price, facilityName}); handleShow(activityId);}}>
                                    {editableRows[activityId] ? "Done" : "Edit"}
                                    </button>
                                    </td>
                                    <td>
                                    <button className="button editActivityButton" onClick={() => {handleDelete(activityId);}}>
                                    {editableRows[activityId] ? "Delete" : "Delete"}
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            <div>
                              <button className="button addActivityButton" onClick={() => { handleAdd();}}>
                                Add
                              </button>
                            </div>
                        </table>
                    </div>
                </div>
        </div>
    )
}

export default ActivityDetails;