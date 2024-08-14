import { Form, Button } from "react-bootstrap"
import axios from 'axios'
import "./classDetails.css";
import { useState, useEffect} from 'react';
import { Modal } from 'react-bootstrap';

const EditStaffForm = ({show, handleClose, handleSubmit, formInputs, setFormInputs}) => {

  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
        axios.get('http://localhost:4000/api/facilities')
          .then(response => {
            setFacilities(response.data);
          })
          .catch(error => {
            console.log(error);
          });
      }, []);
  
    const handleFormInputChange = (event) => {
        setFormInputs({
          ...formInputs,
          [event.target.name]: event.target.value
        });
      };
      
      return (
        <Modal className = "editClassForm" show={show} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Edit Class</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
      
            <Form.Group controlId="formClassName">
              <Form.Label>Class Name</Form.Label>
              <Form.Control
                type="text"
                name="className"
                value={formInputs.className}
                onChange={handleFormInputChange}
                placeholder="Enter class name"
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={formInputs.price}
                onChange={handleFormInputChange}
                placeholder="enter price"
              />
            </Form.Group>
      
            <Form.Group controlId="formDay">
            <div style={{display: 'block'}}>
              <Form.Label>Day</Form.Label>
            </div>
            <div>
              <Form.Select
                name="day"
                value={formInputs.day}
                onChange={handleFormInputChange}
              >
                <option value="">Select day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </Form.Select>
              </div>
            </Form.Group>

      
            <Form.Group controlId="formStartTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={formInputs.startTime}
                onChange={handleFormInputChange}
                placeholder="Enter start time"
              />
            </Form.Group>

            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={formInputs.endTime}
                onChange={handleFormInputChange}
                placeholder="enter end time"
              />
            </Form.Group>

            <Form.Group controlId="formFacility">
            <div style={{display: 'block'}}>
            <Form.Label>Facility</Form.Label>
            </div>
            <div>
            <Form.Select
              name="facilityName"
              value={formInputs.facilityName}
              onChange={handleFormInputChange}
            >
              {facilities.map(facility => (
                <option key={facility.facilityName} value={facility.facilityName}>
                  {facility.facilityName}
                </option>
              ))}
            </Form.Select>
            </div>
          </Form.Group>
      
            <Button style= {{marginTop: "10px"}} variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default EditStaffForm;