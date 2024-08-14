import { Form, Button } from "react-bootstrap"
import axios from 'axios'
import "./staff.css";
import {useContext, useState} from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

const EditStaffForm = ({show, handleClose, handleSubmit, formInputs, setFormInputs}) => {
  
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
        <Modal className = "editStaffForm" show={show} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Edit Staff</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
      
            <Form.Group controlId="formStaffName">
              <Form.Label>Staff Name</Form.Label>
              <Form.Control
                type="text"
                name="staffName"
                value={formInputs.staffName}
                onChange={handleFormInputChange}
                disabled={true}
              />
            </Form.Group>
      
            <Form.Group controlId="formStaffNumber">
              <Form.Label>Staff Number</Form.Label>
              <Form.Control
                type="number"
                name="staffNumber"
                value={formInputs.staffNumber}
                onChange={handleFormInputChange}
                placeholder="Enter staff number"
              />
            </Form.Group>
      
            <Form.Group controlId="formStaffEmail">
              <Form.Label>Staff Email</Form.Label>
              <Form.Control
                type="text"
                name="staffEmail"
                value={formInputs.staffEmail}
                onChange={handleFormInputChange}
                placeholder="Enter staff email"
              />
            </Form.Group>

            <Form.Group controlId="formIsManager">
            <div style={{display: 'block'}}>
            <Form.Label>Title</Form.Label>
            </div>
            <div>
            <Form.Select
              name="isManager"
              value={formInputs.isManager ? 'Manager' : 'Staff'}
              onChange={handleFormInputChange}
            >
              <option>Manager</option>
              <option>Staff</option>
            </Form.Select>
            </div>
          </Form.Group>
      
            <Button style={{marginTop: "10px"}}variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default EditStaffForm;