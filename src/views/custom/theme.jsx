 import React, { useState, useEffect, useRef,useMemo } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { FaCopy, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrashAlt ,FaEye} from 'react-icons/fa';
import Modal from "react-bootstrap/Modal";
import deleteIcon from "./../../assets/images/delete.png";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ModuleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClass, setSearchClass] = useState(["search-input"]);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => setShow(false);
 
  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const searchOnHandler = () => {
    // Logic for handling search input interactions
  };

//for delete
const handleDelete =(par) => {
  setShow(par);    
}

const handleyesno =async (id) =>{
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/deletetheme/${id}`,{
        method:"DELETE",
    });
    const data = await response.json();
      if (response.ok == true) {
        fetchData();
        setShow('');
        toast.success('Selected data Deleted Successfully');
        setData((prevItems) => prevItems.filter((row) => row._id !== id));

      }else{
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }

  } catch (error) {
    console.log(error);
  }
}

const handleedit = async(id) =>{

  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/getthemedatabyid/${id}`,{
        method:"GET",
    });
    const data = await response.json();

    setfeatures({
        title:data.msg[0].title,
        header:data.msg[0].header,
        slider:data.msg[0].slider,
        usps:data.msg[0].usps,
        about:data.msg[0].about,
        proser:data.msg[0].proser,
        testimonials:data.msg[0].testimonials,
        gallery:data.msg[0].gallery,
        contact:data.msg[0].contact,
        footer:data.msg[0].footer,
      });

    setShow1(true);
    setItemIdToDelete(data.msg[0]._id);
    setErrors('');
  } catch (error) {
    console.log(error);
  }
}
//for datatable
const fetchData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/getlisttheme`);
    if (!response.ok) { 
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json();
    setData(result.msg);

  } catch (error) {
    console.error('Error fetching data:', error);
    console.log('Failed to load data. Please try again later.');
  } 
};

const handleClose1 = async () => {
    setfeatures({
      title:'',
      header:'',
      slider:'',
      usps:'',
      about:'',
      proser:'',
      testimonials:'',
      gallery:'',
      contact:'',
      footer:'',
    });
    setItemIdToDelete('');
    setShow1(false);
  }

//for dropdowns
const [header, setheader] = useState([]);
const [slider, setslider] = useState([]);
const [usps, setusps] = useState([]);
const [about, setabout] = useState([]);
const [proser, setproser] = useState([]);
const [testimonials, settestimonials] = useState([]);
const [gallery, setgallery] = useState([]);
const [contact, setcontact] = useState([]);
const [footer, setfooter] = useState([]);

const fetchdropdowndata = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/getdropdowndata`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json(); 

      setheader(Array.isArray(result.header) ? result.header : []);
      setslider(Array.isArray(result.slider) ? result.slider : []);
      setusps(Array.isArray(result.usps) ? result.usps : []);
      setabout(Array.isArray(result.about) ? result.about : []);
      setproser(Array.isArray(result.proser) ? result.proser : []);
      settestimonials(Array.isArray(result.testimonials) ? result.testimonials : []);
      setgallery(Array.isArray(result.gallery) ? result.gallery : []);
      setcontact(Array.isArray(result.contact) ? result.contact : []);
      setfooter(Array.isArray(result.footer) ? result.footer : []);

    } catch (error) {
      console.error('Error fetching data:', error);
      console.log('Failed to load data. Please try again later.');
    } 
};

//for status
const [show2, setShow2] = useState(false);
const handleClose2 = () => setShow2(false);
const handleShow2 = () => setShow2(true);
const [status, setStatus] = useState({
  status:"",
  id:""
});

const handlestatus = (status, id)=>{
  setStatus({status:status, id:id});
  setShow2(true);
}



