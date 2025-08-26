import React, { useState, useEffect, useRef, useMemo } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { soupherb, gaikwad, ongc, Lotus } from "../../images";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import deleteIcon from "./../../assets/images/delete.png";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const CreateNewProject = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [adminlist, setAdminlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  //for delete
  const handleDelete = (par) => {
    setShow(par);
  };

  //for delete
  const handleyesno = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/Customer/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (response.ok == true) {
        fetchData();
        setShow("");
        toast.success("Selected data Deleted Successfully");
        setData((prevItems) => prevItems.filter((row) => row._id !== id));
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/api/customer/custlist`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setAdminlist(result.msg);
    } catch (error) {
      console.error("Error fetching data:", error);
      console.log("Failed to load data. Please try again later.");
    }
  };

  // Filtered admin list based on the search term
  const filteredAdminlist = adminlist.filter((project) =>
    project.compname.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    fetchData();
    if (!isLoggedIn) {
      navigate("/auth/signin");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="create-new-project mb40">
      {/* <Card>
          <Card.Body>

          </Card.Body>
        </Card> */}
      <Row className="">
        <Col lg={4}>
          <div id="main-search" className="open-search">
            <div className="input-group mt-2">
              <span
                role="button"
                tabIndex="0"
                className="input-group-append search-btn"
                style={{ borderRadius: "50%", marginRight: 15 }}
              >
                <i className="feather icon-search input-group-text" />
              </span>
              <input
                type="text"
                id="m-search"
                className="form-control"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search websites..."
              />
            </div>
          </div>
        </Col>
        <Col lg={2}></Col>
        <Col lg={6}>
          <div className="text-right mt20">
            <Link
              to="/dev-forms/details-form"
              className="create-button btn btn-primary waves-effect waves-light"
            >
              <AiOutlinePlus /> Create New Project
            </Link>
          </div>
        </Col>
      </Row>
      <Row>
        {filteredAdminlist.length > 0 ? (
          filteredAdminlist.map((val) => (
            <Col lg={4} key={val._id}>
              <Card className="project-card">
                <div className="card-image-wrapper">
                  <Card.Img variant="top" src={Lotus} />
                  <div className="overlay">
                    <div className="button">
                      <a
                        href="https://brw-admin-eight.vercel.app"
                        target="_blank"
                        className="create-button btn btn-primary waves-effect waves-light"
                      >
                        Preview
                      </a>
                    </div>
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between">
                    {val.compname}{" "}
                    <div>
                      <a
                        href="https://brw-admin-eight.vercel.app"
                        target="_blank"
                        style={{ float: "right" }}
                        className="view-color"
                      >
                        <FaRegEye />
                      </a>
                      <a
                        className="view-color me-2"
                        title="Delete Product"
                        variant="primary"
                        onClick={() => handleDelete(val._id)}
                      >
                        <FaTrashAlt />
                      </a>

                      <a
                        href={`/edit-project/${val._id}`}
                        className="view-color me-2"
                        title="Edit Project"
                      >
                        <FaEdit />
                      </a>
                    </div>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </Row>
      <Modal show={show} onHide={handleClose} className="delete-modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h3>Do you really want to delete the file?</h3>
          <img src={deleteIcon} alt="Delete" />
          <div className="buttons">
            <button className="button-delete" onClick={() => handleyesno(show)}>
              Yes delete the file
            </button>
            <button className="button-cancel" onClick={() => handleClose()}>
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
    </div>
  );
};

export default CreateNewProject;
