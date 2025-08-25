import React, { useState, useEffect, useRef, useMemo, } from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { FaCopy, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";

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
    const options = [
        { value: "Number", label: "Number" },
        { value: "Text", label: "Text" },
        { value: "Password", label: "Password" },
    ];

    const [show1, setShow1] = useState(false);

    const handleClose1 = () => setShow1(false);
    const handlemodal = () => {
        setShow1(true)
    }
    const [itemIdToDelete, setItemIdToDelete] = useState(null);
    const [features2, setfeatures] = useState({
        name: "",
        details: "",
        actualinr: "",
        membersinr: "",
        brcoinsinr: "",
        actualusd: "",
        membersusd: "",
        brcoinsusd: "",
    });
    const handleinput2 = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setfeatures({
            ...features2,
            [name]: value,
        })
    };
    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };

    const [packageform, setPackageform] = useState({
        name: "",
        features: [],
        selectedFeatureData: [], // Ensure it starts as an empty array

    });
    const handleinput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPackageform({
            ...packageform,
            [name]: value,
        })
    };

    const [optionscat, setOptions] = useState([]);

    const handleFeatureInputChange = (e, index, field) => {
        const { value } = e.target;
    
        setPackageform(prevState => {
            const updatedFeatureData = prevState.selectedFeatureData.map((feature, i) =>
                i === index ? { ...feature, [field]: value } : feature
            );
    
            return { ...prevState, selectedFeatureData: updatedFeatureData };
        });
    };
    

