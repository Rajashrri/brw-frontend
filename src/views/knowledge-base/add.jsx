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

    const [itemIdToDelete, setItemIdToDelete] = useState(null);

    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };

    const [packageform, setPackageform] = useState({
        title: "",
        category_id: "",
        keywords: "",
        answer: "",

    });
    const handleinput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPackageform({
            ...packageform,
            [name]: value,
        })
    };

    const getdata = async () =>{
        try {

            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/knowledgebase/getdata/${id}`, {
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
                title: firstItem.title, // maybe use `firstItem.title` instead?
                category_id: firstItem.category_id,
                keywords: firstItem.keywords,
                answer: firstItem.answer,
            });
        }
        } catch (error) {
            console.error("Error fetching options:", error);
        }
    }

    const [optionscat, setOptions] = useState([]);
    //get dropdown items
    
    const fetchOptions = async () => {
        try {

            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/knowledgebase/categoryOptions`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const res_data = await response.json();
            const options = Array.isArray(res_data.msg)
                ? res_data.msg.map((item) => ({
                    value: item._id,
                    label: item["name"]?.trim() || item.name,
                }))
                : [];
            setOptions(options);

        } catch (error) {
            console.error("Error fetching options:", error);
        }
    };

   
    const [errors, setErrors] = useState({});

    //for add 

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newErrors = {};
        if (!packageform.title) newErrors.title = "title is required";
        if (!packageform.category_id) newErrors.category_id = "Category is required";
        if (!packageform.keywords) newErrors.keywords = "Keywords is required";
        if (!packageform.answer) newErrors.answer = "Answer is required";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if(isEdit){
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/knowledgebase/edit/${id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(packageform),
                });
        
                const res_data = await response.json();
        
                if (response.ok) {
                    toast.success("Knowledge Base Updated successfully!");
                    setErrors("");
                    fetchData();
    
                } else {
                    toast.error(res_data.msg);
                }
            } catch (error) {
                console.error("Add Package Error:", error);
              
            }
        }else{
            try {
                const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/knowledgebase/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(packageform),
                });
        
                const res_data = await response.json();
        
                if (response.ok) {
                    toast.success("Knowledge Base Added successfully!");
                    setErrors("");
                    setPackageform({
                        title: "",
                        category_id: "",
                        keywords: "",
                        answer: "",
                    });
    
                    fetchData();
    
                } else {
                    toast.error(res_data.msg);
                }
            } catch (error) {
                console.error("Add Package Error:", error);
              
            }
        }
        
    };
    
    useEffect(() => {
        fetchOptions();
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
                                            <Form.Label>Select Category</Form.Label>
                                            <Select options={optionscat} name="category_id"
                                                value={optionscat.find(option => option.value === packageform.category_id) || null}
                                                onChange={(selectedOption) =>
                                                    setPackageform({
                                                        ...packageform,
                                                        category_id: selectedOption ? selectedOption.value : "", 
                                                    })
                                                }
                                            />
                                            {errors.category_id && (
                                                <span className="text-danger">{errors.category_id}</span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Keywords</Form.Label>
                                            <Form.Control
                                                name="keywords"
                                                value={packageform.keywords} onChange={handleinput}
                                                type="text"
                                                placeholder="Keywords"
                                            />
                                            {errors.keywords && (
                                                <span className="text-danger">{errors.keywords}</span>
                                            )}
                                        </div>
                                    </Col>
                                    <Row>
                                       <Col lg={12}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>Answer</Form.Label>
                                                     <Form.Control as="textarea"  value={packageform.answer} onChange={handleinput} rows={3}  name="answer"
                                                        placeholder="Answer"/>

                                                </div>
                                            </div>
                                            {errors.answer && (
                                                <span className="text-danger">{errors.answer}</span>
                                            )}
                                        </Col>
                                    </Row>
                                    <div className="text-end">
                                        <Button
                                            type="submit"
                                            className="waves-effect waves-light"
                                            variant="primary"
                                        >
                                            Submit
                                        </Button>
                                        
                                        <Link to={`/knowledge-base/list`} className="btn btn-outline-secondary" title="Add Knowledge Base">
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