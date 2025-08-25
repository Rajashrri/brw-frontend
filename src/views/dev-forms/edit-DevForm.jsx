import React, {  useState, useEffect,} from "react";
import { Row, Col, Form, Card } from "react-bootstrap";
import logo from "../../assets/images/auth/logo.png";
import { Link, Navigate,useNavigate } from "react-router-dom";
import { FaSearch, FaEdit,FaTrashAlt, FaThLarge, FaRegEye } from "react-icons/fa";
import { admin1, admin2, website1, website2 } from "../../images";
import { AiOutlineImport } from "react-icons/ai";
import Switch from "react-switch";
import { toast } from 'react-toastify';
import { LiaTimesSolid } from "react-icons/lia";
import { event } from "jquery";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import deleteIcon from "./../../assets/images/delete.png";

const MultiStepForm = () => {
  const navigate = useNavigate();
const { id } = useParams();
const [showModal, setShowModal] = useState(false);
const [selectedId, setSelectedId] = useState(null);
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


  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 3) {
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
  const [templateid, settemplateid] = useState("");


  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  

  const handleViewStructureClick = async (id2) => {
    selectemplate(id2);
    settemplateid(id2);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/gettemfields/${id2}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      
      setSwitchesData1(result.tempfields.map(field => ({
        label: field.pagename,   
        id: field.pageid,  
      })));

      setPreids(result.tempfields.map(field => ({
        id: field.pageid,  
      })));
      
      setSwitchStates1(
      switchesData1.reduce((acc, item) => {
        acc[item.id] = true;
        return acc;
      }, {}));
      

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

 
  const [errors, setErrors] = useState({});
  const [errors2, setErrors2] = useState({});
  const [pageid, setPageid] = useState([]);
  const [templ, setTempl]= useState();



const handlesubmitbtn = async (e) => {
  e.preventDefault();

  if (step < 4) {
    // ------------------ STEP 1 ------------------
    if (step === 1) {
      const newErrors = {};
      if (!businessaccform.compname) newErrors.compname = "Company name is required";
      if (!businessaccform.username) newErrors.username = "Username is required";
      if (!businessaccform.phone) newErrors.phone = "Contact number is required";
      if (!businessaccform.email) newErrors.email = "Email is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      } else {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_APP_API_URL}/api/customer/edit/${id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(businessaccform),
            }
          );

          const res_data = await response.json();

          if (response.ok) {
            localStorage.setItem("busid", JSON.stringify(res_data.busid));
            toast.success("Business Account Form Updated Successfully");
            setErrors("");
            nextStep(); // ✅ Go to Step 2
          } else {
            toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.msg);
          }
        } catch (error) {
          console.log("Add Customer", error);
        }
      }
    }

    // ------------------ STEP 2 ------------------
    else if (step === 2) {
      const newErrors2 = {};
      if (!templ && !clickedChecks) newErrors2.templ = "Template is required";

      if (Object.keys(newErrors2).length > 0) {
        setErrors2(newErrors2);
      } else {
        try {
          // ✅ Case 1: User typed a new template (scratch)
          if (templ) {
            const response = await fetch(
              `${import.meta.env.VITE_APP_API_URL}/api/form/addtemplate`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, templ, pageid }),
              }
            );

            const res_data = await response.json();

            if (response.ok) {
              toast.success(res_data.msg);

              // reset
              setErrors2("");
              setCartItems("");
              setTempl("");
              handleResetClick();
              handleResetStartFromScratchClick();

              // re-fetch template list
              await fetchtemplates();

              // auto-select newly created template
              if (res_data.template_id) {
                setClickedChecks(res_data.template_id);
              }

              // ❌ Stay in Step 2 so user can confirm checked template
              return;
            } else {
              toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.msg);
              return;
            }
          }

          // ✅ Case 2: Existing template selected → move forward
          if (clickedChecks) {
            nextStep();
          } else {
            toast.error("Select any one template");
          }
        } catch (error) {
          console.log("Add template", error);
        }
      }
    }



    // ------------------ STEP 3 ------------------
    else if (step === 3) {
      toast.success("Project Updated Successfully ✅");
          setTimeout(() => {
            navigate("/company/create-new-project");
          }, 2000);
    }
  }
};
  
  const handlebusSubmit = async(e) => {
    e.preventDefault();
  };

  const [detail1, setDetail1] = useState('');
  const [detail2, setDetail2] = useState('');
  const [detail3, setDetail3] = useState('');
  const [detail4, setDetail4] = useState('');
  const [nameservers, setNameservers] = useState([]);


    
