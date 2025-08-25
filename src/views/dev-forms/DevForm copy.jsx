import React, {  useState, useEffect,} from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import logo from "../../assets/images/auth/logo.png";
import { Link } from "react-router-dom";
import { FaSearch, FaEdit, FaThLarge, FaRegEye } from "react-icons/fa";
import { admin1, admin2, website1, website2 } from "../../images";
import { AiOutlineImport } from "react-icons/ai";
import Switch from "react-switch";
import { toast } from 'react-toastify';
import { DomainVerificationForm } from "./DomainVerificationForm";
import { MdDeleteOutline } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";
import { event } from "jquery";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    plan: "",
    addOns: [],
    billingType: "Monthly",
  });

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 5));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const addOns = checked
        ? [...prev.addOns, value]
        : prev.addOns.filter((addon) => addon !== value);
      return { ...prev, addOns };
    });
  };

  const toggleBillingType = () => {
    setFormData((prev) => ({
      ...prev,
      billingType: prev.billingType === "Monthly" ? "Yearly" : "Monthly",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 5) {
      // Final submission logic
      console.log("Form submitted:", formData);
    } else {
      nextStep();
    }
  };

  // //////////////// Admin Panel Template ///////////////
  const [selectedOption, setSelectedOption] = useState("");
  const [checked, setChecked] = useState(true);
  const [showModuleBlock, setShowModuleBlock] = useState(false); // New state for showing ModuleBlock

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const handleViewStructureClick = async (id) => {
    console.log(id);
    try {
      const response = await fetch(`http://localhost:5000/api/form/gettemfields/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      
      setSwitchesData1(result.tempfields.map(field => ({
        label: field.pagename,   
        id: field.pageid,  
      })));

      setShowModuleBlock(true); // Show ModuleBlock

    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 
  };

  // //////////////// Admin Panel Template ///////////////

  const [businessaccform, setBusinessaccform] = useState({
    compname:"",
    description:"",
    username:"",
    phone:"",
    email:"",
    address:"",
    brand:"",
  });

  const handleinput =(e) => {
    let name = e.target.name;
    let value = e.target.value;

    setBusinessaccform({
        ...businessaccform,
        [name]:value,
    })
  };

  const getDomain = (url) => {
    try {
      const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
      const hostname = parsedUrl.hostname;
      return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  const [errors, setErrors] = useState({});
  const [errors2, setErrors2] = useState({});
  const [pageid, setPageid] = useState([]);
  const [templ, setTempl]= useState();

  const bussacc= JSON.parse(localStorage.getItem("bussacc"));

  const handlesubmitbtn = async (e)=>{
    

    e.preventDefault(); 
    if (step < 5) {
      if(step ==1){
        // nextStep(); 
        if(!bussacc){
          const newErrors = {}; 
          // Check each field and set error messages if missing
          if (!businessaccform.compname) newErrors.compname = 'Company name is required';
          if (!businessaccform.description) newErrors.description = 'Company description is required';
          if (!businessaccform.username) newErrors.username = 'Username is required';
          if (!businessaccform.phone) newErrors.phone = 'Contact number is required';
          if (!businessaccform.email) newErrors.email = 'Email is required';
          if (!businessaccform.address) newErrors.address = 'Address is required';
          if (!businessaccform.brand) newErrors.brand = 'Brand is required';
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
          }else{
            try{
              const response = await fetch(`http://localhost:5000/api/customer/addcust`,{
                  method: "POST",
                  headers:{
                      "Content-Type": "application/json",
                  },
                  body:JSON.stringify(businessaccform),
          
              });
              const res_data = await response.json();
              
              if(response.ok == true){
                localStorage.setItem("bussacc", JSON.stringify(res_data.busid));
                toast.success('Business Account Form Submitted Successfully');
                
                setErrors('');
                  //  setTimeout(() => {
                  //    navigate('/login');
                  //  }, 2000);
                
                nextStep(); 
              }else{
                  toast.error(res_data.extraDetails ? res_data.extraDetails :res_data.msg);
              }
            }catch(error){
                console.log("Add Customer",error);
            }
          }
        }else{
          const newErrors = {}; 
          // Check each field and set error messages if missing
          if (!businessaccform.compname) newErrors.compname = 'Company name is required';
          if (!businessaccform.description) newErrors.description = 'Company description is required';
          if (!businessaccform.username) newErrors.username = 'Username is required';
          if (!businessaccform.phone) newErrors.phone = 'Contact number is required';
          if (!businessaccform.email) newErrors.email = 'Email is required';
          if (!businessaccform.address) newErrors.address = 'Address is required';
          if (!businessaccform.brand) newErrors.brand = 'Brand is required';
          if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
          }else{
            try{
              const response = await fetch(`http://localhost:5000/api/customer/edit/${bussacc}`,{
                  method: "PATCH",
                  headers:{
                      "Content-Type": "application/json",
                  },
                  body:JSON.stringify(businessaccform),
          
              });
              const res_data = await response.json();
              
              if(response.ok == true){
                // localStorage.setItem("bussacc", JSON.stringify(res_data.busid));
                toast.success('Business Account Form Updated Successfully');
                
                setErrors('');
                  //  setTimeout(() => {
                  //    navigate('/login');
                  //  }, 2000);
                
                nextStep(); 
              }else{
                  toast.error(res_data.extraDetails ? res_data.extraDetails :res_data.msg);
              }
            }catch(error){
                console.log("Add Customer",error);
            }
          }
        }
      }else if(step == 4){   
        if(showModuleBlock === false){
          const newErrors2 = {}; 
          if (!templ) newErrors2.templ = 'Template name is required';
          if (Object.keys(newErrors2).length > 0) {
          setErrors2(newErrors2);
          }else{
            try{
              const response = await fetch(`http://localhost:5000/api/form/addtemplate`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({bussacc,templ,pageid}),
          
              });
              const res_data = await response.json();
              
              if(response.ok == true){
                toast.success(res_data.msg);
                localStorage.removeItem('bussacc');

                setErrors2("");
                setCartItems("");
                // setSwitchesData("");
                setTempl('');
                fetchtemplates();
                handleResetClick();
                handleResetStartFromScratchClick();
                setClickedChecks((prev) => ({ ...prev, [res_data.template_id]: !prev[res_data.template_id] }));
                
                // nextStep(); 
              }else{
                  toast.error(res_data.extraDetails ? res_data.extraDetails :res_data.msg);
              }
            }catch(error){
                console.log("Add template",error);
            }
          }
        }
          nextStep(); 
        
      }else{
        nextStep(); 
      }
     
    } 
  }
  
  const handlebusSubmit = async(e) => {
    e.preventDefault();
  };
  const [domain, setDomain] = useState();
  const  handleinputdomain =(event)=>{
    setDomain(event.target.value);
  }
  const [detail1, setDetail1] = useState('');
  const [detail2, setDetail2] = useState('');
  const [detail3, setDetail3] = useState('');
  const [detail4, setDetail4] = useState('');
  const [nameservers, setNameservers] = useState([]);

  const handlesubmitdomain = async(e)=>{
    e.preventDefault();

    const newErrors1 = {}; 
    // Check each field and set error messages if missing
    if (!domain) newErrors1.domainname = 'Domain name is required';

    if (Object.keys(newErrors1).length > 0) {
      setErrors(newErrors1);
    }else{
      try{
        const response = await fetch(`http://localhost:5000/api/dns/getdomaindetails/${getDomain(domain)}`,{
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            },
            // body:JSON.stringify(businessaccform),
    
        });
        
        const res_data = await response.json();
        
        setNameservers(res_data.ns);
        if (res_data.msg) {
          setErrors('');
          const domainDetails = res_data.msg;
          setDetail1(domainDetails.registryDomainId || 'N/A');
          setDetail2(domainDetails.updatedDate || 'N/A');
          setDetail3(domainDetails.creationDate || 'N/A');
          setDetail4(domainDetails.registryExpiryDate || 'N/A');
          // localStorage.removeItem('bussacc')
        } else {
          console.log('No domain details found');
        }
      }catch(error){
          console.log("Submit Domain",error);
      }
    }
   
    
  }

  
  
  const [cartOpen, setCartOpen] = useState(false);

 

  const [showScratchModules, setShowScratchModules] = useState(false);
  const [selectedCards, setSelectedCards] = useState({});
  const [reviewCards, setReviewCards] = useState({});

  const handleSelectCard = (id) => {
    setSelectedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendForReview = (id) => {
    setReviewCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartFromScratchClick = () => {
    setShowScratchModules(true); // Show ScratchModules div on click
  };
  const handleResetStartFromScratchClick = () => {
    setShowScratchModules(false); // Hide ScratchModules div on reset
    console.log("Reset clicked!");
  };
  const [selectAll, setSelectAll] = useState(false); // New state for "Select All"


  const handleResetClick = () => {
    setShowModuleBlock(false); // Show ModuleBlock
    console.log("Reset clicked!");
  };

  // //////////////// Admin Panel Template ///////////////
  // Handle "Select All" toggle
  const handleSelectAllChange = (checked) => {
    setSelectAll(checked);
    const newSwitchStates = {};
    switchesData.forEach((item) => {
      newSwitchStates[item.id] = checked;
    });
    setSwitchStates(newSwitchStates);
  };

  // Handle category selection
  const [isFirstChecked, setIsFirstChecked] = useState(false);
  const [isSendMailChecked, setIsSendMailChecked] = useState(false);

  // Toggle first checkbox state
  const handleFirstCheckboxChange = () => {
    setIsFirstChecked(!isFirstChecked);
  };

  // Toggle second checkbox state if it's enabled
  const handleSendMailCheckboxChange = () => {
    if (isFirstChecked) {
      setIsSendMailChecked(!isSendMailChecked);
    }
  };
  
  const cardData = [
    { id: 1, title: "Real Estate", image: website1 }, // Replace with actual image path
    { id: 2, title: "Dental", image: website2 },
  ];

  const [showMain, setShowMain] = useState(true);
  const handleShowMain = () => {
    setShowMain(!showMain);
  };

  const [cartItems, setCartItems] = useState([]);
  const [switchesData, setSwitchesData] = useState([]);
  const [switchesData1, setSwitchesData1] = useState([]);
 
  // State to keep track of which switches are checked
  const [switchStates, setSwitchStates] = useState(
    switchesData.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );
   
  const removeItem = (id) => {
    setSwitchStates((prevStates) => ({
      ...prevStates,
      [id]: !prevStates[id],
    }));
    setCartItems(cartItems.filter((item) => item.id !== id));
    setPageid(cartItems.filter((item) => item.id !== id));
  };

   const handleChange = (id, label) => {

    setSwitchStates((prevStates) => {
      const newStates = { ...prevStates, [id]: !prevStates[id] };

      // If the switch is now ON (true), add the item to cartItems, else remove it
      if (newStates[id]) {
        setPageid((prevCartItems1) => [
          ...prevCartItems1,
          { id, name: label },
        ]);
        // Add item to cartItems
        setCartItems((prevCartItems) => [
          ...prevCartItems,
          { id, name: label },
        ]);
      } else {
        // Remove item from cartItems
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.id !== id)
        );
        setPageid((prevCartItems1) =>
          prevCartItems1.filter((item) => item.id !== id)
        );
      }

      return newStates;
    });
  };

  const  handlechangetemp =(event)=>{
    setTempl(event.target.value);
  }

  const [cardDatas ,setCardData]= useState([]);

  const fetchtemplates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/form/gettemplates');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    
      const result = await response.json();
      setCardData(result.template.map(field => ({  
            id: field._id,  
            title: field.template_name, 
            image: website1
          })));
        
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 
  };

  const handleSearchtemplate = async(event)=>{
    const val =event.target.value;
    try {
      const response = await fetch(`http://localhost:5000/api/form/getsearchtemplates/${val}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    
      const result = await response.json();
      setCardData(result.template.map(field => ({  
            id: field._id,  
            title: field.template_name, 
            image: website1
          })));
        
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 

  }
  const handleSearchpage = async(event) =>{
    const val =event.target.value;
    if(val ==''){
      fetchtemplates();
    }else{
      try {
        const response = await fetch(`http://localhost:5000/api/form/getpage/${val}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setSwitchesData(result.page.map(field => ({
          label: field.page_name,   
          id: field._id,  
        })));
          
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Failed to load data. Please try again later.');
      } 
    }
  }

  const [clickedChecks, setClickedChecks] = useState({});

  const handleClickedCheck = (id)=> {

    //write api to update 

    
    setClickedChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/form/getall');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        
        setSwitchesData(result.page.map(field => ({
          label: field.page_name,   
          id: field._id,  
        })));
        

      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Failed to load data. Please try again later.');
      } 
    };

    fetchData();
    fetchtemplates();
  }, []);


  return (
    <div className="main-wrapper">
      <div className="formParentWrapper" data-step={step}>
        <div className="steps">
          <div className="sidebar-logo">
            <img className="logo" src={logo} alt="Logo" />
          </div>
          {[1, 2, 3, 4, 5].map((num) => (
            <div
            className="stepInfo"
            key={num}
            onClick={() => {
              if (num === 4) handleResetClick();
              if (num === 4) handleResetStartFromScratchClick();
            }}
          >
            <div
              className={`step ${step === num ? "active" : ""}`}
              data-step={num}
              // onClick={num === 4 ? handleResetClick : null}
            >
              {num}
            </div>
              <div>
                <p className="label">STEP {num}</p>
                <p className="info">
                  {num === 1
                    ? "Business Account"
                    : num === 2
                      ? "Domain Verification"
                      : num === 3
                        ? "Update Name Server"
                        : num === 4
                          ? "Choose Admin Panel Template"
                          : "Choose Front Theme"}
                </p>
              </div>
              {num < 4 && (
                <div className={`${step === num ? "active" : ""}`}></div>
              )}
            </div>
          ))}
        </div>

        <form  className="rightSectionParent">
          <div className="rightSectionWrapper">
            <div
              className={`formContainer ${step === 1 ? "" : "hide"}`}
              data-step="1"
            >
              {/* <BusinessAccountForm onChange={handleInputChange} formData={formData} /> */}
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
                <p className="personalInfo">
                  Please provide your company details.
                </p>

                <Row>
                  <Col lg={12}>
                    <Form onSubmit={handlebusSubmit}>
                      <Row>
                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="CompanyName">
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control type="text" value={businessaccform.compname} onChange={handleinput} name="compname" placeholder="Company Name" />
                            {errors.compname && (
                            <span className="text-danger">{errors.compname}</span>
                          )}
                          </Form.Group>
                        </Col>

                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="CompanyDescription">
                            <Form.Label>Company Description</Form.Label>
                            <Form.Control as="textarea" value={businessaccform.description} onChange={handleinput} name="description" rows={1} placeholder="Add Company Description" />
                            {errors.description && (
                            <span className="text-danger">{errors.description}</span>
                          )}
                          </Form.Group>
                        </Col>

                        <Col lg={6}>
                          <Form.Group className="mb-3" controlId="ClientName">
                            <Form.Label>Client Name</Form.Label>
                            <Form.Control type="text" value={businessaccform.username} onChange={handleinput} name="username" placeholder="Client Name" />
                            {errors.username && (
                            <span className="text-danger">{errors.username}</span>
                          )}
                          </Form.Group>
                        </Col>
                        
                        {/* Contact Numbers Section */}
                        <Col sm={6}>
                        <Form.Group className="mb-3" controlId="ClientName">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control type="text" value={businessaccform.phone} onChange={handleinput} name="phone" placeholder="Contact Number" />
                            {errors.phone && (
                            <span className="text-danger">{errors.phone}</span>
                          )}
                        </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group className="mb-3" controlId="ClientName">
                            <Form.Label>Email Id</Form.Label>
                            <Form.Control type="text" value={businessaccform.email} onChange={handleinput} name="email" placeholder="Email Id" />
                            {errors.email && (
                            <span className="text-danger">{errors.email}</span>
                          )}
                          </Form.Group>
                        </Col>

                        {/* Address Section */}
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="ClientName">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" value={businessaccform.address} onChange={handleinput} name="address" placeholder="Address" />
                            {errors.address && (
                            <span className="text-danger">{errors.address}</span>
                          )}
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <select
                            id="options"
                            name="brand"
                            value={businessaccform.brand}
                            onChange={handleinput}
                            className="form-select"
                            >
                            <option value="" disabled>
                              Select Brand 
                            </option>
                            <option value="BRW">BRW </option>
                            <option value="DH">DH</option>
                          </select>
                          {errors.brand && (
                            <span className="text-danger">{errors.brand}</span>
                          )}
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </div>
            </div>

            <div
              className={`formContainer ${step === 2 ? "" : "hide"}`}
              data-step="2"
            >
              {/* <DomainVerificationForm
                onChange={handleInputChange}
                formData={formData}
              /> */}
              <div className="mainForm">
                <p className="personal">
                  Domain Verification Form{" "}
                  <div class="icon-wrapper">
                    <Link to="/company/create-new-project">
                      <i class="fas fa-home custom-icon">
                        <span class="fix-editor">&nbsp;</span>
                      </i>
                    </Link>
                  </div>
                </p>
                <p className="personalInfo">
                  Please provide your domain details.
                </p>

                <Row>
                  <Col lg={12}>
                    <Form >
                      <Row>
                        <Col lg={12}>
                          <Form.Group className="mb-3" controlId="DomainName">
                            <Form.Label>Enter Domains</Form.Label>
                            <Form.Control
                              type="text"
                              name="domain"
                              placeholder="Enter Domains"
                              onChange={handleinputdomain}
                              value={domain}
                            />
                            {errors.domainname && (
                            <span className="text-danger">{errors.domainname}</span>
                          )}
                          </Form.Group>
                        </Col>

                        <Col lg={12}>
                          <div className="text-start gap-2 d-flex align-items-center buy-btn">
                            <button
                              type="submit"
                              className="btn btn-primary waves-effect waves-light"
                              variant="primary"
                              onClick={handlesubmitdomain}
                            >
                              Verify 
                            </button>
                            or
                            <Link to="/buy-domain">Buy Domain</Link>
                          </div>
                          <div className="details">
                            <h4>Details</h4>
                            <table>
                              <tr className="info">
                                <td>Is the domain correct?:</td>
                                <td>{detail1 !=''? 'Yes':'No'}</td>
                              </tr>
                              <tr className="info">
                                <td>Registry Domain ID:</td>
                                <td>{detail1}</td>
                              </tr>
                              <tr className="info">
                                <td>Updated Date:</td>
                                <td>{detail2}</td>
                              </tr>
                              <tr className="info">
                                <td>Creation Date: </td>
                                <td>{detail3}</td>
                              </tr>
                              <tr className="info">
                                <td>
                                  Registrar Registration Expiration Date:{" "}
                                </td>
                                <td>{detail4}</td>
                              </tr>
                            </table>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </div>
            </div>

            <div
              className={`formContainer ${step === 3 ? "" : "hide"}`}
              data-step="3"
            >
              {/* <UpdateNameserver
                onChange={handleInputChange}
                formData={formData}
              /> */}
              <div className="mainForm">
                <p className="personal">
                  Update Nameserver{" "}
                  <div class="icon-wrapper">
                    <Link to="/company/create-new-project">
                      <i class="fas fa-home custom-icon">
                        <span class="fix-editor">&nbsp;</span>
                      </i>
                    </Link>
                  </div>
                </p>
                <p className="personalInfo">Nameserver list</p>

                <Row>
                  <Col lg={12}>
                    <ul className="custom-list">
                    {nameservers.map((ns, index) => (
                      <li key={index}> <i class="fas fa-chevron-right"></i> {ns}</li>
                    ))}
                      {/* <li>  
                        <i class="fas fa-chevron-right"></i> ns1.digihost.in
                      </li>
                      <li>
                        <i class="fas fa-chevron-right"></i> ns1.digihost.in
                      </li> */}
                    </ul>
                  </Col>
                  <Col lg={12}>
                    <div className="text-start gap-2 d-flex align-items-center buy-btn">
                      <button
                        type="button"
                        className="btn btn-primary waves-effect waves-light"
                        variant="primary"
                      >
                        Verify
                      </button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            <div
              className={`formContainer ${step === 4 ? "" : "hide"}`}
              data-step="4"
            >
              {/* <AdminPanelTemplate
                onChange={handleInputChange}
                formData={formData}
              /> */}
              <div className="admin-template">
                {/* AdminCardBlock with conditional visibility */}
                {!showScratchModules && (
                  <div
                    className={`mainForm ${showModuleBlock ? "hide" : "show"}`}
                    id="AdminCardBlock"
                  >
                    <p className="personal">
                      Choose Admin Panel Template{" "}
                      <div className="icon-wrapper">
                        <Link to="/company/create-new-project">
                          <i className="fas fa-home custom-icon">
                            <span className="fix-editor">&nbsp;</span>
                          </i>
                        </Link>
                      </div>
                    </p>

                    <Row>
                      <Col lg={12}>
                        <Form>
                          <Row>
                            <Col lg={4}>
                              <Form.Group
                                className="mb-3"
                                controlId="DomainName"
                              >
                                <div className="input-group rounded">
                                  <Form.Control
                                    type="text"
                                    name="searchtemplate"
                                    onChange={handleSearchtemplate}
                                    placeholder="Search template by"
                                    className="rounded-start"
                                  />
                                  <span className="input-group-text rounded-end">
                                    <FaSearch />
                                  </span>
                                </div>
                              </Form.Group>
                            </Col>
                            <Col lg={8}>
                              <Row>
                                <div className="form-btn-panel">
                                  {/* <select
                                    id="options"
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                    className="form-select category-form"
                                  >
                                    <option value="" disabled>
                                      Select Category
                                    </option>
                                    <option value="option1">
                                      Corporate Business Templates
                                    </option>
                                    <option value="option2">
                                      Admin Panel Templates
                                    </option>
                                    <option value="option3">
                                      E-commerce Templates
                                    </option>
                                  </select> */}

                                  <div className="text-right m-l-10">
                                    <Link
                                      to="#"
                                      className="create-button btn btn-primary"
                                      onClick={handleStartFromScratchClick}
                                    >
                                      <FaEdit /> Start From Scratch
                                    </Link>
                                  </div>
                                </div>
                              </Row>
                            </Col>
                          </Row>

                          <Row>
                          {cardDatas.map((templateCard) => (
                              <Col lg={4}>
                                <Card
                                  className={`project-card admin-card ${clickedChecks[templateCard.id] ? "selected" : ""}`}
                                >
                                  <div className="card-image-wrapper">
                                    <Card.Img
                                      variant="top"
                                      src={templateCard.image}
                                    />
                                    <div className="overlay">
                                      <div className="button">
                                        <a
                                          href="#"
                                          target="_blank"
                                          className="create-button btn btn-primary"
                                        >
                                          Preview
                                        </a>
                                        <a
                                          onClick={() =>handleViewStructureClick(templateCard.id)}
                                          className="create-button btn btn-primary"
                                        >
                                          View Structure
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                  <Card.Body>
                                    <Card.Title>
                                      {templateCard.title}
                                      <div
                                        style={{ float: "right" }}
                                        className="card-icon"
                                      >
                                        <a
                                          href="#"
                                          title="View"
                                          target="_blank"
                                          className="view-color"
                                        >
                                          <FaRegEye />
                                        </a>
                                        <a
                                          href="#"
                                          onClick={handleViewStructureClick}
                                          title="View Structure"
                                          className="view-color"
                                        >
                                          <FaThLarge />
                                        </a>
                                        <span className="checbox-pos">
                                          <label>
                                            <input
                                              type="checkbox"
                                              checked={
                                                clickedChecks[
                                                  templateCard.id
                                                ] || false
                                              }
                                              onChange={() =>
                                                handleClickedCheck(
                                                  templateCard.id
                                                )
                                              }
                                            />
                                          </label>
                                        </span>
                                      </div>
                                    </Card.Title>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </Form>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* ModuleBlock with conditional visibility */}
                <div
                  className={`mainForm ${showModuleBlock ? "show" : "hide"}`}
                  id="ModuleBlock"
                >
                  <p className="personal">
                    {/* Dental{" "} */}
                    <div className="icon-wrapper">
                      <Link to="/company/create-new-project">
                        <i className="fas fa-home custom-icon">
                          <span className="fix-editor">&nbsp;</span>
                        </i>
                      </Link>
                    </div>
                  </p>
                  <Row>
                    <Col lg={3}>
                      <div className="module-list">
                        <div class="checkboxes module-switch switch-no-bg">
                          <label className="switch-label">
                            <Switch
                              onChange={handleSelectAllChange}
                              checked={selectAll}
                            />
                            <span>Select All</span>
                          </label>
                        </div>
                      </div>
                    </Col>

                    <Col lg={5}></Col>

                    <Col lg={4}>
                      <div className="text-right">
                        <Link
                          to="/dev-forms/details-form"
                          className="create-button btn btn-primary waves-effect waves-light"
                          // onClick={handleStartFromScratchClick}
                        >
                          <AiOutlineImport /> Import Additional Modules
                        </Link>
                      </div>
                    </Col>
                  </Row>
                  <Row className="m-t-30">
                    <Col lg={12}>
                      <div className="module-list">
                        {/* <h3>Dental Modules</h3> */}
                        <div className="checkboxes module-switch">
                          {/* <label>
                  <span>Services</span>
                  <Switch onChange={handleChange} checked={checked} />
                </label> */}
                          {switchesData1.map((switchItem) => (
                            <label key={switchItem.id} className="switch-label">
                              <span>{switchItem.label}</span>
                              <Switch
                                onChange={() => handleChange(switchItem.id,switchItem.label)}
                                checked={switchStates[switchItem.id]}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {showScratchModules && (
                  <div className="SracthModules" id="SracthModules">
                    <Row>
                      <Col lg={3}>
                        <div className="module-list">
                          <div class="checkboxes module-switch switch-no-bg">
                            <label className="switch-label">
                              <Switch
                                onChange={handleSelectAllChange}
                                checked={selectAll}
                              />
                              <span>Select All</span>
                            </label>
                          </div>
                        </div>
                      </Col>
                      <Col lg={5}>
                        <Form.Group className="mb-3" controlId="DomainName">
                          <div className="input-group rounded">
                            <Form.Control
                              type="text"
                              name="searchpage"
                              placeholder="Search modules by"
                              className="rounded-start"
                              onChange={handleSearchpage}
                            />
                            <span className="input-group-text rounded-end">
                              <FaSearch />
                            </span>
                          </div>
                        </Form.Group>
                      </Col>
                      {/* <Col lg={4}>
                        <div
                          className="cart-button btn btn-primary"
                          onClick={() => setCartOpen(!cartOpen)}
                        >
                          {cartOpen ? "Close Modules" : "Show Modules"}
                        </div>
                        {cartOpen && (
                          <div
                            className="cart-overlay"
                            onClick={() => setCartOpen(false)}
                          ></div>
                        )}
                      </Col> */}
                    </Row>
                    <Row className="m-t-30">
                      <Col lg={8}>
                        <div className="module-list">
                          <div className="checkboxes module-switch">
                            {switchesData.map((switchItem) => (
                              <label
                                key={switchItem.id}
                                className="switch-label"
                              >
                                <span>{switchItem.label}</span>
                                <Switch
                                  onChange={() => handleChange(switchItem.id, switchItem.label)}
                                  checked={switchStates[switchItem.id]}
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="module-cart">
                          <div className="cart-panel">
                            <h2>Module List</h2>
                            {cartItems.length > 0 ? (
                              <ul className="cart-list">
                                {cartItems.map((item) => (
                                  <li key={item.id} className="cart-item">
                                    <span>{item.name}</span>
                                    <button
                                      className="delete-button"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <LiaTimesSolid />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="empty-message">
                                Your list is empty.
                              </p>
                            )}
                            <div className="input-bottom">
                              <input
                                type="text"
                                name="temp"
                                value={templ}
                                onChange={handlechangetemp}
                                className="form-control"
                                placeholder="Enter template name"
                              />
                               {errors2.templ && (
                                <span className="text-danger">{errors2.templ}</span>
                              )}
                            
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </div>
            <div
              className={`formContainer ${step === 5 ? "" : "hide"}`}
              data-step="5"
            >
              <div className="mainForm">
                <p className="personal">
                  Choose Front Theme
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

                <Row>
                  <Col lg={12}>
                    <Form>
                      <Row>
                        <Col lg={6}>
                          <p className="personalInfo">
                            Please Choose Front Theme
                          </p>
                        </Col>
                        <Col lg={6}>
                          <Row>
                            <Form.Group className="mb-3" controlId="DomainName">
                              <div className="input-group rounded">
                                <Form.Control
                                  type="text"
                                  placeholder="Search template by"
                                  className="rounded-start"
                                />
                                <span className="input-group-text rounded-end">
                                  <FaSearch />
                                </span>
                              </div>
                            </Form.Group>
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        {cardData.map((card) => (
                          <Col lg={4} key={card.id}>
                            <Card
                              className={`project-card admin-card ${selectedCards[card.id] ? "selected" : ""}`}
                            >
                              <div className="card-image-wrapper">
                                <Card.Img variant="top" src={card.image} />
                                <div className="overlay">
                                  {/* <div className="checbox-pos">

                                    <label>
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedCards[card.id] || false
                                        }
                                        onChange={() =>
                                          handleSelectCard(card.id)
                                        }
                                      />
                                    </label>
                                  </div> */}
                                  <div className="button">
                                    <a
                                      href="#"
                                      target="_blank"
                                      className="create-button btn btn-primary"
                                    >
                                      Preview
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <Card.Body>
                                <Card.Title>
                                  {card.title}
                                  <div style={{ float: "right" }}>
                                    {/* <a
                                      href="#"
                                      title="View"
                                      target="_blank"
                                      className="view-color"
                                    >
                                      <FaRegEye />
                                    </a> */}
                                    <div className="checbox-pos">
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={
                                            selectedCards[card.id] || false
                                          }
                                          onChange={() =>
                                            handleSelectCard(card.id)
                                          }
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </Card.Title>

                                <div>
                                  {/* Independent checkbox for "Send for review" */}
                                  <label className="label-check checbox-size">
                                    <input
                                      type="checkbox"
                                      checked={reviewCards[card.id] || false}
                                      onChange={() =>
                                        handleSendForReview(card.id)
                                      }
                                    />
                                    &nbsp;Send for review
                                  </label>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      <Row>
                        <div>
                          <br />

                          <label class="label-check checbox-size">
                            <input
                              type="checkbox"
                              // checked={isSendMailChecked}
                              onChange={handleSendMailCheckboxChange}
                            />
                            &nbsp;Send mail to client for template approval
                          </label>

                          <br />
                          <button className="btn btn-primary">Skip</button>
                        </div>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className="btnWrapper mt-3">
            <p
              className={`prev ${step === 1 ? "hideBtn" : ""}`}
              onClick={prevStep}
            >
              <a href="#">
                <i className="fas fa-arrow-left"></i> Go Back
              </a>
            </p>
            <button
              type={step === 5 ? "submit" : "button"}
              className="btn btn-primary"
              onClick={handlesubmitbtn}
            >
              {step === 5 ? "Finish" : "Next Step"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
