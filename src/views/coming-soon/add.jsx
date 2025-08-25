import React, { useState, useEffect, useRef, useMemo, } from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { FaCopy, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import {
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
    FormControl,
} from "react-bootstrap";

const AddModulePreview = () => {
    const { id } = useParams();
    const isEdit = !!id;

    const [show1, setShow1] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handlemodal = () => {
        setShow1(true)
    }

    const [packageform, setPackageform] = useState({
        pagename: "",
        title: "",
        subtitle:"",
        date: "",
        bgimage: "",
        logo: "",
        email: "",
        contact: "",
        location: "",
    });

    const handleinput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPackageform({
            ...packageform,
            [name]: value,
        })
    };

      const [filepreview, setfilepreview] = useState('');
      const [filepreview1, setfilepreview1] = useState('');
    
    const getdata = async () =>{
        try {

            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/comingsoon/getdata/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const res_data = await response.json();
            const firstItem = Array.isArray(res_data.msg) && res_data.msg.length > 0
            ? res_data.msg[0]
            : null;
        
        if (firstItem) {
            setPackageform({
                pagename: firstItem.pagename,
                title: firstItem.title,
                subtitle:firstItem.subtitle,
                date: firstItem.date,
                email: firstItem.email,
                contact: firstItem.contact,
                location: firstItem.location,
            });
            setfilepreview(`${import.meta.env.VITE_APP_API_URL}/comingsoon/${firstItem.bgimage}`);
            setfilepreview1(`${import.meta.env.VITE_APP_API_URL}/comingsoon/${firstItem.logo}`);

        }
        } catch (error) {
            console.error("Error fetching options:", error);
        }
    }

   
    const [errors, setErrors] = useState({});

    //for add 

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newErrors = {};
        

        const formData = new FormData();
            Object.entries(packageform).forEach(([key, value]) => {
                formData.append(key, value);
            });
        if(isEdit){
            if (!packageform.pagename) newErrors.pagename = "Page name is required";
            if (!packageform.title) newErrors.title = "Title is required";
            if (!packageform.subtitle) newErrors.subtitle = "Subtitle is required";
            if (!packageform.date) newErrors.date = "Date is required";
            if (!packageform.email) newErrors.email = "Email is required";
            if (!packageform.contact) newErrors.contact = "Contact is required";
            if (!packageform.location) newErrors.location = "location is required";
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/comingsoon/edit/${id}`, {
                    method: "PATCH",
                    body: formData,
                });
        
                const res_data = await response.json();
        
                if (response.ok) {
                    toast.success("Knowledge Base Updated successfully!");
                    setErrors("");
                    getdata();
    
                } else {
                    toast.error(res_data.msg);
                }
            } catch (error) {
                console.error("Add Package Error:", error);
              
            }
        }else{
            if (!packageform.pagename) newErrors.pagename = "Page name is required";
            if (!packageform.title) newErrors.title = "Title is required";
            if (!packageform.subtitle) newErrors.subtitle = "Subtitle is required";
            if (!packageform.date) newErrors.date = "Date is required";
            if (!packageform.email) newErrors.email = "Email is required";
            if (!packageform.contact) newErrors.contact = "Contact is required";
            if (!packageform.location) newErrors.location = "location is required";
            if (!packageform.bgimage) newErrors.bgimage = "Image is required";
            if (!packageform.logo) newErrors.logo = "Logo is required";
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/comingsoon/add`, {
                    method: "POST",
                    body: formData,
                });
        
                const res_data = await response.json();
        
                if (response.ok) {
                    toast.success("Coming Soon Added successfully!");
                    setErrors("");
                    setPackageform({
                        pagename: "",
                        title: "",
                        subtitle:"",
                        date: "",
                        bgimage: "",
                        email: "",
                        contact: "",
                        location: "",
                    });
    
                } else {
                    toast.error(res_data.msg);
                }
            } catch (error) {
                console.error("Add Package Error:", error);
              
            }
        }
        
    };
    
    useEffect(() => {
        if(isEdit){
            getdata();
        }
    }, []);
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-5 form-templates">
                    <Col lg={12}>
                        <Card>
                            <Card.Body>
                                <Row className="mb-3 align-items-center">
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Page Title</Form.Label>
                                            <Form.Control name="pagename"
                                                value={packageform.pagename} onChange={handleinput}
                                                type="text"
                                                placeholder="Enter Title"
                                            />
                                            {errors.pagename && (
                                                <span className="text-danger">{errors.pagename}</span>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="PageName">
                                            <Form.Label>Background Image</Form.Label>
                                            <Form.Control type="file" name="bgimage" placeholder="Background Image" 
                                            onChange={(e) =>
                                                setPackageform({
                                                ...packageform,
                                                bgimage: e.target.files[0],
                                            })
                                            }
                                            />
                                            
                                            {errors.bgimage && (
                                                <span className="text-danger">{errors.bgimage}</span>
                                            )}
                                            {filepreview && 
                                            <img src={filepreview} alt="" height="100px" width="100px"/>
                                            }

                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="PageName">
                                            <Form.Label>Logo</Form.Label>
                                            <Form.Control type="file" name="logo" placeholder="Background Image" 
                                            onChange={(e) =>
                                                setPackageform({
                                                ...packageform,
                                                logo: e.target.files[0],
                                            })
                                            }
                                            />
                                            
                                            {errors.logo && (
                                                <span className="text-danger">{errors.logo}</span>
                                            )}
                                            {filepreview1 && 
                                            <img src={filepreview1} alt="" height="100px" width="100px"/>
                                            }

                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control name="title"
                                                value={packageform.title} onChange={handleinput}
                                                type="text"
                                                placeholder="Enter Title"
                                            />
                                            {errors.title && (
                                                <span className="text-danger">{errors.title}</span>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Sub Title</Form.Label>
                                            <Form.Control name="subtitle"
                                                value={packageform.subtitle} onChange={handleinput}
                                                type="text"
                                                placeholder="Enter subtitle"
                                            />
                                            {errors.subtitle && (
                                                <span className="text-danger">{errors.subtitle}</span>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Date</Form.Label>
                                            <Form.Control name="date"
                                                value={packageform.date} onChange={handleinput}
                                                type="date"
                                                placeholder="Enter Title"
                                            />
                                            {errors.date && (
                                                <span className="text-danger">{errors.date}</span>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Email ID</Form.Label>
                                            <Form.Control
                                                name="email"
                                                value={packageform.email} onChange={handleinput}
                                                type="text"
                                                placeholder="Enter Email"
                                            />
                                            {errors.email && (
                                                <span className="text-danger">{errors.email}</span>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Contact Number</Form.Label>
                                            <Form.Control
                                                name="contact"
                                                value={packageform.contact} onChange={handleinput}
                                                type="text"
                                                placeholder="Enter Contact Number"
                                            />
                                            {errors.contact && (
                                                <span className="text-danger">{errors.contact}</span>
                                            )}
                                        </div>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                name="location"
                                                value={packageform.location} onChange={handleinput}
                                                type="text"
                                                placeholder="Enter Location"
                                            />
                                            {errors.location && (
                                                <span className="text-danger">{errors.location}</span>
                                            )}
                                        </div>
                                    </Col>

                                    <div className="text-end">
                                        <Button
                                            type="submit"
                                            className="waves-effect waves-light"
                                            variant="primary"
                                        >
                                            Submit
                                        </Button>
                                        
                                        <Link to={`/coming-soon/list`} className="btn btn-outline-secondary" title="Add Knowledge Base">
                                        Back
                                        </Link>
                                    </div>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Form>
        </>
    );
};

export default AddModulePreview;