const handleDelete = (id) => {
  setSelectedId(id); // store which item to delete
  setShowModal(true); // open modal
};

    //for delete
    const handleyesno = async (id) => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/api/form/deletetemp/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();
        if (response.ok == true) {
          fetchData();
           setShowModal(false); // close modal
          toast.success("Selected data Deleted Successfully");
          setData((prevItems) => prevItems.filter((row) => row._id !== id));
        } else {
          toast.error(data.extraDetails ? data.extraDetails : data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };

  
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

  const [ClickedModule, setClickedModule] = useState(false);

  const handleStartFromScratchClick = async(targetModule) => {
    setShowScratchModules(true);

    // preids,templateid

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getadditionalmodules`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({preids}),

      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      
      setSwitchesData2(result.tempfields.map(field => ({
        label: field.page_name,   
        id: field._id,  
      })));

      setClickedModule(targetModule); 

    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 
    
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
  const [switchesData2, setSwitchesData2] = useState([]);
  const [switchesData3, setSwitchesData3] = useState([]);
  const [preids, setPreids] = useState([]);
 
  // State to keep track of which switches are checked
  const [switchStates, setSwitchStates] = useState(
    switchesData.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );

  const [switchStates1, setSwitchStates1] = useState(
    switchesData1.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {})
  );

  const [switchStates2, setSwitchStates2] = useState(
    switchesData3.reduce((acc, item) => {
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
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/gettemplates`);
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
    if(val){
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getsearchtemplates/${val}`);
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
    }else{
      fetchtemplates();
    }
   

  }
  const handleSearchpage = async(event) =>{
    const val =event.target.value;
    if(!val){
      fetchData();
    }else{
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getpage/${val}`);
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

  const getpage1funtion = async() =>{
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getadditionalmodules`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({preids}),

      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      
      setSwitchesData2(result.tempfields.map(field => ({
        label: field.page_name,   
        id: field._id,  
      })));

      // setClickedModule(targetModule); 

    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 
  }

  const handleSearchpage1 = async(event) =>{
    const val =event.target.value;
    if(!val){
      getpage1funtion();
    }else{
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getpage1/${val}`,{
          method: "PATCH",
          headers:{
              "Content-Type": "application/json",
          },
          body:JSON.stringify({preids}),
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setSwitchesData2(result.page.map(field => ({
          label: field.page_name,   
          id: field._id,  
        })));
          
      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Failed to load data. Please try again later.');
      } 
    }
  }

  const [clickedChecks, setClickedChecks] = useState(null);

  const selectemplate = async(id2)=>{
    try{
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/updatetmeplateid`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({id2,id}),
      });

      const result = await response.json();
      if(response.ok){
        // toast.success(result.msg);
        setClickedChecks(id2);
      }

    }catch(error){
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    }
  }
const handleClickedCheck = async (id2) => {
  setClickedChecks(id2);
  await selectemplate(id2); // save in DB
};

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getall`);
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

  const handleChangeimpclt = async(pageId,name)=>{

    try {
      const pageid = pageId;
      const pagename =name;
     
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/inmodagclt`,{
        method:'POST',
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify( {pageid,pagename,id} ),
      })

        const result = await response.json();
        if (response.ok) {
          // Append the new data to preids
          setPreids((prevPreids) => [
            ...prevPreids,
            { id: pageid },
          ]);
          getclientmodules();
          getpage1funtion();
        }
    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    }

  }

  const getclientmodules = async() =>{
    console.log(preids);
    try {
      const bussacc= JSON.parse(localStorage.getItem("bussacc"));

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getclientmodules/${bussacc}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({preids}),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setSwitchesData3(result.page.map(field => ({
        label: field.pagename,   
        id: field.pageid,  
      })));
        
      setSwitchStates2(
        switchesData3.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {}));

       

    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 
    
  }

const fetchCompany = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/customer/getcustbyid2/${id}`);
    const data = await res.json();
    if (data.success && data.data) {
      setBusinessaccform({
        compname: data.data.compname || "",
        description: data.data.description || "",
        username: data.data.username || "",
        phone: data.data.phone || "",
        email: data.data.email || "",
        address: data.data.address || "",
        brand: data.data.brand || ""
      });
       setClickedChecks(data.data.admintemplate_id || null);
    }
  } catch (error) {
    console.error("Error fetching company:", error);
  }
};

