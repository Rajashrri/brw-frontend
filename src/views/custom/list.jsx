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
    const handleClose1 = async () => {
      setfeatures({
        title:'',
        details:'',
        category:'',
        css:'',
        js:'',
      });
      setItemIdToDelete('');
      setShow1(false);
    }
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
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/deletecustom/${id}`,{
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
  const [filepreview, setfilepreview] = useState('');
  const [filepreview1, setfilepreview1] = useState('');

  const handleedit = async(id) =>{

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/getdatabyid/${id}`,{
          method:"GET",
      });
      const data = await response.json();
      setfeatures({
        title:data.msg[0].title,
        details:data.msg[0].details,
        category:data.msg[0].category,
        css:data.msg[0].css,
        js:data.msg[0].js,
      });
      setfilepreview(`${import.meta.env.VITE_APP_API_URL}/custom/${data.msg[0].css}`);
      setfilepreview1(`${import.meta.env.VITE_APP_API_URL}/custom/${data.msg[0].js}`);
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
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/getlist`);
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
      title:"",
      details:"",
      category:"",
      css:"",
      js:""
    });

    const [errors, setErrors] = useState({});

    const handleaddfeature= async(e)=>{
      e.preventDefault();

      const newErrors = {}; 
      // Check each field and set error messages if missing
      if (!features.title) newErrors.title = 'Title is required';
      if (!features.category) newErrors.category = 'Category is required';
      if (!features.details) newErrors.details = 'Details is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
      }else{
        const id = itemIdToDelete;
        const formData = new FormData();
          Object.entries(features).forEach(([key, value]) => {
            formData.append(key, value);
          });
        if(!id){
          try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/addcustom`,{
              method: "POST",
              body:formData,
      
          });
            const res_data = await response.json();
                  
            if(response.ok == true){
              toast.success(res_data.msg);
              fetchData();
              setErrors('');
              setfeatures({
                title:"",
                details:"",
                category:"",
              });
              setShow1(false);
    
            }else{
              toast.error(res_data.msg);
    
            }
          } catch (error) {
            console.log("Add Features",error);
          }
        }else{
          try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/updatecustom/${id}`,{
              method: "PATCH",
              body:formData,
          });
            const res_data = await response.json();
                  
            if(response.ok == true){
              toast.success(res_data.msg);
              fetchData();
              setErrors('');
              setfeatures({
                title:"",
                details:"",
                category:"",
              });
              setShow1(false);
              setItemIdToDelete("");
            }else{
              toast.error(res_data.msg);
    
            }
          } catch (error) {
            console.log("edit Features",error);
          }
        }
      

      }

    }

    const handlestatus1 = async (status, id ) => {

      if(status == 1){
        status= 0;
      }else{
        status= 1;
      }
      
      try {
        const response1 = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/custom/status/${id}`, {
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
                    <h3>Custom List</h3>
                  </Col>
                  <Col md={6}>
                    <div className="dt-buttons btn-group">
                      <Button onClick={handlemodal} className="btn btn-outline-secondary">
                        {/* <FaCopy style={{ marginRight: "5px" }} /> */}
                        Add Custom
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
                            placeholder="Search Custom Title"
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
            <h3>{!itemIdToDelete ?'Add':'Edit'} Custom</h3>
            <form onSubmit={handleaddfeature}>
              <Row>
                
                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Select category</Form.Label>
                    <select className="form-control" onChange={handleinput} value={features.category} name="category">
                        <option value="">Select Category</option>
                        <option value="Header">Header</option>
                        <option value="Slider">Slider</option>
                        <option value="USPs">USPs</option>
                        <option value="About">About</option>
                        <option value="Products/Services">Products/Services</option>
                        <option value="Testimonials or Post Reviews Options">Testimonials or Post Reviews Options</option>
                        <option value="Gallery">Gallery</option>
                        <option value="Contact">Contact</option>
                        <option value="Footer">Footer</option>
                    </select>
                    {/* <Form.Control
                      type="text"
                      value={features.category}
                      onChange={handleinput}
                      name="category"
                      placeholder="Select Category"
                    /> */}
                    {errors.category && (
                      <span className="text-danger">{errors.category}</span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Title</Form.Label>
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
                    <Form.Label>Component Code</Form.Label>
                    <textarea className="form-control" name="details" value={features.details} onChange={handleinput} placeholder="Component Code"></textarea>
                    {errors.details && (
                      <span className="text-danger">{errors.details}</span>
                    )}
                  </div>
                </div>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="PageName">
                    <Form.Label>Css File</Form.Label>
                    <Form.Control type="file" name="css" placeholder="Page Name" 
                    onChange={(e) =>
                      setfeatures({
                        ...features,
                        [e.target.name]: e.target.files[0],
                      })
                    }
                    />
                    {filepreview && <h6>{features.css}</h6>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="PageName">
                    <Form.Label>JS File</Form.Label>
                    <Form.Control type="file" name="js" placeholder="Page Name" 
                    onChange={(e) =>
                      setfeatures({
                        ...features,
                        [e.target.name]: e.target.files[0],
                      })
                    }
                    />
                    {filepreview1 && <h6>{features.js}</h6>}

                  </Form.Group>
                </Col>

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