useEffect(() => {
  fetchData();
  fetchdropdowndata();
}, []);

  const columns = [
    {
      name: 'Sr No #',
      selector:(row, index) => index + 1,
      sortable: true,
      width: '300px', 
    },
    {
      name: 'Title Name',
      selector:(row) => row.title,
      sortable: true,
    },
    {
      name:"Status",
      selector: (row, index) => row.status =='1'?<span class="toggle" onClick={() => handlestatus(row.status,row._id)}  ><input type="checkbox"  checked id={`toggle-switch-${index}`} /><label for={`toggle-switch-${index}`}></label></span>:<span class="toggle" onClick={() => handlestatus(row.status,row._id)} href="#change-popup" data-bs-toggle="modal"><input type="checkbox"  unchecked id={`toggle-switch-${index}`} /><label for={`toggle-switch-${index}`}></label></span>,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="module-action">
          <button onClick={() => handleedit(row._id)} className="btn btn-action" title="Edit Product">
            <FaEdit />
          </button>

          <a 
            className="btn btn-action"
            title="Delete Product"
            variant="primary"
            onClick={() => handleDelete(row._id)}
          >
            <FaTrashAlt />
          </a>

          <Link to={`https://theme.digihostinfra.com/${row.title}`} className="btn btn-action" target="__blank" title="Theme Module">
            <FaEye />
          </Link>
        </div>
      ),
      style: {
        textAlign: 'right',
      },
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "20px",
      },
    },
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "#e3f2fd",
      },
    },
    pagination: {
      style: {
        display: "flex",
        justifyContent: "flex-end",
        padding: "10px",
      },
      pageButtonsStyle: {
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        padding: "8px",
        margin: "0 5px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  };

  const filteredRows = useMemo(() => {
    return (data || []).filter((row) =>
      row.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

const handlemodal = ()=>{
  setShow1(true)
}

  const handleinput =(e) => {
    let name = e.target.name;
    let value = e.target.value;
      setfeatures({
        ...features,
        [name]:value,
    })
  };

  const [features, setfeatures] = useState({
      title:'',
      header:'',
      slider:'',
      usps:'',
      about:'',
      proser:'',
      testimonials:'',
      gallery:'',
      contact:'',
      footer:'',
  });

  const [errors, setErrors] = useState({});

const handleaddfeature = async (e) => {
    e.preventDefault();

    const newErrors = {}; 
    if (!features.title) newErrors.title = 'Title is required';

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    const id = itemIdToDelete; 
    const requestBody = { ...features };

    try {
        const response = await fetch(
            id
                ? `${import.meta.env.VITE_APP_API_URL}/api/custom/updatetheme/${id}`
                : `${import.meta.env.VITE_APP_API_URL}/api/custom/addtheme`,
            {
                method: id ? "PATCH" : "POST",
                headers: {
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify(requestBody),
            }
        );

        const resData = await response.json();

        if (response.ok) {
            toast.success(resData.msg);
            fetchData();
            setErrors({});
            setfeatures({
                title: '',
                header: '',
                slider: '',
                usps: '',
                about: '',
                proser: '',
                testimonials: '',
                gallery: '',
                contact: '',
                footer: '',
            });
            setShow1(false);
            if (id) setItemIdToDelete("");
        } else {
            toast.error(resData.error || resData.msg);
        }
    } catch (error) {
        console.error("Error in handleaddfeature:", error);
    }
};


  const handlestatus1 = async (status, id ) => {

    if(status == 1){
      status= 0;
    }else{
      status= 1;
    }
    
    try {
      const response1 = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/statustheme/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status}),

      });
    
      const res_data = await response1.json();

      if (response1.ok == true) {
        toast.success(res_data.msg);
        fetchData();
        setStatus({status:"", id:""});
        setShow2(false);
      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
    } catch (error) {
      console.log("status update", error);
    }
  }


  return (
    <Container>
      <Row>
        <Col lg={12}>
          <Card className="create_new_page_card add-module module-list">
            <Card.Header>
              <Row className="justify-content-between">
                <Col md={12}>
                  <h3>Theme List</h3>
                </Col>
                <Col md={6}>
                  <div className="dt-buttons btn-group">
                    <Button onClick={handlemodal} className="btn btn-outline-secondary">
                      {/* <FaCopy style={{ marginRight: "5px" }} /> */}
                      Add Theme
                    </Button>
                  </div>
                </Col>
                <Col md={6} className="text-end">
                  <div className="data_tableHeader">
                    <div id="main-search" className={searchClass.join(" ")}>
                      <div className="input-group" onClick={searchOnHandler}>
                        <span
                          onKeyDown={searchOnHandler}
                          role="button"
                          tabIndex="0"
                          className="input-group-append search-btn"
                          style={{ borderRadius: "50%", marginRight: 15 }}
                        >
                          <i className="feather icon-search input-group-text" />
                        </span>
                        <Form.Control
                          type="text"
                          id="m-search"
                          placeholder="Search Theme Title"
                          value={searchTerm}  
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <DataTable
                columns={columns}
                data={filteredRows}     
                  customStyles={customStyles}
                  pagination
                  responsive
                  striped
                  paginationComponentOptions={{
                    rowsPerPageText: "Rows per page:",
                    rangeSeparatorText: "of",
                    // selectAllRowsItem: true,
                    // selectAllRowsItemText: "All",
                  }}
              />
            
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={show1} onHide={handleClose1} className="other-icon-modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h3>{!itemIdToDelete ?'Add':'Edit'} Theme</h3>
          <form onSubmit={handleaddfeature}>
            <Row>
                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Theme Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={features.title}
                        onChange={handleinput}
                        placeholder="Title"
                    />
                    {errors.title && (
                        <span className="text-danger">{errors.title}</span>
                    )}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select Header</Form.Label>
                    <select className="form-control" onChange={handleinput} name="header" value={features.header}>
                        <option value="">Select Header</option>
                        {Array.isArray(header) &&
                            header.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.header && (
                        <span className="text-danger">{errors.header}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select Slider</Form.Label>
                    <select className="form-control" onChange={handleinput} name="slider" value={features.slider}>
                        <option value="">Select Slider</option>
                        {Array.isArray(slider) &&
                            slider.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.slider && (
                        <span className="text-danger">{errors.slider}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select USPs</Form.Label>
                    <select className="form-control" onChange={handleinput} name="usps" value={features.usps}>
                        <option value="">Select USPs</option>
                        {Array.isArray(usps) &&
                            usps.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.usps && (
                        <span className="text-danger">{errors.usps}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select About</Form.Label>
                    <select className="form-control" onChange={handleinput} name="about" value={features.about}>
                        <option value="">Select About</option>
                        {Array.isArray(about) &&
                            about.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.about && (
                        <span className="text-danger">{errors.about}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select Products/Services</Form.Label>
                    <select className="form-control" onChange={handleinput} name="proser" value={features.proser}>
                        <option value="">Select Products/Services</option>
                        {Array.isArray(proser) &&
                            proser.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.proser && (
                        <span className="text-danger">{errors.proser}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select Testimonials or Post Reviews Options</Form.Label>
                    <select className="form-control" onChange={handleinput} name="testimonials" value={features.testimonials}>
                        <option value="">Select Testimonials or Post Reviews Options</option>
                        {Array.isArray(testimonials) &&
                            testimonials.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.testimonial && (
                        <span className="text-danger">{errors.testimonial}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select Gallery</Form.Label>
                    <select className="form-control" onChange={handleinput} name="gallery" value={features.gallery}>
                        <option value="">Select Gallery</option>
                        {Array.isArray(gallery) &&
                            gallery.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.gallery && (
                        <span className="text-danger">{errors.gallery}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select Contact</Form.Label>
                    <select className="form-control" onChange={handleinput} name="contact" value={features.contact}>
                        <option value="">Select Contact</option>
                        {Array.isArray(contact) &&
                            contact.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.contact && (
                        <span className="text-danger">{errors.contact}</span>
                    )} */}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="search-input mb-1">
                    <Form.Label>Select Footer</Form.Label>
                    <select className="form-control" onChange={handleinput} name="footer" value={features.footer}>
                        <option value="">Select Footer</option>
                        {Array.isArray(footer) &&
                            footer.map((head, index) => (
                            <option key={index} value={head._id}>
                                {head.title}
                            </option>
                            ))}
                    </select>
                    {/* {errors.footer && (
                        <span className="text-danger">{errors.footer}</span>
                    )} */}
                    </div>
                </div>
            </Row>
            <div className="text-center mt-4">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h3>Do you really want to delete the file?</h3>
          <img src={deleteIcon} alt="Delete" />
          <div className="buttons">
            <button className="button-delete" onClick={() => handleyesno(show)}>Yes delete the file</button>
            <button className="button-cancel" onClick={() => handleClose()}>Cancel this time</button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2} className="delete-modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h3>Do you really want to Change the Status?</h3>
          {/* <img src={deleteIcon} alt="Delete" /> */}
          <div className="buttons">
            <button className="button-delete"  onClick={() => handlestatus1(status.status, status.id)}>Yes</button>
            <button className="button-cancel" onClick={() => handleClose2()}>Cancel this time</button>
          </div>
        </Modal.Body>
      </Modal>

    </Container>

    
  );
};

export default ModuleList;
