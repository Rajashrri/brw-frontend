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
  const handleClose1 = () => setShow1(false);
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
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/product/deleteprofea/${id}`,{
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
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/product/getprofeabyid/${id}`,{
        method:"GET",
    });
    const data = await response.json();
    setfeatures({
      name:data.msg[0].name,
      actualinr:data.msg[0].actualinr,
      discountedinr:data.msg[0].discountedinr,
      actualusd:data.msg[0].actualusd,
      discountedusd:data.msg[0].discountedusd,
      details:data.msg[0].details,
      category:data.msg[0].category,
    });
    setShow1(true);
    setItemIdToDelete(data.msg[0]._id)
  } catch (error) {
    console.log(error);
  }
}
//for datatable
const fetchData = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/product/getprofea`);
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
      name: 'Featured Name',
      selector:(row) => row.name,
      sortable: true,
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
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    name:"",
    actualinr:"",
    discountedinr:"",
    actualusd:"",
    discountedusd:"",
    details:"",
    category:"",
  });

  const [errors, setErrors] = useState({});

  const handleaddfeature= async(e)=>{
    e.preventDefault();

    const newErrors = {}; 
    // Check each field and set error messages if missing
    if (!features.name) newErrors.name = 'Name is required';
    if (!features.category) newErrors.category = 'Category is required';
    if (!features.details) newErrors.details = 'Details is required';
    if (!features.actualinr) newErrors.actualinr = 'Actual INR  is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }else{
      const id = itemIdToDelete;
      if(!id){
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/product/addprofea`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(features),
    
        });
          const res_data = await response.json();
                
          if(response.ok == true){
            toast.success(res_data.msg);
            fetchData();
            setErrors('');
            setfeatures({
              name:"",
              actualinr:"",
              discountedinr:"",
              actualusd:"",
              discountedusd:"",
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
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/product/updateprofea/${id}`,{
            method: "PATCH",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(features),
    
        });
          const res_data = await response.json();
                
          if(response.ok == true){
            toast.success(res_data.msg);
            fetchData();
            setErrors('');
            setfeatures({
              name:"",
              actualinr:"",
              discountedinr:"",
              actualusd:"",
              discountedusd:"",
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


  return (
    <Container>
      <Row>
        <Col lg={12}>
          <Card className="create_new_page_card add-module module-list">
            <Card.Header>
              <Row className="justify-content-between">
                <Col md={12}>
                  <h3>Product Features List</h3>
                </Col>
                <Col md={6}>
                  <div className="dt-buttons btn-group">
                    <Button onClick={handlemodal} className="btn btn-outline-secondary">
                      {/* <FaCopy style={{ marginRight: "5px" }} /> */}
                      Add Product Features
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
                          placeholder="Search Feature Name"
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
          <h3>{!itemIdToDelete ?'Add':'Edit'} Product Features</h3>
          <form onSubmit={handleaddfeature}>
            <Row>
                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Feature Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={features.name}
                      onChange={handleinput}
                      name="name"
                      placeholder="Feature Name"
                    />
                    {errors.name && (
                      <span className="text-danger">{errors.name}</span>
                    )}
                  </div>
                </div>
              <Col lg={6}>
                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Actual INR</Form.Label>
                    <Form.Control
                      type="number"
                      value={features.actualinr}
                      onChange={handleinput}
                      name="actualinr"
                      placeholder="Actual INR"
                    />
                    {errors.actualinr && (
                      <span className="text-danger">{errors.actualinr}</span>
                    )}
                  </div>
                </div>
              </Col>  
              <Col lg={6}>
                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Discounted INR</Form.Label>
                    <Form.Control
                      type="number"
                      value={features.discountedinr}
                      onChange={handleinput}
                      name="discountedinr"
                      placeholder="Discounted INR"
                    />
                    {/* {errors.icontitle && (
                      <span className="text-danger">{errors.icontitle}</span>
                    )} */}
                  </div>
                </div>
              </Col>  
              <Col lg={6}>
                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Actual USD</Form.Label>
                    <Form.Control
                      type="text"
                      value={features.actualusd}
                      onChange={handleinput}
                      name="actualusd"
                      placeholder="Actual USD"
                    />
                    {/* {errors.icontitle && (
                      <span className="text-danger">{errors.icontitle}</span>
                    )} */}
                  </div>
                </div>
              </Col>  
              <Col lg={6}>
                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Discounted USD</Form.Label>
                    <Form.Control
                      type="number"
                      value={features.discountedusd}
                      onChange={handleinput}
                      name="discountedusd"
                      placeholder="Discounted USD"
                    />
                    {/* {errors.icontitle && (
                      <span className="text-danger">{errors.icontitle}</span>
                    )} */}
                  </div>
                </div>
              </Col>   
              <div className="mb-3">
                <div className="search-input mb-1">
                  <Form.Label>Select category</Form.Label>
                  <select className="form-control" onChange={handleinput} value={features.category} name="category">
                      <option value="">Select Category</option>
                      <option value="Fixed">Fixed</option>
                      <option value="Basic">Basic</option>
                      <option value="Premium">Premium</option>
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
                <Form.Label>Details</Form.Label>
                <textarea className="form-control" name="details" value={features.details} onChange={handleinput} placeholder="Details"></textarea>
                {errors.details && (
                  <span className="text-danger">{errors.details}</span>
                )}
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
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>

    </Container>

    
  );
};

export default ModuleList;