useEffect(() => {
  if (id) {
    fetchCompany();
  }
  fetchData();
  fetchtemplates();
  
}, [id]);





  const [isvisible, setisvisible] = useState(true);
  const [prevscrollpos, setprevscrollpos] = useState(0);

  useEffect(() => {
    const handlescroll = () => {
      const currentsrollpos = window.pageYOffset;
      const sectiontop = document.getElementsByClassName("sroll").offsetTop;

      if (currentsrollpos > prevscrollpos) {
        setisvisible(false);
      } else {
        setisvisible(true);
      }

      if (currentsrollpos <= sectiontop) {
        setisvisible(true);
      }
      setprevscrollpos(currentsrollpos);
    };
    window.addEventListener("scroll", handlescroll);
    return () => {
      window.removeEventListener("scroll", handlescroll);
    };
  }, [prevscrollpos]);
  // Search Domain


  return (
    <div className="main-wrapper">
      <div className="formParentWrapper" data-step={step}>
        <div className="steps">
          <div className="sidebar-logo">
            <img className="logo" src={logo} alt="Logo" />
          </div>
          {[1, 2, 3].map((num) => (
            <div
            className="stepInfo"
            key={num}
            onClick={() => {
              if (num === 2) handleResetClick();
              if (num === 2) handleResetStartFromScratchClick();
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
                 Edit Business Account
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
                                      onClick={() => handleStartFromScratchClick("startFromScratch")}
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
                                  className={`project-card admin-card ${clickedChecks === templateCard.id ? "selected" : ""}`}
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
                                         
                                          title="Delete"
                                          onClick={() => handleDelete(templateCard.id)}
                                          target="_blank"
                                          className="view-color"
                                        >
                                          <FaTrashAlt />
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
                                            {/* <input
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
                                            /> */}
                                              <input
                                              type="radio"
                                              name="templateCardRadio" // Ensures mutual exclusivity
                                              checked={
                                                clickedChecks ===
                                                templateCard.id
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
                    {/* <Col lg={3}>
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
                    </Col> */}

                    {/* <Col lg={5}></Col> */}

                    <Col lg={12}>
                      <div className="text-right">
                        {/* <Link
                          to="/dev-forms/details-form"
                          className="create-button btn btn-primary waves-effect waves-light"
                          // onClick={handleStartFromScratchClick}
                        >
                          <AiOutlineImport /> Import Additional Modules
                        </Link> */}

                        <Link
                        
                          className="create-button btn btn-primary waves-effect waves-light"
                          onClick={() =>
                            handleStartFromScratchClick("importModule")
                          }
                        >
                          <AiOutlineImport /> Import Additional Modules
                        </Link>
                        
                      </div>
                    </Col>
                  </Row>
                  <Row className="m-t-30">
                    <Col lg={12}>
                      <div className="module-list">
                       
                        <div className="checkboxes module-switch">
                        
                          {switchesData1.map((switchItem) => (
                            <label key={switchItem.id} className="switch-label">
                              <span>{switchItem.label}</span>
                              <Switch
                                onChange={() => handleChange(switchItem.id,switchItem.label)}
                                checked={switchStates1[switchItem.id]}
                              />
                            </label>
                          ))}
                          {switchesData3.map((switchItem) => (
                            <label key={switchItem.id} className="switch-label">
                              <span>{switchItem.label}</span>
                              <Switch
                                onChange={() => handleChange(switchItem.id,switchItem.label)}
                                checked={switchStates2[switchItem.id]}
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                {showScratchModules && (
                  <div  className={`SracthModules ${ClickedModule === "importModule" ? "import-module" : "start-from-scratch"}`} id="SracthModules">
                      {ClickedModule === "startFromScratch" && (
                        <>
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
                      </>
                      )}
                       {ClickedModule === "importModule" && (
                      <Row className="mt-5">
                        <Col lg={12}>
                          <Row>
                            <Col lg={7} className="ms-auto pe-0">
                              <h4>Additional Module</h4>
                            </Col>
                            <Col lg={5} className="ms-auto pe-0">
                              <Form.Group
                                className="mb-4"
                                controlId="DomainName"
                              >
                                <div className="input-group rounded">
                                  <Form.Control
                                    type="text"
                                     name="searchpage"
                                    onChange={handleSearchpage1}
                                    placeholder="Search modules by"
                                    className="rounded-start"
                                  />
                                  <span className="input-group-text rounded-end">
                                    <FaSearch />
                                  </span>
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={12}>
                          <div className="module-list">
                            <div className="checkboxes module-switch">
                              {switchesData2.map((switchItem) => (
                                <label
                                  key={switchItem.id}
                                  className="switch-label"
                                >
                                  <span>{switchItem.label}</span>
                                  <Switch
                                    onChange={() => handleChangeimpclt(switchItem.id,switchItem.label)}
                                    checked={switchStates[switchItem.id]}
                                  />
                                </label>
                              ))}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div
              className={`formContainer ${step === 3 ? "" : "hide"}`}
              data-step="3"
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
                              className={`project-card admin-card ${clickedChecks === card.id ? "selected" : ""}`}
                            >
                              <div className="card-image-wrapper">
                                <Card.Img variant="top" src={card.image} />
                                <div className="overlay">
                                
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
                                  
                                    <div className="checbox-pos">
                                      <label>
                                       
                                          <input
                                              type="radio"
                                              name="templateCardRadio" // Ensures mutual exclusivity
                                              checked={
                                                clickedChecks ===
                                                card.id
                                              }
                                              onChange={() =>
                                                handleClickedCheck(
                                                  card.id
                                                )
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

<Modal show={showModal} onHide={() => setShowModal(false)} className="delete-modal">
                              <Modal.Header closeButton></Modal.Header>
                              <Modal.Body>
                                <h3>Do you really want to delete the file?</h3>
                                <img src={deleteIcon} alt="Delete" />
                                <div className="buttons">
                                  <button className="button-delete" onClick={() => handleyesno(selectedId)}
>
                                    Yes delete the file
                                  </button>
                                  <button className="button-cancel"  onClick={() => setShowModal(false)}>
                                    Cancel this time
                                  </button>
                                </div>
                              </Modal.Body>
                              {/* <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                  Close
                                </Button>
                                <Button variant="primary" onClick={handleClose}>
                                  Save Changes
                                </Button>
                              </Modal.Footer> */}
                            </Modal>
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
              type={step === 3 ? "submit" : "button"}
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
