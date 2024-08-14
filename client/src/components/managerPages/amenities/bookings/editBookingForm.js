import { Form, Button } from "react-bootstrap"
import useFetch from "../../hooks/useFetch"
import "./bookings.css";
import {useEffect, useState} from 'react';
import { Modal } from 'react-bootstrap';


const EditBookingForm = ({show, handleClose, handleSubmit, formInputs, setFormInputs}) => {
  
    const {data:activityData, loading:activityLoading, error:activityError} = useFetch ("http://localhost:4000/api/activities/");
    const {data:facilityData, loading:facilityLoading, error:facilityError} = useFetch ("http://localhost:4000/api/facilities/");
    const {data:staffData, loading:staffLoading, error:staffError} = useFetch ("http://localhost:4000/api/employee/");
    const {data:classData, loading:classLoading, error:classError} = useFetch ("http://localhost:4000/api/classes/");


    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedActivity, setSelectedActivity] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [activityNames, setActivityNames] = useState([]);

    useEffect(() => {
      // Filter the activity data based on the selected facility name
      const filteredActivities = activityData.filter(
        (activity) => activity.facilityName === selectedFacility
      );

      const uniqueNames = new Set(filteredActivities.map((activity) => activity.activityName));
      const names = Array.from(uniqueNames);
      setActivityNames(names);
    
    }, [facilityData, activityData, selectedFacility]);

    const handleFormInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;

    if (name === 'isManager') {
      setFormInputs({
        ...formInputs,
        [name]: value === 'Manager' ? true : false
      });
    } else {
      setFormInputs({
        ...formInputs,
        [name]: value
      });
    }
  };
      
      return (
        <Modal className="editBookingForm" show={show} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Edit Booking</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
      
            <Form.Group controlId="formCustomer">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                type="text"
                name="customerEmail"
                value={formInputs.customerEmail}
                onChange={handleFormInputChange}
                disabled = {true}
              />
            </Form.Group>

            <Form.Group controlId="formFacility">
              <Form.Label>Facility</Form.Label>
              <Form.Control
                as="select"
                name="facilityName"
                value={formInputs.facilityName}
                onChange={(e) => {
                  setSelectedFacility(e.target.value);
                  setFormInputs({
                    ...formInputs,
                    facilityName: e.target.value
                  });
                }}
              >
                <option value="">Select Facility</option>
                {facilityData &&
                  facilityData.map((facility) => (
                    <option
                      key={facility.facilityName}
                      value={facility.facilityName}
                    >
                      {facility.facilityName}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
      
            <Form.Group controlId="formActivity">
              <Form.Label>Activity</Form.Label>
              <Form.Control
                as="select"
                name="activityName"
                value={formInputs.activityName}
                onChange={(e) => {
                  setSelectedActivity(e.target.value);
                  setFormInputs({
                    ...formInputs,
                    activityName: e.target.value
                  });
                }}
              >
                <option value="">Select Activity</option>
                {activityNames &&
                  activityNames.map((activityName) => (
                    <option key={activityName} value={activityName}>
                      {activityName}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formClass">
              <Form.Label>Class</Form.Label>
              <Form.Control
                as="select"
                name="className"
                value={formInputs.className}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setFormInputs({
                    ...formInputs,
                    className: e.target.value
                  });
                }}
              >
                <option value="">Select Class</option>
                {classData &&
                  classData.map((classes) => (
                    <option key={classes.classId} value={classes.className}>
                      {classes.className}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formInputs.date}
                onChange={handleFormInputChange}
                placeholder=" "
              />
            </Form.Group>

            <Form.Group controlId="formStartTime">
              <Form.Label>Start</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={formInputs.startTime}
                onChange={handleFormInputChange}
                placeholder=" "
              />
            </Form.Group>

            <Form.Group controlId="formEndTime">
              <Form.Label>End</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={formInputs.endTime}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>

            <Form.Group controlId="formStaff">
              <Form.Label>Employee</Form.Label>
              <Form.Control
                as="select"
                name="staffName"
                value={selectedStaff}
                onChange={(e) => {
                  setSelectedStaff(e.target.value);
                  setFormInputs({
                    ...formInputs,
                    staffName: e.target.value
                  });
                }}
              >
                <option value="">Select Staff</option>
                {staffData &&
                  staffData.map((staff) => (
                    <option
                      key={staff.staffName}
                      value={staff.staffName}
                    >
                      {staff.staffName}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
      
            <Button style={{marginTop: "10px"}}variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default EditBookingForm;