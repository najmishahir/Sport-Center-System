import {Form, Button} from "react-bootstrap"
import {useState, useEffect} from 'react';
import {Modal} from 'react-bootstrap';
import useFetch from "../../hooks/useFetch"
import "./bookings.css";


const BookActivityForm = ({showAdd, handleClose, handleAddSubmit, formInputs, setFormInputs}) => {

  //Fetching data from database
    const {data:facilityData, loading:facilityLoading, error:facilityError} = useFetch ("http://localhost:4000/api/facilities/");
    const {data:activityData, loading:activityLoading, error:activityError} = useFetch ("http://localhost:4000/api/activities/");
    const {data:customerData, loading:customerLoading, error:customerError} = useFetch ("http://localhost:4000/api/customer/");
    const {data:staffData, loading:staffLoading, error:staffError} = useFetch ("http://localhost:4000/api/employee/");

  //Initializing states 
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedActivity, setSelectedActivity] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedStaff, setSelectedStaff] = useState("");
    const [activityNames, setActivityNames] = useState([]);


    useEffect(() => {
      //Getting activity data based on the selected facility by filtering
      const filteredActivities = activityData.filter(
        (activity) => activity.facilityName === selectedFacility
      );
      
      //Grouping same activity names into one selection
      const uniqueNames = new Set(filteredActivities.map((activity) => activity.activityName));
      const names = Array.from(uniqueNames);

      // Update the state with the activity names
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
        <Modal className = "bookActivityForm" show={showAdd} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Book Activity</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
      
          <Form.Group controlId="formCustomer">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                as="select"
                name="customerEmail"
                onChange={(e) => {
                  setSelectedCustomer(e.target.value);
                  setFormInputs({
                    ...formInputs,
                    customerEmail: e.target.value
                  });
                }}
                value={selectedCustomer}
                
              >
                <option value="">Select Customer</option>
                {customerData &&
                  customerData.map((customer) => (
                    <option
                      key={customer.customerId}
                      value={customer.customerEmail}
                    >
                      {customer.customerEmail}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>


            <Form.Group controlId="formFacility">
              <Form.Label>Facility</Form.Label>
              <Form.Control
                as="select"
                name="facilityName"
                value={selectedFacility}
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
                value={selectedActivity}
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
              <Form.Label>Time</Form.Label>
              <Form.Control
                as="select"
                name="startTime"
                value={formInputs.startTime}
                onChange={handleFormInputChange}
              >
                <option value="">Select Time</option>
                {[...Array(15).keys()].map((hour) => {
                const startHour = hour + 8;
                const formattedStartHour = startHour < 10 ? `${startHour}` : startHour;
                return (
                  <option key={formattedStartHour} value={`${formattedStartHour}:00`}>
                    {`${formattedStartHour}:00`}
                  </option>
                );
              })}

              </Form.Control>
            </Form.Group>


            <Form.Group controlId="formStaff">
              <Form.Label>Employee</Form.Label>
              <Form.Control
                as="select"
                name="staffName"
                value={formInputs.staffName}
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
                      key={staff.staffId}
                      value={staff.staffName}
                    >
                      {staff.staffName}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
      
            <Button  style={{marginTop: "10px", marginBottom: "10px"}}variant="primary" type="submit">
              Book
            </Button>
          </Form>

        {/* A table to display list of activity and times */}
          <table className="activityTable">
            <thead>
              <tr>
              <th>Activity</th>
              <th>Day</th>
              <th>Time</th>
              <th>Price</th>
              <th>Facility</th>
              </tr>
            </thead>
            <tbody>
            {activityData && activityData.map(({ activityId, activityName, day, startTime, endTime, price, facilityName }) => (
                                <tr key = {activityId}>
                                    <td>
                                      <span>{activityName}</span>
                                    </td>
                                    <td>
                                      <span>{day}</span>
                                    </td>
                                    <td>
                                      <span>{startTime}-{endTime}</span>
                                    </td>
                                    <td>
                                      <span>{price}</span>
                                    </td>
                                    <td>
                                      <span>{facilityName}</span>
                                    </td>
                                </tr>
            ))}
            </tbody>
          </table>


        </Modal.Body>
      </Modal>
    );
  };

export default BookActivityForm;