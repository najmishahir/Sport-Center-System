import { Form, Button } from "react-bootstrap"
import axios from 'axios'
import "./facilityDetails.css";
import {useContext, useState} from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

const EditFacilityForm = ({show, handleClose, handleSubmit, formInputs, setFormInputs}) => {
  

      const handleFormInputChange = (event, index) => {
        const { name, value } = event.target;
        if (name.startsWith("activities[")) {
          const activities = [...formInputs.activities];
          const split = name.split(".");
          const activityIndex = parseInt(split[0].substring(11), 10);
          const data = split[1];
          activities[activityIndex][data] = value;
          setFormInputs({
            ...formInputs,
            activities,
          });
        } else {
          setFormInputs({
            ...formInputs,
            [name]: value,
          });
        }
      };
  

    return (
        <Modal className = "editFacilityForm" show={show} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Edit Facility</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formInputs.facilityName}
                onChange={handleFormInputChange}
                placeholder="Enter facility name"
                disabled = {true}
              />
            </Form.Group>
      
            <Form.Group controlId="formCapacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={formInputs.capacity}
                onChange={handleFormInputChange}
                placeholder="Enter facility capacity"
              />
            </Form.Group>
      
            <Form.Group controlId="formStart">
              <Form.Label>Opening Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={formInputs.startTime}
                onChange={handleFormInputChange}
                placeholder="Enter opening time"
              />
            </Form.Group>
      
            <Form.Group controlId="formEnd">
              <Form.Label>Closing Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={formInputs.endTime}
                onChange={handleFormInputChange}
                placeholder="Enter closing time"
              />
            </Form.Group>

            {formInputs.activities && formInputs.activities.map((activity, index) => (
            <div key={index}>
            <Form.Group controlId="formActivityName${index}">
              <Form.Label>Activity Name</Form.Label>
              <Form.Control
                type="text"
                name= {`activities[${index}].activityName`}
                value={activity.activityName}
                onChange={(event) => handleFormInputChange(event, index)}
                placeholder="Enter activity name"
                disabled = {true}
              />
            </Form.Group>

            <Form.Group controlId="formPrice${index}">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name= {`activities[${index}].price`}
                value={activity.price}
                onChange={(event) => handleFormInputChange(event, index)}
                placeholder="Enter price"
              />
            </Form.Group>
            </div>
          ))}
      
            <Button style={{marginTop: "10px"}} variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default EditFacilityForm;
  