//get dropdown items

    const fetchOptions = async () => {
        try {

            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/getdataOptions`, {
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
                    details: item["details"]?.trim() || item.details, // Handle space issue
                    actualinr: item["actualinr"]?.trim() || item.actualinr, // Handle space issue
                    membersinr: item["membersinr"]?.trim() || item.membersinr, // Handle space issue
                    brcoinsinr: item["brcoinsinr"]?.trim() || item.brcoinsinr, // Handle space issue

                    actualusd: item["actualusd"]?.trim() || item.actualusd, // Handle space issue
                    membersusd: item["membersusd"]?.trim() || item.membersusd, // Handle space issue
                    brcoinsusd: item["brcoinsusd"]?.trim() || item.brcoinsusd, // Handle space issue

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
        if (!packageform.name) newErrors.name = "Name is required";
        if (!packageform.features) newErrors.features = "Fixed Features are required";
        if (!packageform.task) newErrors.task = "Task is required";
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        const featureDetails = packageform.selectedFeatureData.map((feature) => ({
            id: feature.value,
            itemname: feature.label,
            actualinr: feature.actualinr || "0",
            membersinr: feature.membersinr || "0",
            brcoinsinr: feature.brcoinsinr || "0",
            actualusd: feature.actualusd || "0",
            membersusd: feature.membersusd || "0",
            brcoinsusd: feature.brcoinsusd || "0",

        }));
        const payload = {
            name: packageform.name,
            task: packageform.task,
            features: Array.isArray(packageform.features) ? packageform.features : [], // Fix potential undefined issue
            actualinr: packageform.actualinr,
            membersinr: packageform.membersinr,
            brcoinsinr: packageform.brcoinsinr,
            actualusd: packageform.actualusd,
            membersusd: packageform.membersusd,
            brcoinsusd: packageform.brcoinsusd,
            description: packageform.description,

            featureDetails,  // Include feature details for bulk saving
        };
    
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/addpackage`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload), // Send proper payload
            });
    
            const res_data = await response.json();
    
            if (response.ok) {
                toast.success("Package Added successfully!");
                setErrors("");
                setPackageform({
                    name: "",
                    features: [],
                    selectedFeatureData: [],                 
                       task: "",
                    actualinr: "",
                    membersinr: "",
                    brcoinsinr: "",
                    actualusd: "",
                    membersusd: "",
                    brcoinsusd: "",
                    description: "",
                });
    
                fetchData();
            } else {
                toast.error(res_data.msg);
            }
        } catch (error) {
            console.error("Add Package Error:", error);
          
        }
    };
    
    useEffect(() => {

        fetchOptions();
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
                                            <Form.Label>Package Name</Form.Label>
                                            <Form.Control name="name"
                                                value={packageform.name} onChange={handleinput}
                                                type="text"
                                                placeholder="Enter Package Name"
                                            />
                                            {errors.name && (
                                                <span className="text-danger">{errors.name}</span>
                                            )}
                                        </div>
                                    </Col>

                                    <Col md={6}>
                                        <div className="mb-3">
                                            <Form.Label>Select Task Group</Form.Label>
                                            <Select options={options} name="task"
                                                value={options.find(option => option.value === packageform.task) || null}
                                                onChange={(selectedOption) =>
                                                    setPackageform({
                                                        ...packageform,
                                                        task: selectedOption ? selectedOption.value : "", // Correct way
                                                    })
                                                }
                                            />
                                            {errors.task && (
                                                <span className="text-danger">{errors.task}</span>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={12}>
                                        <div className="mb-3">
                                            <Form.Label>Select Fixed Features</Form.Label>

                                            <Select
                                                options={optionscat}
                                                isMulti // Only enable isMulti for 'Multi Select' type
                                                value={optionscat.filter(option => packageform.features?.includes(option.value)) || []}

                                                name="features"
                                                onChange={(selectedOptions) => {
                                                    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                    const selectedDetails = optionscat.filter(option => selectedValues.includes(option.value));

                                                    setPackageform(prevState => ({
                                                        ...prevState,
                                                        features: selectedValues,
                                                        selectedFeatureData: selectedDetails.map(option => ({
                                                            value: option.value,
                                                            label: option.label,
                                                            actualinr: option.actualinr,  // Default value for input
                                                            membersinr: option.membersinr,  // Default value for input
                                                            brcoinsinr: option.brcoinsinr,  // Default value for input
                                                            actualusd: option.actualusd,
                                                            membersusd: option.membersusd,
                                                            brcoinsusd: option.brcoinsusd,
                                                        })),
                                                    }));
                                                }}
                                                placeholder="Choose..."

                                            />
                                            {errors.features && (
                                                <span className="text-danger">{errors.features}</span>
                                            )}
                                        </div>
                                    </Col>
                                    {packageform.selectedFeatureData.map((feature, index) => (
                                        <Col md={6} key={index}>
                                            <div className="mb-3">
                                                <div className="card_wrapper">
                                                    <div className="info">
                                                        <h3>Feature Name :</h3>
                                                        <h5>{feature.label}</h5>
                                                    </div>
                                                    <div className="info">
                                                        <h3>Actual Price INR :</h3>
                                                        <div>
                                                        <Form.Control
                                                            type="hidden"
                                                            name={`itemid[${index}]`}
                                                            value={feature.value} // Store feature ID
                                                        />
                                                        <Form.Control
                                                            type="text"
                                                            name={`actualinrpackage[${index}]`}
                                                            value={feature.actualinr}
                                                            onChange={(e) => handleFeatureInputChange(e, index, "actualinr")}
                                                            placeholder="Enter INR Price"
                                                        />
                                                        </div>
                                                    </div>

                                                    <div className="info">
                                                        <h3>Members Only Price INR :</h3>
                                                        <div>
                                                        
                                                        <Form.Control
                                                            type="text"
                                                            name={`membersinrpackage[${index}]`}
                                                            value={feature.membersinr}
                                                            onChange={(e) => handleFeatureInputChange(e, index, "membersinr")}
                                                            placeholder="Enter INR Price"
                                                        />
                                                        </div>
                                                    </div>
                                                    <div className="info">
                                                        <h3>BR Coins Price INR :</h3>
                                                        <div>
                                                        
                                                        <Form.Control
                                                            type="text"
                                                            name={`brcoinsinrpackage[${index}]`}
                                                            value={feature.brcoinsinr}
                                                            onChange={(e) => handleFeatureInputChange(e, index, "brcoinsinr")}
                                                            placeholder="Enter INR Price"
                                                        />
                                                        </div>
                                                    </div>
                                                    <div className="info">
                                                        <h3>Actual Price USD :</h3>
                                                        <div>
                                                        <Form.Control
                                                            type="text"
                                                            name={`actualusdpackage[${index}]`}
                                                            value={feature.actualusd}
                                                            onChange={(e) => handleFeatureInputChange(e, index, "actualusd")}
                                                            placeholder="Enter USD Price"
                                                        />
                                                        </div>
                                                    </div>
                                                   

                                                    <div className="info">
                                                        <h3>Members Only USD :</h3>
                                                        <div>
                                                        <Form.Control
                                                            type="text"
                                                            name={`membersusdpackage[${index}]`}
                                                            value={feature.membersusd}
                                                            onChange={(e) => handleFeatureInputChange(e, index, "membersusd")}
                                                            placeholder="Enter USD Price"
                                                        />
                                                        </div>
                                                    </div>


                                                    <div className="info">
                                                        <h3>BR Coins Price USD :</h3>
                                                        <div>
                                                        <Form.Control
                                                            type="text"
                                                            name={`brcoinsusdpackage[${index}]`}
                                                            value={feature.brcoinsusd}
                                                            onChange={(e) => handleFeatureInputChange(e, index, "brcoinsusd")}
                                                            placeholder="Enter USD Price"
                                                        />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Col>
                                    ))}




                                    <Row>
                                        <h5>Pricing</h5>
                                        <h6>INR</h6>

                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>Actual</Form.Label>
                                                    <Form.Control
                                                        type="text"

                                                        value={packageform.actualinr} onChange={handleinput}
                                                        name="actualinr"
                                                        placeholder="Actual"
                                                    />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>MEMBERS ONLY PRICE</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={packageform.membersinr} onChange={handleinput}


                                                        name="membersinr"
                                                        placeholder="MEMBERS ONLY PRICE"
                                                    />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>BR COINS PRICE</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={packageform.brcoinsinr} onChange={handleinput}


                                                        name="brcoinsinr"
                                                        placeholder="BR COINS PRICE"
                                                    />

                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <h6>USD</h6>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>Actual</Form.Label>
                                                    <Form.Control
                                                        type="text"

                                                        value={packageform.actualusd} onChange={handleinput}

                                                        name="actualusd"
                                                        placeholder="Actual"
                                                    />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>MEMBERS ONLY PRICE</Form.Label>
                                                    <Form.Control
                                                        type="text"

                                                        value={packageform.membersusd} onChange={handleinput}

                                                        name="membersusd"
                                                        placeholder="MEMBERS ONLY PRICE"
                                                    />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>BR COINS PRICE</Form.Label>
                                                    <Form.Control
                                                        type="text"

                                                        value={packageform.brcoinsusd} onChange={handleinput}

                                                        name="brcoinsusd"
                                                        placeholder="BR COINS PRICE"
                                                    />

                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={12}>
                                            <div className="mb-3">
                                                <div className="search-input mb-1">
                                                    <Form.Label>Description</Form.Label>
                                                     <Form.Control as="textarea" rows={3}  name="description"
                                                        placeholder="Description"/>

                                                </div>
                                            </div>
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