import { Form, Button } from "react-bootstrap"
import "./membership.css";
import { Modal } from 'react-bootstrap';

const AddCustomerForm = ({showAdd, handleClose, handleAddSubmit, formInputs, setFormInputs}) => {
  

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
        <Modal className="registerCustomerForm" show={showAdd} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Register New Customer</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
      
            <Form.Group controlId="formStaffName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="customerName"
                value={formInputs.customerName}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>
      
            <Form.Group controlId="formStaffNumber">
              <Form.Label>Number</Form.Label>
              <Form.Control
                type="text"
                name="customerNumber"
                value={formInputs.customerNumber}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>
      
            <Form.Group controlId="formStaffEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                name="customerEmail"
                value={formInputs.customerEmail}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="bcryptpassword"
                name="password"
                value={formInputs.password}
                onChange={handleFormInputChange}
                placeholder=""
              />
            </Form.Group>
      
            <Button style={{marginTop: "10px"}} variant="primary" type="submit">
              Register
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default AddCustomerForm;