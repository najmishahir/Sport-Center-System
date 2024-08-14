import React from 'react';
import {useEffect, useState} from 'react';
import "./membership.css";
import Navbar from "../managerNavbar/ManagerNavbar";
import useFetch from "../hooks/useFetch"
import axios from 'axios';
import EditCustomerForm from "./editCustomerForm";
import AddCustomerForm from "./addCustomerForm";

const MembershipDetails = () => {

    //useFetch Hooks
    const {data:customerData, loading:customerLoading, error:customerError} = useFetch ("http://localhost:4000/api/customer/");
    const {data:membershipData, loading:membershipLoading, error:membershipError} = useFetch ("http://localhost:4000/api/membership/memberships");

    const [customerDetails, setCustomerDetails] = useState()
    const [editableRows, setEditableRows] = useState({});
    const [isEditable, setIsEditable] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const handleClose = () => {
      setShow(false);
      setShowAdd(false);
    }

    useEffect(() => {
      setCustomerDetails(customerData.map((customer) => {
        return {
          ...customer,
          customerId: customer.customerId,
          customerName: customer.customerName,
          customerNumber: customer.customerNumber,
          customerEmail: customer.customerEmail,
          password: customer.password,
          isMembership: customer.isMembership,
          membershipType: customer.membershipType
        };
      }));

    }, [customerData]);

    const [formInputs, setFormInputs] = useState({
      customerId: "",
      customerName: "",
      customerNumber: "",
      customerEmail: "",
      password: "",
      isMembership: "",
      membershipType:"",
    });

//Show edit customer membership form
    const handleShow = (customerId) => {
      const selectedCustomer = customerDetails.find(customer => customer.customerId === customerId);
      setSelectedCustomer(selectedCustomer);
      setShow(true);
      if (selectedCustomer) {
      setFormInputs({
        customerId: selectedCustomer.customerId,
        customerName: selectedCustomer.customerName,
        customerNumber: selectedCustomer.customerNumber,
        customerEmail: selectedCustomer.customerEmail,
        isMembership: selectedCustomer.isMembership,
        membershipType: selectedCustomer.membershipType,
      });
    }
    };

    //Handle submit edit customer membership form
    const handleSubmit = (event) => {
      event.preventDefault();

      if (formInputs.isMembership === true) {
        const hasMembership = membershipData.some(membership => membership.customerId === selectedCustomer.customerId);
        
        if (hasMembership) {
          axios.put(`http://localhost:4000/api/membership/update/${selectedCustomer.customerId}`, {
          membershipType:  formInputs.membershipType
          })
          .then(response => {
          console.log(response.data);
          window.location.reload();
          })
          .catch(error => {
          console.log(error);
          alert('Failed to change membership type')
          });
        } else {
          axios.post(`http://localhost:4000/api/membership/buy/${selectedCustomer.customerId}`, {
          membershipType:  formInputs.membershipType
        })
          .then(response => {
            console.log(response.data);
            window.location.reload();
            })
            .catch(error => {
            console.log(error);
            alert('Please choose membership type')
            })
        }
      }

      handleClose();
    };

    //Handle cancel customer membership form
    const handleSubmitCancel = () => {
      if (window.confirm("Are you sure you want to cancel membership for this customer?")) {
        axios.post(`http://localhost:4000/api/membership/cancel/${selectedCustomer.customerId}`)
        .then(response => {
          console.log(response.data);

          setCustomerDetails((prevState) => {
            const updatedDetails = [...prevState];
            const index = updatedDetails.findIndex(
                (customer) => customer.customerId === selectedCustomer.customerId
            );
            updatedDetails[index].isMembership =  customerDetails.isMembership;
            updatedDetails[index].membershipType =  customerDetails.membershipType;
      
            return updatedDetails;
            });

          handleClose();
          window.location.reload();
          })
          .catch(error => {
          console.log(error);
          alert('Failed to cancel membership')
          });
      }
    };

    //Show register customer  form
    const handleAdd = () => {
      setShowAdd(true);
      if (selectedCustomer) {
      setFormInputs({
        customerName: "",
        customerNumber: "",
        customerEmail: "",
        password: "",
      });
    }
    };


    //Handle submit register customer form
    const handleAddSubmit = (event) => {
      event.preventDefault();

      setCustomerDetails((prevState) => {
        const updatedDetails = [...prevState];
        
        //updatedDetails[index].staffId = formInputs.staffId;
        updatedDetails.customerName = formInputs.customerName;
        updatedDetails.customerNumber = formInputs.customerNumber;
        updatedDetails.customerEmail = formInputs.customerEmail;
        updatedDetails.password =  formInputs.password;
  
        return updatedDetails;

        });
    
      // Send new customer details to backend
      axios.post('http://localhost:4000/api/auth/register', {
        name: formInputs.customerName,
        number: formInputs.customerNumber,
        email: formInputs.customerEmail,
        password: formInputs.password,
      })
        .then(response => {
          console.log(response.data);
          window.location.reload();
        })
        .catch(error => {
          console.log(error);
          alert('Failed to save data');
        });
    
      handleClose();
    };


    //Handle remove customer
    const handleDelete = (customerId) => {
      const selectedCustomer = customerDetails.find(customer => customer.customerId === customerId);
      setSelectedCustomer(selectedCustomer);
      
      if (window.confirm("Are you sure you want to delete this customer?")) {
        axios.delete(`http://localhost:4000/api/customer/${selectedCustomer.customerId}`)
          .then(() => {
            // remove the deleted customer from customer details
            setCustomerDetails(customerDetails.filter(customer => customer.customerId !== selectedCustomer.customerId));
            setIsSaved(true); // set a flag to show that the data has been saved
          })
          .catch(err => console.error('Failed to delete staff', err));
      }
    };
    
    

    return(
        <div>
            <Navbar/>
            <EditCustomerForm 
              show={show}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              handleSubmitCancel={handleSubmitCancel}
              customer={selectedCustomer}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <AddCustomerForm 
              showAdd={showAdd}
              handleClose={handleClose}
              handleAddSubmit={handleAddSubmit}
              formInputs={formInputs}
              setFormInputs={setFormInputs}
            />
            <div  className="customerDetails">
              <div className="customerDetailsTable">
                <h1 className="customerDetailsTitle">Customers</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Customer Number</th>   
                                    <th>Customer Email</th>
                                    <th>Membership Status</th>
                                    <th>Membership Type</th>
                                    <th> </th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {customerDetails && customerDetails.map(({customerId, customerName, customerNumber, customerEmail, isMembership, membershipType }) => (
                                <tr key = {customerId}>
                                    <td>
                                              <span>{customerName}</span>
                                    </td>
                                    <td>
                                              <span>{customerNumber}</span>
                                    </td>
                                    <td>
                                              <span>{customerEmail}</span>
                                    </td>
                                    <td>
                                    {!isEditable ? (
                                      <span>{isMembership ? "Member" : "Non-member"}</span>
                                    ) : (
                                      <select>
                                        <option value={true}>Member</option>
                                        <option value={false}>Non-member</option>
                                      </select>
                                    )}
                                    </td>
                                    <td>
                                              <span>{membershipType}</span>
                                    </td>
                                    <td>
                                    <button className="editCustomerButton" onClick={() => {handleShow(customerId);}}>
                                    {editableRows[customerId] ? "Done" : "Edit"}
                                    </button>
                                    </td>
                                    <td>
                                    <button className="editCustomerButton" onClick={() => {handleDelete(customerId);}}>
                                    {editableRows[customerId] ? "Delete" : "Delete"}
                                    </button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                            <div>
                              <button className="addCustomerButton" onClick={() => { handleAdd();}}>
                                Register Customer
                              </button>
                            </div>
                        </table>
                    </div>
                </div>
        </div>
    )
}

export default MembershipDetails;