import { Form, Button } from "react-bootstrap"
import "./membership.css";
import { Modal } from 'react-bootstrap';

const EditCustomerForm = ({show, handleClose, handleSubmit, handleSubmitCancel, formInputs, setFormInputs}) => {
  
  const handleFormInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    const name = event.target.name;

    if (name === 'isMembership') {
      setFormInputs({
        ...formInputs,
        [name]: value === 'Member' ? true : false
      });
    } else {
      setFormInputs({
        ...formInputs,
        [name]: value
      });
    }
  };
      
      return (
        <Modal className = "editCustomerForm" show={show} onHide={handleClose}>
        <Modal.Header style={{ background: "none", border: "none" }}>
          <Modal.Title>Edit Customer</Modal.Title>
          <button className="btn-close" onClick={handleClose}>
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
      
            <Form.Group controlId="formCustomerEmail">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control
                type="text"
                name="customerName"
                value={formInputs.customerName}
                onChange={handleFormInputChange}
                placeholder=""
                disabled = {true}
              />
            </Form.Group>
      
            <Form.Group controlId="formCustomerNumber">
              <Form.Label>Customer Number</Form.Label>
              <Form.Control
                type="number"
                name="customerNumber"
                value={formInputs.customerNumber}
                onChange={handleFormInputChange}
                placeholder="019283746"
                disabled = {true}
              />
            </Form.Group>
      
            <Form.Group controlId="formCustomerEmail">
              <Form.Label>Customer Email</Form.Label>
              <Form.Control
                type="text"
                name="customerEmail"
                value={formInputs.customerEmail}
                onChange={handleFormInputChange}
                placeholder="sebastian@gmail.com"
                disabled = {true}
              />
            </Form.Group>
            
            
            <Form.Group controlId="formIsMembership">
                <div style={{display: 'block'}}>
                <Form.Label>Member Status</Form.Label>
                </div>
                {formInputs.isMembership === true &&
                <Form.Control
                name="isMembership"
                value={formInputs.isMembership ? 'Member' : 'Non-member'}
                disabled = {true}
              />}
                {formInputs.isMembership === false &&
                <div>
                <Form.Select
                name="isMembership"
                value={formInputs.isMembership ? 'Member' : 'Non-member'}
                onChange={handleFormInputChange}
                >
                <option>Member</option>
                <option>Non-member</option>
                </Form.Select>
                </div>
                }
                <div>
                <Button style={{marginTop: "10px"}}variant="primary" onClick={handleSubmitCancel}>
                  Cancel
                </Button>
                </div>
            </Form.Group>
            

            <Form.Group controlId="formMembershipType">
            <div style={{display: 'block'}}>
            <Form.Label>Membership Type</Form.Label>
            </div>
            <Form.Select
                name="membershipType"
                onChange={handleFormInputChange}
            >
                <option value="">Please choose an option</option>
                <option disabled={formInputs.membershipType === 'MONTHLY'} value="MONTHLY">MONTHLY</option>
                <option disabled={formInputs.membershipType === 'ANNUAL'} value="ANNUAL">ANNUAL</option>
            </Form.Select>
            </Form.Group>
      
            <Button style={{marginTop: "10px"}}variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

export default EditCustomerForm;