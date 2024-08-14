import { Form, Button } from "react-bootstrap"
import axios from 'axios'
import "./activityDetails.css";
import {useState} from 'react';
import useFetch from "../../../hooks/useFetch"
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

const AddActivityForm = ({showAdd, handleClose, handleAddSubmit, formInputs, setFormInputs}) => {

  const {data:facilityData, loading:facilityLoading, error:facilityError} = useFetch ("http://localhost:4000/api/facilities/");
  const [selectedFacility, setSelectedFacility] = useState("");
  
  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    if ((name === "day" || name === "startTime" || name === "endTime") && value === "") {
      setFormInputs({
        ...formInputs,
        [name]: null
      });
    } else {
      setFormInputs({
        ...formInputs,
        [name]: value
      });
    }
  };
  
      
      return (
        <Modal className = "addActivityForm" show={showAdd} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Add Activity</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
      
            <Form.Group controlId="formActivityName">
              <Form.Label>Activity Name</Form.Label>
              <Form.Control
                type="text"
                name="activityName"
                value={formInputs.activityName}
                onChange={handleFormInputChange}
                placeholder=""
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
                value={formInputs.startTime || ""}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>

            {/*<Form.Group controlId="formStartTime">
            <div style={{display: 'block'}}>
              <Form.Label>Start Time</Form.Label>
            </div>
              <Form.Select
                type="time"
                name="startTime"
                value={formInputs.startTime || ""}
                onChange={handleFormInputChange}
                placeholder=""
              >
              <option value="">--:--</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
              </Form.Select>
            </Form.Group>*/}

            <Form.Group controlId="formEndTime">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={formInputs.endTime || ""}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step= "0.01"
                name="price"
                value={formInputs.price}
                onChange={handleFormInputChange}
                placeholder=""
              />
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
      
            <Button style={{marginTop: "10px"}} variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default AddActivityForm;