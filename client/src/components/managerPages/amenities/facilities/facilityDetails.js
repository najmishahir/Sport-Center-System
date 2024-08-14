import React from 'react';
import axios from 'axios';
import {useEffect, useState} from 'react';
import "./facilityDetails.css";
import Navbar from "../../managerNavbar/ManagerNavbar";
import useFetch from "../../hooks/useFetch"
import EditFacilityForm from "./editFacilityForm";
import EditDiscountForm from "./editDiscountForm";


const FacilityDetails = () => {

  //useFetch to fetch data from database
    const {data:facilityData, loading:facilityLoading, error:facilityError} = useFetch ("http://localhost:4000/api/facilities/");
    const {data:activityData, loading:activityLoading, error:activityError} = useFetch ("http://localhost:4000/api/activities/");
    const {data:discountData, loading:discountLoading, error:discountError} = useFetch ("http://localhost:4000/api/discount/");


  //States
    const [facilityDetails, setFacilityDetails] = useState();
    const [editableRows, setEditableRows] = useState({});
    const [selectedFacility, setSelectedFacility] = useState(null); 
    const [selectedActivity,setSelectedActivity] = useState(null); 
    const [discountDetails, setDiscountDetails] = useState()
    const [selectedDiscount,setSelectedDiscount] = useState(null);
    const [showDiscount, setShowDiscount] = useState(false);


    const [show, setShow] = useState(false);
    const handleClose = () => {
      setShow(false);;
      setShowDiscount(false);
    }

    // Getting activityId based on facilityName
    const activityIdMap = activityData.reduce((map, activity) => {
      map[`${activity.facilityName}-${activity.activityName}`] = activity.activityId;
      return map;
    }, {});

    useEffect(() => {

      // Getting activityId based on facilityName
      const activityIdMap = activityData.reduce((map, activity) => {
        map[`${activity.facilityName}-${activity.activityName}`] = activity.activityId;
        return map;
      }, {});

      setFacilityDetails(facilityData.map((facility) => {
        const filteredActivities = activityData.filter(activity => activity.facilityName === facility.facilityName);
        const activities = filteredActivities.map(activity => ({
          activityId: activityIdMap[`${activity.facilityName}-${activity.activityName}`],
          activityName: activity.activityName,
          price: activity.price
        }));
        return {
          ...facility,
          facilityName: facility.facilityName,
          capacity: facility.capacity,
          startTime: facility.startTime,
          endTime: facility.endTime,
          activities
        };
      }));

      if (discountData) {
        setDiscountDetails({
          discountId: discountData.id,
          discount: discountData.discount
        });
      }

    }, [facilityData, activityData, discountData]);

    const [discountInputs, setDiscountInputs] = useState({
      discountId: "",
      discount:"",
    });

    const [formInputs, setFormInputs] = useState({
      facilityName: "",
      capacity: "",
      startTime: "",
      endTime: "",
      activities: [
        {
          activityName: "",
          price: "",
        }
      ]
    });


    //Show edit facility form
    const handleShow = (facilityName) => {
      const selectedFacility = facilityDetails.find(facility => facility.facilityName === facilityName);
      setSelectedFacility(selectedFacility);
      setShow(true);

      if (selectedFacility) {
      const { facilityName, capacity, startTime, endTime, activities } = selectedFacility;
      setFormInputs({
        facilityName,
        capacity,
        startTime,
        endTime,
        activities: activities.map(activity => ({
          activityName: activity.activityName,
          price: activity.price
        }))
      });
      setSelectedActivity(activities); 
    }
    };

    //Show discount form
    const handleDiscount = (discountId) => {
      const selectedDiscount = {
        discountId: discountId,
        discount: discountDetails.discount
      };
      setSelectedDiscount(selectedDiscount);
      if (selectedDiscount) {
        setDiscountInputs({
          discount: selectedDiscount.discount*100
        });
      }
      setShowDiscount(true);
    };

    
    //Handle submit edit facility form
     const handleSubmit = (event) => {
        event.preventDefault();

        // Update facility details with formInputs values
        setFacilityDetails((prevState) => {
        const updatedDetails = [...prevState];
        const index = updatedDetails.findIndex(
          (facility) => facility.facilityName === selectedFacility.facilityName
      );
        
        updatedDetails[index].facilityName = formInputs.facilityName;
        updatedDetails[index].capacity = formInputs.capacity;
        updatedDetails[index].startTime = formInputs.startTime;
        updatedDetails[index].endTime = formInputs.endTime;
        updatedDetails[index].activities = formInputs.activities;
        
        return updatedDetails;
        });
    
        // Send updated facility details to backend
        axios.put(`http://localhost:4000/api/facilities/${selectedFacility.facilityName}`, {
        capacity: formInputs.capacity,
        startTime: formInputs.startTime,
        endTime: formInputs.endTime,
        })
        .then(response => {
        console.log(response.data);
        handleClose();
        })
        .catch(error => {
        console.log(error);
        alert('Failed to save data')
        });

        // Update activity details with formInputs values
        formInputs.activities.forEach((activity) => {

          const activityId = activityIdMap[`${selectedFacility.facilityName}-${activity.activityName}`];
        
            axios.put(`http://localhost:4000/api/activities/${activityId}`, {
                //facilityName: formInputs.facilityName,
                activityName: activity.activityName,
                price: activity.price,
              })
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.log(error);
                alert('Failed to save data');
              });
          
              
        });

        handleClose();
    };
    


    const handleSubmitDiscount = (event) => {
      event.preventDefault();

      const updatedDiscount = discountInputs.discount/100

      // Send updated facility details to server
      axios.put(`http://localhost:4000/api/discount/${discountDetails.discountId}`, {
        discount: updatedDiscount
        })
        .then(response => {
        console.log(response.data);
        window.location.reload();
        })
        .catch(error => {
        console.log(error);
        alert('Failed to save data')
        });

      };
    

    return (
    //<Fragment>
      <div>
        <Navbar />
        <EditFacilityForm 
          show={show}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          facility={selectedFacility}
          formInputs={formInputs}
          setFormInputs={setFormInputs}
        />
        <EditDiscountForm 
        showDiscount={showDiscount}
        handleClose={handleClose}
        handleSubmitDiscount={handleSubmitDiscount}
        discountInputs={discountInputs}
        setDiscountInputs={setDiscountInputs}
        />
        {facilityLoading ? (
          "Page is loading please wait"
          ) : ( 
          <>
          <div className="facilityActivityDetails">
                <div className="facilityActivityDetailsTable">
                      <h1 className="facilityActivityDetailsTitle">Facilities</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Facility</th>
                                        <th>Capacity</th>
                                        <th>Opening Time</th>
                                        <th>Closing Time</th>
                                        <th>Activity & Price</th>
                                        <th> </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {facilityDetails && facilityDetails.map(({facilityName, capacity, startTime, endTime, activities}) => (
                                    <tr key = {facilityName}>
                                        <td>
                                              <span>{facilityName}</span>
                                        </td>
                                        <td>
                                              <span>{capacity}</span>
                                        </td>
                                        <td>
                                              <span>{startTime}</span>
                                        </td>
                                        <td>
                                              <span>{endTime}</span>
                                        </td>
                                        <td>
                                          {activities.map(({ activityName, price }, index) => (
                                            <div key={index}>
                                              <span>{activityName}:&nbsp;&nbsp;</span>
                                              <span>{` ${price}`}</span>
                                            </div>
                                          ))}
                                        </td>
                                        <td>
                                        <button className="button editFacilityButton" onClick={() => {handleShow(facilityName);}}>
                                          {editableRows[facilityName] ? "Done" : "Edit"}
                                        </button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>

                                <div>
                                <table className="discountTable" style={{float: "left"}}>
                                  <thead>
                                    <tr>
                                    <th className="discountHead">Discount</th>
                                    <th className="discountHead"></th>
                                    <th className="discountHead"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {discountDetails && discountDetails.discount && (
                                      <tr>
                                        <td>Booking Discount: </td>
                                        <td>
                                          <span>{(discountDetails.discount * 100).toFixed(2)}%</span>
                                        </td>
                                        <td>
                                        <button className="editCustomerButton" onClick={() => {handleDiscount(discountDetails.discountId)}}>
                                        Edit
                                        </button>
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                                </div>
                            </table>
                      </div>
                  </div>
                  </>)}
              </div>
  );
};

export default FacilityDetails;