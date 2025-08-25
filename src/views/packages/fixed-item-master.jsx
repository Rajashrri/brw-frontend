import React, { useState, useEffect, useRef, useMemo } from "react";
import { Container, Card, Row, Col, Form, Button } from "react-bootstrap";
import { FaCopy, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import Modal from "react-bootstrap/Modal";
import deleteIcon from "./../../assets/images/delete.png";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Switch from "react-switch";
import Select from "react-select";


const ModuleList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchClass, setSearchClass] = useState(["search-input"]);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => setShow(false);
  const [categoryMap, setCategoryMap] = useState({});

  const handleClose1 = () => {
    setShow1(false);
    setItemIdToDelete(null);
    setfeatures({
      name: "",
      category: "",
      details: "",
      actualinr: "",
      membersinr: "",
      brcoinsinr: "",
      actualusd: "",
      membersusd: "",
      brcoinsusd: "",
    });
  };

  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [optionscat, setOptions] = useState([]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const searchOnHandler = () => {
    // Logic for handling search input interactions
  };

  //for delete
  const handleDelete = (par) => {
    setShow(par);
  }
  //get dropdown items

  const fetchOptions = async () => {
    try {

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/categoryOptions`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const res_data = await response.json();
      const options = Array.isArray(res_data.msg)
        ? res_data.msg.map((item) => ({
          value: item._id,
          label: item["name"]?.trim() || item.name, // Handle space issue
        }))
        : [];
      setOptions(options);

    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };
  const handleyesno = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/deleteitem/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok == true) {
        fetchData();
        setShow('');
        toast.success('Selected data Deleted Successfully');
        setData((prevItems) => prevItems.filter((row) => row._id !== id));

      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }

    } catch (error) {
      console.log(error);
    }
  }
  //for edit
  const handleedit = async (id) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/getitemByid/${id}`, {
        method: "GET",
      });
      const data = await response.json();


      setfeatures({
        name: data.msg[0].name,
        category: data.msg[0].category,
        details: data.msg[0].details,
        actualinr: data.msg[0].actualinr,
        membersinr: data.msg[0].membersinr,
        brcoinsinr: data.msg[0].brcoinsinr,
        actualusd: data.msg[0].actualusd,
        membersusd: data.msg[0].membersusd,
        brcoinsusd: data.msg[0].brcoinsusd,
      });
      setItemIdToDelete(data.msg[0]._id)

      setShow1(true);
    } catch (error) {
      console.log(error);
    }
  }
  const handleChange = async (status, id) => {


    if (status == 1) {
      status = 0;
    } else {
      status = 1;
    }
    // Create the updated state manually


    try {
      // Corrected Fetch API call
      const response = await fetch("${import.meta.env.VITE_APP_API_URL}/api/package/update-statusitem", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, id }),
      });
      const res_data = await response.json();

      if (response.ok == true) {
        fetchData();
        toast.success('Fixed Item Status updated Successfully');

      } else {
        toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
      }
    } catch (error) {
      toast.error("Error updating status. Please try again!");
      console.error("Error updating status:", error);
    }
  };


  //for datatable


  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/getCategoryOptionsTable`);
      const data = await response.json();
  
      const categoryData = Array.isArray(data.msg) ? data.msg.reduce((acc, item) => {
        acc[item._id] = item.name; // Create a map of ID -> Name
        return acc;
      }, {}) : {};
  
      setCategoryMap(categoryData);
    } catch (error) {
      console.error("Error fetching category names:", error);
    }
  };
  const fetchData = async () => {

    try {

      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/getdata`, {
        method: "GET",
      });

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
    fetchOptions();
    fetchCategories();
  }, []);

  const columns = [
    {
      name: 'Sr No #',
      selector: (row, index) => index + 1,
      sortable: true,
      width: '300px',
    },

    
    {
      name: 'Category Name',
      selector: (row) => categoryMap[row.category] || "N/A", // ✅ Convert ID to Name
      sortable: true,
    },
    
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: "Current Status",
      selector: (row) => (
        <div className="checkboxes module-switch">
          <label key={row._id} className="switch-label">
            <Switch
              onChange={() => handleChange(row.status, row._id)}
              checked={row.status == 1} // Ensure only 1 shows as ON            
            />
          </label>
        </div>
      ),
      sortable: true,
    },

    {
      name: 'Actions',
      cell: row => (
        <div className="module-action">
          <button onClick={() => handleedit(row._id)} className="btn btn-action" title="Edit Item Master">
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
    return data.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const handlemodal = () => {
    setShow1(true)
  }
  const [features, setfeatures] = useState({
    name: "",
    category: "",
    details: "",
    actualinr: "",
    membersinr: "",
    brcoinsinr: "",
    actualusd: "",
    membersusd: "",
    brcoinsusd: "",
  });
  const handleinput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setfeatures({
      ...features,
      [name]: value,
    })
  };


  const [errors, setErrors] = useState({});

  const handleaddsubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    // Check each field and set error messages if missing
    if (!features.name) newErrors.name = 'Name is required';
    if (!features.category) newErrors.category = 'Category is required';

    if (!features.details) newErrors.details = 'Details is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const id = itemIdToDelete;
      if (!id) {
        try {
          const requestBody = {
            ...features,
            category: features.category, // Ensure category ID is properly set
          };

          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/additem`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),

          });
          const res_data = await response.json();

          if (response.ok == true) {
            handleClose1();
            toast.success('Fixed Item Added successfully!');
            setErrors('');
            setfeatures({
              name: "",
              category: "",
              details: "",
              actualinr: "",
              membersinr: "",
              brcoinsinr: "",
              actualusd: "",
              membersusd: "",
              brcoinsusd: "",
            });

            fetchData();




          } else {
            toast.error(res_data.msg);

          }
        } catch (error) {
          console.log("Add Features", error);
        }
      } else {
        try {
          const requestBody = {
            ...features,
            category: features.category, // Ensure category ID is properly set
          };
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/updateItem/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),

          });
          const res_data = await response.json();

          if (response.ok == true) {


            handleClose1();
            toast.success(`Update succesfully`);
            setErrors('');
            setfeatures({
              name: "",
              category: "",
              details: "",
              actualinr: "",
              membersinr: "",
              brcoinsinr: "",
              actualusd: "",
              membersusd: "",
              brcoinsusd: "",
            });
            fetchData();

          } else {
            toast.error(res_data.msg);

          }
        } catch (error) {
          console.log("edit Features", error);
        }
      }


    }

  }


  return (
    <Container className="list-module-preview">
      <Row>
        <Col lg={12}>
          <Card className="create_new_page_card add-module module-list">
            <Card.Header>
              <Row className="justify-content-between">
                <Col md={12}>
                  <h3>Fixed Item MasterList</h3>
                </Col>
                <Col md={6}>
                  <div className="dt-buttons btn-group">
                    <Button onClick={handlemodal} className="btn btn-outline-secondary">
                      {/* <FaCopy style={{ marginRight: "5px" }} /> */}
                      Add Fixed Item Master
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
          <h3>{!itemIdToDelete ? 'Add' : 'Edit'} Fixed Item Master</h3>
          <form onSubmit={handleaddsubmit}>
            <Row>

              <div className="mb-3">
                <Form.Label>Select Category</Form.Label>

                <Select
                  options={optionscat}
                  name="category"


                  value={optionscat.find(option => option.value === features.category) || null} // Ensure correct selection
                  onChange={(selectedOption) => {
                    console.log("Selected Option:", selectedOption); // Debugging step

                    setfeatures(prevState => ({
                      ...prevState,
                      category: selectedOption ? selectedOption.value : "", // Store only category ID
                    }));
                  }}
                  isClearable
                  placeholder="Choose..."
                />



                {errors.category && (
                  <span className="text-danger">{errors.category}</span>
                )}
              </div>

              <div className="mb-3">
                <div className="search-input mb-1">
                  <Form.Label>Feature Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={features.name || ""}
                    onChange={handleinput}
                    name="name"
                    placeholder="Feature Name"
                  />
                  {errors.name && (
                    <span className="text-danger">{errors.name}</span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="search-input mb-1">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea" rows={6}
                    value={features.details || ""}
                    onChange={handleinput}
                    name="details"
                    placeholder="Description"
                  />
                  {errors.details && (
                    <span className="text-danger">{errors.details}</span>
                  )}
                </div>
              </div>
              <h5> PRICING</h5>
              <h6>INR</h6>
              <Col lg={6}>
                <div className="mb-3">
                  <div className="search-input mb-1">
                    <Form.Label>Actual</Form.Label>
                    <Form.Control
                      type="text"
                      value={features.actualinr || ""}
                      onChange={handleinput}
                      name="actualinr"
                      placeholder="Actual"
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
                    <Form.Label>MEMBERS ONLY PRICE</Form.Label>
                    <Form.Control
                      type="text"
                      value={features.membersinr || ""}
                      onChange={handleinput}
                      name="membersinr"
                      placeholder="MEMBERS ONLY PRICE"
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
                    <Form.Label>BR COINS PRICE</Form.Label>
                    <Form.Control
                      type="text"
                      value={features.brcoinsinr || ""}
                      onChange={handleinput}
                      name="brcoinsinr"
                      placeholder="BR COINS PRICE"
                    />
                    {/* {errors.icontitle && (
                      <span className="text-danger">{errors.icontitle}</span>
                    )} */}
                  </div>
                </div>
              </Col>
              <Row>
                <h6>USD</h6>
                <Col lg={6}>
                  <div className="mb-3">
                    <div className="search-input mb-1">
                      <Form.Label>Actual</Form.Label>
                      <Form.Control
                        type="text"
                        value={features.actualusd || ""}
                        onChange={handleinput}
                        name="actualusd"
                        placeholder="Actual"
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
                      <Form.Label>MEMBERS ONLY PRICE</Form.Label>
                      <Form.Control
                        type="text"
                        value={features.membersusd || ""}
                        onChange={handleinput}
                        name="membersusd"
                        placeholder="MEMBERS ONLY PRICE"
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
                      <Form.Label>BR COINS PRICE</Form.Label>
                      <Form.Control
                        type="text"
                        value={features.brcoinsusd || ""}
                        onChange={handleinput}
                        name="brcoinsusd"
                        placeholder="BR COINS PRICE"
                      />
                      {/* {errors.icontitle && (
                      <span className="text-danger">{errors.icontitle}</span>
                    )} */}
                    </div>
                  </div>
                </Col>
              </Row>
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
