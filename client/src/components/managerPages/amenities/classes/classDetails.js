import React from 'react';
import {useEffect, useState} from 'react';
import "./classDetails.css";
import Navbar from "../../managerNavbar/ManagerNavbar";
import useFetch from "../../hooks/useFetch"
import axios from 'axios';
import EditClassForm from "./editClassForm";
import AddClassForm from "./addClassForm";


const ClassDetails = () => {

    //Getting data from database
    const {data:classData, loading:classLoading, error:classError} = useFetch ("http://localhost:4000/api/classes/");

    const [classDetails, setClassDetails] = useState()
    const [editableRows, setEditableRows] = useState({});
    const [selectedClass, setSelectedClass] = useState(null);
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const handleClose = () => {
      setShow(false);
      setShowAdd(false);
    }

    useEffect(() => {
      setClassDetails(classData.map(({ classId, className, price, day, startTime, endTime, facilityName }) => {
        return {
          classId,
          className,
          price,
          dayTime: [{ day, startTime, endTime }],
          facilityName
        };
      }));      
    }, [classData]);


    const [formInputs, setFormInputs] = useState({
      className: "",
      price: "",
      day: "",
      startTime: "",
      endTime: "",
      facilityName:""
    });


    //Show edit class form
    const handleShow = (classId) => {
      const selectedClass = classDetails.find(classes => classes.classId === classId);
      setSelectedClass(selectedClass);
      setShow(true);

      if (selectedClass) {
      setFormInputs({
        classId: selectedClass.classId,
        className: selectedClass.className,
        price: selectedClass.price,
        day: selectedClass.dayTime[0].day, 
        startTime: selectedClass.dayTime[0].startTime, 
        endTime: selectedClass.dayTime[0].endTime,
        facilityName: selectedClass.facilityName
      });
    }
    };


    //Show add class form
    const handleAdd = () => {
      setShowAdd(true);
      if (selectedClass) {
      setFormInputs({
        className: "",
        day: "",
        startTime: "",
        endTime: "",
        price: "",
        facilityName:""
      });
    }
    };


    //Handle submit edit form
    const handleSubmit = (event) => {
      event.preventDefault();
      // Update facility details with updated formInput values
      setClassDetails((prevState) => {
      const updatedDetails = [...prevState];
      const index = updatedDetails.findIndex(
          (classes) => classes.classId === selectedClass.classId
      );
      updatedDetails[index].classId = formInputs.classId;
      updatedDetails[index].className = formInputs.className;
      updatedDetails[index].dayTime[0].day = formInputs.day;
      updatedDetails[index].dayTime[0].startTime = formInputs.startTime;
      updatedDetails[index].dayTime[0].endTime =  formInputs.endTime;
      updatedDetails[index].price =  formInputs.price;
      updatedDetails[index].facilityName =  formInputs.facilityName;

      return updatedDetails;
      });

      // Send updated facility details to backend
      axios.put(`http://localhost:4000/api/classes/${selectedClass.classId}`, {

        name: formInputs.className,
        day: formInputs.day,
        start: formInputs.startTime,
        end: formInputs.endTime,
        price: formInputs.price,
        facilityName: formInputs.facilityName
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


    //Handle submit add class form
    const handleAddSubmit = (event) => {
      event.preventDefault();

      setClassDetails((prevState) => {
        const updatedDetails = [...prevState];
        
        //updatedDetails[index].staffId = formInputs.staffId;
        updatedDetails.className = formInputs.className;
        updatedDetails.day = formInputs.day;
        updatedDetails.startTime = formInputs.startTime;
        updatedDetails.endTime = formInputs.endTime;
        updatedDetails.price =  formInputs.price;
        updatedDetails.facilityName =  formInputs.facilityName;
  
        return updatedDetails;
        });

        axios.post('http://localhost:4000/api/classes/classid', {
        name: formInputs.className,
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
          alert('Failed to save data');
        });
    
      handleClose();
    };


    //Handle delete class 
    const handleDelete = (classId) => {
      const selectedClass = classDetails.find(classes => classes.classId === classId);
      setSelectedClass(selectedClass);
      
      if (window.confirm("Are you sure you want to delete this class?")) {
        axios.delete(`http://localhost:4000/api/classes/${selectedClass.classId}`)
          .then(() => {
            // remove the deleted class from table
            setClassDetails(classDetails.filter(classes => classes.classId !== selectedClass.classId));
          })
          .catch(err => console.error('Failed to delete class', err));
      }
    };


    return(
        <div>
            <Navbar/>
            <EditClassForm 
              show={show}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              class={selectedClass}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <AddClassForm 
            showAdd={showAdd}
            handleClose={handleClose}
            handleAddSubmit={handleAddSubmit}
            formInputs={formInputs}
            setFormInputs={setFormInputs}
          />
            <div className="classDetails">
              <div className="classDetailsTable">
                    <h1 className="classDetailsTitle">Classes</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Class</th>
                                    <th>Price</th>   
                                    <th className="dayTimeColumn">Day & Time</th>
                                    <th>Facility</th>  
                                    <th> </th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {classDetails && classDetails.map(({ classId, className, price, dayTime, facilityName}, index) => (
                                <tr key = {classId}>
                                    <td>
                                      <span>{className}</span>
                                    </td>
                                    <td>
                                      <span>{price}</span>
                                    </td>
                                    <td className="dayTimeColumn">
                                      {dayTime.map(({ day, startTime, endTime }) => (
                                        <div key={`${day}-${startTime}-${endTime}`}>
                                          <span>{day}: </span>
                                          <span>{startTime} - </span>
                                          <span>{endTime}</span>
                                        </div>
                                      ))}
                                    </td>
                                    <td>
                                      <span>{facilityName}</span>
                                    </td>
                                    <td>
                                    <button className="button editButton" onClick={() => {setSelectedClass({classId, className, price, dayTime, facilityName}); handleShow(classId);}}>
                                    {editableRows[classId] ? "Done" : "Edit"}
                                    </button>
                                    </td>
                                    <td>
                                    <button className="button deleteClassButton" onClick={() => {setSelectedClass({classId, className, price, dayTime, facilityName}); handleDelete(classId);}}>
                                    {editableRows[classId] ? "Delete" : "Delete"}
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            <div>
                            <button className="button addClassButton" onClick={() => { handleAdd();}}>
                              Add
                            </button>
                            </div>
                        </table>
                    </div>
                </div>
        </div>
    )
}

export default ClassDetails;