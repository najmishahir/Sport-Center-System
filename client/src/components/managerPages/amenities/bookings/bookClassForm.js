import { Form, Button } from "react-bootstrap"
import useFetch from "../../hooks/useFetch"
import "./bookings.css";
import {useState, useEffect} from 'react';
import { Modal } from 'react-bootstrap';

const BookClassForm = ({showClass, handleClose, handleClassSubmit, formInputs, setFormInputs}) => {

//Fetching data from database
    const {data:facilityData, loading:facilityLoading, error:facilityError} = useFetch ("http://localhost:4000/api/facilities/");
    const {data:customerData, loading:customerLoading, error:customerError} = useFetch ("http://localhost:4000/api/customer/");
    const {data:staffData, loading:staffLoading, error:staffError} = useFetch ("http://localhost:4000/api/employee/");
    const {data:classData, loading:classLoading, error:classError} = useFetch ("http://localhost:4000/api/classes/");

  //Initializing states 
    const [selectedFacility, setSelectedFacility] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedStaff, setSelectedStaff] = useState("");
    const [uniqueClassNames, setUniqueClassNames] = useState([]);

    useEffect(() => {

      //Grouping same class names into one selection
      if (classData) {
        const classNames = classData.map((data) => data.className);
        const uniqueClassNames = Array.from(new Set(classNames));
        setUniqueClassNames(uniqueClassNames);
      }
    }, [classData]);

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
        <Modal className = "bookClassForm" show={showClass} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Book Class</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleClassSubmit}>
      
          <Form.Group controlId="formCustomer">
              <Form.Label>Customer</Form.Label>
              <Form.Control
                as="select"
                name="customerEmail"
                value={selectedCustomer}
                onChange={(e) => {
                  setSelectedCustomer(e.target.value);
                  setFormInputs({
                    ...formInputs,
                    customerEmail: e.target.value
                  });
                }}
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
                facilityData.map((facility) => {
                    if (facility.facilityName === "Studio") {
                    return (
                        <option
                        key={facility.facilityName}
                        value={facility.facilityName}
                        >
                        {facility.facilityName}
                        </option>
                    );
                    }
                    return null;
                })}
              </Form.Control>
            </Form.Group>

      
            <Form.Group controlId="formClass">
              <Form.Label>Class</Form.Label>
              <Form.Control
                as="select"
                name="className"
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setFormInputs({
                    ...formInputs,
                    className: e.target.value
                  });
                }}
              >
                <option value="">Select Class</option>
                {uniqueClassNames.map((className) => (
                  <option key={className} value={className}>
                    {className}
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
                      key={staff.staffId}
                      value={staff.staffName}
                    >
                      {staff.staffName}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
      
            <Button style={{marginTop: "10px", marginBottom: "10px"}}variant="primary" type="submit">
              Book
            </Button>
          </Form>

          <table>
            <thead>
              <tr>
              <th>Class</th>
              <th>Price</th>   
              <th>Day</th>   
              <th style={{width: "40%"}}>Day & Time</th>
              <th> </th>
              </tr>
            </thead>
            <tbody>
            {classData && classData.map(({ classId, className, price, day, startTime, endTime}) => (
                                <tr key = {classId}>
                                    <td>
                                      <span>{className}</span>
                                    </td>
                                    <td>
                                      <span>{price}</span>
                                    </td>
                                    <td>
                                      <span>{day}</span>
                                    </td>
                                    <td className="dayTimeColumn">
                                        <div key={`${startTime}-${endTime}`}>
                                          <span>{startTime}-</span>
                                          <span>{endTime}</span>
                                        </div>
                                    </td>
                                </tr>
            ))}
            </tbody>
          </table>


        </Modal.Body>
      </Modal>
    );
  };

export default BookClassForm;