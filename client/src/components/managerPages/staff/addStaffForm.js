import { Form, Button } from "react-bootstrap"
import axios from 'axios'
import {useContext, useState} from 'react';
import "./staff.css";
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

const AddStaffForm = ({showAdd, handleClose, handleAddSubmit, formInputs, setFormInputs}) => {
  

      const handleFormInputChange = (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        const name = event.target.name;

        setFormInputs({
          ...formInputs,
          [name]: value
        });
      }
      
      return (
        <Modal className = "addStaffForm" show={showAdd} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Add New Staff</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
      
            <Form.Group controlId="formStaffName">
              <Form.Label>Staff Name</Form.Label>
              <Form.Control
                type="text"
                name="staffName"
                value={formInputs.staffName}
                onChange={handleFormInputChange}
                placeholder="Enter staff name"
              />
            </Form.Group>
      
            <Form.Group controlId="formStaffNumber">
              <Form.Label>Staff Number</Form.Label>
              <Form.Control
                type="text"
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

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="bcryptpassword"
                name="password"
                value={formInputs.password}
                onChange={handleFormInputChange}
                placeholder="Enter staff password"
              />
            </Form.Group>

            <Form.Group controlId="formIsManager">
            <div style={{display: 'block'}}>
            <Form.Label>Title</Form.Label>
            </div>
            <div>
            <Form.Select
              name="isManager"
              value={formInputs.isManager}
              onChange={handleFormInputChange}
            >
              <option value="">Please select an option</option>
              <option value={true} >Manager</option>
              <option value={false}>Staff</option>
            </Form.Select>
            </div>
          </Form.Group>
      
            <Button style={{marginTop: "10px"}} variant="primary" type="submit">
              Add New Staff
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default AddStaffForm;