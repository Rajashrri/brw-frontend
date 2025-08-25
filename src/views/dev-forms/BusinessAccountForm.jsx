import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { MdAdd } from 'react-icons/md';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export const BusinessAccountForm = () => {
  // State Hooks
  const [socialLinks, setSocialLinks] = useState([{ socialLink: '' }]);
  const [contactNumbers, setContactNumbers] = useState([{ contact: '' }]);
  const [emailIds, setEmailIds] = useState([{ emailId: '' }]);
  const [addresses, setAddresses] = useState([{ address: '' }]);

  // Add new social link field
  const addSocialLink = () => setSocialLinks([...socialLinks, { socialLink: '' }]);

  // Add new contact number field
  const addContactNumber = () => setContactNumbers([...contactNumbers, { contact: '' }]);

  // Add new email ID field
  const addEmailId = () => setEmailIds([...emailIds, { emailId: '' }]);

  // Add new address field
  const addAddress = () => setAddresses([...addresses, { address: '' }]);

  // Remove social link field
  const removeSocialLink = (index) => {
    const updatedLinks = [...socialLinks];
    updatedLinks.splice(index, 1);
    setSocialLinks(updatedLinks);
  };

  // Remove contact number field
  const removeContactNumber = (index) => {
    const updatedContacts = [...contactNumbers];
    updatedContacts.splice(index, 1);
    setContactNumbers(updatedContacts);
  };

  // Remove email ID field
  const removeEmailId = (index) => {
    const updatedEmails = [...emailIds];
    updatedEmails.splice(index, 1);
    setEmailIds(updatedEmails);
  };

  // Remove address field
  const removeAddress = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  // Handle input changes for social links
  const handleSocialChange = (index, event) => {
    const { name, value } = event.target;
    const updatedLinks = [...socialLinks];
    updatedLinks[index][name] = value;
    setSocialLinks(updatedLinks);
  };

  // Handle input changes for contact numbers
  const handleContactChange = (index, event) => {
    const { name, value } = event.target;
    const updatedContacts = [...contactNumbers];
    updatedContacts[index][name] = value;
    setContactNumbers(updatedContacts);
  };

  // Handle input changes for email IDs
  const handleEmailIdChange = (index, event) => {
    const { name, value } = event.target;
    const updatedEmails = [...emailIds];
    updatedEmails[index][name] = value;
    setEmailIds(updatedEmails);
  };

  // Handle input changes for addresses
  const handleAddressChange = (index, event) => {
    const { name, value } = event.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index][name] = value;
    setAddresses(updatedAddresses);
  };


  const [businessaccform, setBusinessaccform] = useState({
    compname:"",
    description:"",
    username:"",
    phone:"",
    email:"",
    address:"",
  });

  const handleinput =(e) => {
    let name = e.target.name;
    let value = e.target.value;

    setBusinessaccform({
        ...businessaccform,
        [name]:value,
    })
  };

  const [errors, setErrors] = useState({});
  // Form submission
  const validateForm = (data) => {
    const errors = {};


    if (!data.compname  || !data.username || !data.phone || !data.email) {
        errors.compname = 'Company name is required';
        // errors.description ='Company description is required';
        errors.username = 'Username description is required';
        errors.phone = 'Contact Number description is required';
        errors.email = 'Email description is required';
        // errors.address = 'Address description is required';
    }
    else if (!data.description) {
      errors.description ='Description is required';
    }else if (!data.username ) {
      errors.username = 'Username is required';
    } else if (!data.phone) {
        errors.phone = 'Contact Number is required';
    }else if (!data.email) {
      errors.email = 'Email description is required';
    } 
    // else if (!data.address) {
    //   errors.address = 'Address description is required';
    // }
    return errors;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

   
    if (!businessaccform.compname  || !businessaccform.username || !businessaccform.phone || !businessaccform.email) {
      errors.compname = 'Company name is required';
      errors.description ='Company description is required';
      errors.username = 'Username description is required';
      errors.phone = 'Contact Number description is required';
      errors.email = 'Email description is required';
      // errors.address = 'Address description is required';
      setErrors(errors);
  }else{
      try{
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/customer/addcust`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(businessaccform),
    
        });
        const res_data = await response.json();
        
        if(response.ok == true){
          
            
            setBusinessaccform({ 
              compname:"",
              description:"",
              username:"",
              phone:"",
              email:"",
              address:""
            });

            toast.success('Business Account Form Submitted Successfully');
            setErrors('');
            //  setTimeout(() => {
            //    navigate('/login');
            //  }, 2000);
           
        }else{
            toast.error(res_data.extraDetails ? res_data.extraDetails :res_data.message);
        }
      }catch(error){
          console.log("Add Customer",error);
      }
    }

  };

  return (
    <React.Fragment>
      <div className="mainForm">
        <p className="personal">
          Business Account
          <div class="icon-wrapper">
            <Link to="/company/create-new-project">
              <i class="fas fa-home custom-icon">
                <span class="fix-editor">&nbsp;</span>
              </i>
            </Link>
          </div>
          {/* <span className='text-right'>
          <a href="#" class="btn btn-primary btn-home">
  <i class="fas fa-home"></i>
</a></span> */}
        </p>
        <p className="personalInfo">Please provide your company details.</p>

        <Row>
          <Col lg={12}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3" controlId="CompanyName">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control type="text" value={businessaccform.compname} onChange={handleinput} name="compname" placeholder="Company Name" />
                    {errors.compname && (
                    <span className="error-message">{errors.compname}</span>
                  )}
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group className="mb-3" controlId="CompanyDescription">
                    <Form.Label>Company Description</Form.Label>
                    <Form.Control as="textarea" value={businessaccform.description} onChange={handleinput} name="description" rows={1} placeholder="Add Company Description" />
                    {errors.description && (
                    <span className="error-message">{errors.description}</span>
                  )}
                  </Form.Group>
                </Col>

                <Col lg={6}>
                  <Form.Group className="mb-3" controlId="ClientName">
                    <Form.Label>Client Name</Form.Label>
                    <Form.Control type="text" value={businessaccform.username} onChange={handleinput} name="username" placeholder="Client Name" />
                    {errors.username && (
                    <span className="error-message">{errors.username}</span>
                  )}
                  </Form.Group>
                </Col>

                {/* Contact Numbers Section */}
                <Col sm={6}>
                <Form.Group className="mb-3" controlId="ClientName">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control type="text" value={businessaccform.phone} onChange={handleinput} name="phone" placeholder="Contact Number" />
                    {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                  </Form.Group>
                  {/* <Row className="mb-3">
                    {contactNumbers.map((data, index) => (
                      <Col md={12} key={index}>
                        <Form.Group className="position-relative" controlId={`ContactNumber${index}`}>
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Control
                            type="text"
                            onChange={(event) => handleContactChange(index, event)}
                            value={data.contact}
                            name="contact"
                            placeholder="Contact Number"
                          />
                          {contactNumbers.length > 1 && (
                            <Button onClick={() => removeContactNumber(index)} className="remove-field">
                              <RiDeleteBin5Fill />
                            </Button>
                          )}
                          {index === 0 && (
                            <Button onClick={addContactNumber} className="add-button">
                              <MdAdd />
                            </Button>
                          )}
                        </Form.Group>
                      </Col>
                    ))}
                  </Row> */}
                </Col>

                {/* Email Id Section */}
                <Col sm={6}>
                  {/* <Row className="mb-3">
                    {emailIds.map((data, index) => (
                      <Col md={12} key={index}>
                        <Form.Group className="position-relative" controlId={`EmailId${index}`}>
                          <Form.Label>Email ID</Form.Label>
                          <Form.Control
                            type="text"
                            onChange={(event) => handleEmailIdChange(index, event)}
                            value={data.emailId}
                            name="emailId"
                            placeholder="Email ID"
                          />
                          {emailIds.length > 1 && (
                            <Button onClick={() => removeEmailId(index)} className="remove-field">
                              <RiDeleteBin5Fill />
                            </Button>
                          )}
                          {index === 0 && (
                            <Button onClick={addEmailId} className="add-button">
                              <MdAdd />
                            </Button>
                          )}
                        </Form.Group>
                      </Col>
                    ))}
                  </Row> */}
                    <Form.Group className="mb-3" controlId="ClientName">
                    <Form.Label>Email Id</Form.Label>
                    <Form.Control type="text" value={businessaccform.email} onChange={handleinput} name="email" placeholder="Email Id" />
                    {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                  </Form.Group>
                </Col>

                {/* Address Section */}
                <Col sm={6}>
                  {/* <Row className="mb-3">
                    {addresses.map((data, index) => (
                      <Col md={12} key={index}>
                        <Form.Group className="position-relative" controlId={`Address${index}`}>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            onChange={(event) => handleAddressChange(index, event)}
                            value={data.address}
                            name="address"
                            placeholder="Address"
                          />
                          {addresses.length > 1 && (
                            <Button onClick={() => removeAddress(index)} className="remove-field">
                              <RiDeleteBin5Fill />
                            </Button>
                          )}
                          {index === 0 && (
                            <Button onClick={addAddress} className="add-button">
                              <MdAdd />
                            </Button>
                          )}
                        </Form.Group>
                      </Col>
                    ))}
                  </Row> */}
                  <Form.Group className="mb-3" controlId="ClientName">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" value={businessaccform.address} onChange={handleinput} name="address" placeholder="Address" />
                    {errors.address && (
                    <span className="error-message">{errors.address}</span>
                  )}
                  </Form.Group>
                </Col>
              </Row>
              <button
                  type="submit"

                >
                  Add
                  </button>
            </Form>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};
