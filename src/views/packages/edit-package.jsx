import React, { useState, useEffect, useRef, useMemo, } from "react";
import InputMask from "react-input-mask";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import { FaCopy, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
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
    const { id } = useParams(); // Extract ID from URL
    const [data, setData] = useState([]);
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

    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };
    const [optionscat, setOptions] = useState([]);
    const [newlySelectedFeatures, setNewlySelectedFeatures] = useState([]); // Sirf naye selected features

    const [packageform, setPackageform] = useState({
        name: "",
        task: "",
        features: [],
        selectedFeatureData: [],
        actualinr: "",
        membersinr: "",
        brcoinsinr: "",
        actualusd: "",
        membersusd: "",
        brcoinsusd: "",

        description: "",

    });
    const handleinput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

        setPackageform({
            ...packageform,
            [name]: value,
        })
    };


    //for Select Fixed Features onchange event
    const handleFeatureChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];

        // Get newly selected feature
        const newFeatures = optionscat.filter(option =>
            selectedValues.includes(option.value) && !packageform.features.includes(option.value)
        );

        setPackageform((prevForm) => ({
            ...prevForm,
            features: selectedValues, // Store selected feature IDs
        }));

        setNewlySelectedFeatures((prevFeatures) => {
            // Remove unselected features
            const filteredFeatures = prevFeatures.filter(feature => selectedValues.includes(feature.value));
            // Add new features without duplicates
            return [...filteredFeatures, ...newFeatures];
        });

        // Remove unselected features from `data`
        setData((prevData) => prevData.filter(feature => selectedValues.includes(feature.itemid)));
    };

    //input onchange

    const handleFeatureInputChange = (e, index, field) => {
        const { value } = e.target;

        // `data` ke andar update karna
        setData(prevData =>
            prevData.map((feature, i) =>
                i === index ? { ...feature, [field]: value } : feature
            )
        );

        // `newlySelectedFeatures` ke andar bhi update karna
        setNewlySelectedFeatures(prevFeatures =>
            prevFeatures.map((feature, i) =>
                i === index ? { ...feature, [field]: value } : feature
            )
        );
    };


    //for select item dropdown

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
                    membersusd: item["actualusd"]?.trim() || item.membersusd, // Handle space issue
                    brcoinsusd: item["actualusd"]?.trim() || item.brcoinsusd, // Handle space issue

                }))
                : [];
            setOptions(options);



        } catch (error) {
            console.error("Error fetching options:", error);
        }
    };


    // fetch items 

    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/getItempackges/${id}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const result = await response.json();
            setData(result.msg);

            // Map fetched data into form state
            const selectedFeatureDetails = result.msg.map(item => ({
                packageid: item.packageid, // Ensure featureId exists in response
                itemid: item.itemid, // Ensure featureName exists in response
                itemname: item.itemname, // Ensure featureName exists in response
                actualinrpackage: item.actualinrpackage || "",
                membersinrpackage: item.membersinrpackage || "",
                brcoinsinrpackage: item.brcoinsinrpackage || "",
                actualusdpackage: item.actualusdpackage || "",
                membersusdpackage: item.membersusdpackage || "",
                brcoinsusdpackage: item.brcoinsusdpackage || "",
            }));

            setPackageform(prevState => ({
                ...prevState,
                selectedFeatureData: selectedFeatureDetails, // Set fetched features data
            }));

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    //for Edit Package

    const [errors, setErrors] = useState({});
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!packageform.name) newErrors.name = "Name is required";
        if (!packageform.features || packageform.features.length === 0) newErrors.features = "Fixed Features are required";
        if (!packageform.task) newErrors.task = "Task is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (!id) {
                toast.error("Invalid Package ID");
                return;
            }

            //  Declare featureData properly
            const featureData = data.map(feature2 => ({
                itemname: feature2.itemname,
                itemid: feature2.itemid,
                actualinrpackage: feature2.actualinrpackage || "",
                membersinrpackage: feature2.membersinrpackage || "",
                brcoinsinrpackage: feature2.brcoinsinrpackage || "",
                actualusdpackage: feature2.actualusdpackage || "",
                membersusdpackage: feature2.membersusdpackage || "",
                brcoinsusdpackage: feature2.brcoinsusdpackage || ""
            }));


            const featureData2 = newlySelectedFeatures.map(feature => ({
                itemname: feature.label, // label as name
                itemid: feature.value, // value as ID
                actualinrpackage: feature.actualinr || "", // INR Price
                membersinrpackage: feature.membersinr || "", // INR Price
                brcoinsinrpackage: feature.brcoinsinr || "", // INR Price

                actualusdpackage: feature.actualusd || "", // USD Price
                membersusdpackage: feature.membersusd || "", // USD Price
                brcoinsusdpackage: feature.brcoinsusd || ""  // USD Price

            }));
            // Ensure features is always an array
            const payload = {
                name: packageform.name,
                task: packageform.task,
                features: Array.isArray(packageform.features) ? packageform.features : [],
                actualinr: packageform.actualinr,
                membersinr: packageform.membersinr,
                brcoinsinr: packageform.brcoinsinr,
                actualusd: packageform.actualusd,
                membersusd: packageform.membersusd,
                brcoinsusd: packageform.brcoinsusd,

                description: packageform.description,
                featureData, // Include featureData
                featureData2, // Include featureData
            };

            console.log("Sending request with payload:", payload); // Debugging

            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/editpackage/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const res_data = await response.json();

            if (response.ok) {
                toast.success("Package Updated Successfully!");
                setPackageform({
                    name: packageData.name || "",
                    task: packageData.task || "",
                    features: packageData.features ? packageData.features.split(",") : [],
                    selectedFeatureData: packageData.selectedFeatureData || [],
                    actualinr: packageData.actualinr || "",
                    membersinr: packageData.membersinr || "",
                    brcoinsinr: packageData.brcoinsinr || "",
                    actualusd: packageData.actualusd || "",
                    membersusd: packageData.membersusd || "",
                    brcoinsusd: packageData.brcoinsusd || "",
                    data: packageData.data || [],
                    description: packageData.description || "",
                });
                setNewlySelectedFeatures([]); //  Reset newly selected features after submit

                fetchData(); // Refresh package list
            } else {
                toast.error(res_data.msg);
            }
        } catch (error) {
            console.log("Error updating package:", error);
        }
    };


    const fetchPackageData = async (packageId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/package/getpackageByid/${packageId}`);
            const data = await response.json();

            if (data.msg && data.msg.length > 0) {
                const packageData = data.msg[0];
                setPackageform({
                    name: packageData.name || "",
                    task: packageData.task || "",
                    features: packageData.features ? packageData.features.split(",") : [],
                    selectedFeatureData: packageData.selectedFeatureData || [],
                    actualinr: packageData.actualinr || "",
                    membersinr: packageData.membersinr || "",
                    brcoinsinr: packageData.brcoinsinr || "",
                    actualusd: packageData.actualusd || "",
                    membersusd: packageData.membersusd || "",
                    brcoinsusd: packageData.brcoinsusd || "",
                    description: packageData.description || "",

                });
            } else {
                console.log("No package data found");
            }
        } catch (error) {
            console.log("Error fetching package:", error);
        }
    };


    useEffect(() => {

        fetchOptions();

        if (id) {
            fetchPackageData(id);
        }

        fetchItems();
    }, [id]);
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
                                            <Form.Label>Packagex Name</Form.Label>
                                            <Form.Control name="name"
                                                value={packageform.name}
                                                onChange={(e) => setPackageform({ ...packageform, name: e.target.value })}
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
                                                onChange={handleFeatureChange}

                                                placeholder="Choose..."

                                            />
                                            {errors.features && (
                                                <span className="text-danger">{errors.features}</span>
                                            )}
                                        </div>
                                    </Col>
                                    {data.map((feature2, index) => (
                                        <Col md={6} key={index}>
                                            <div className="mb-3">
                                                <div className="card_wrapper">
                                                    <div className="info">
                                                        <h3>Feature Name :</h3>
                                                        <h5>{feature2.itemname}</h5> {/* Display feature name */}
                                                    </div>
                                                    <div className="info">
                                                        <h3>Actual Price INR :</h3>

                                                        <div>
                                                            <Form.Control
                                                                type="hidden"
                                                                name={`itemid[${index}]`}
                                                                value={feature2.itemid} // Store feature ID
                                                            />
                                                            <Form.Control
                                                                type="text"
                                                                name={`actualinrpackage[${index}]`}
                                                                value={feature2.actualinrpackage} // Show fetched INR price
                                                                onChange={(e) => handleFeatureInputChange(e, index, "actualinrpackage")}
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
                                                                value={feature2.membersinrpackage}
                                                                onChange={(e) => handleFeatureInputChange(e, index, "membersinrpackage")}
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
                                                                value={feature2.brcoinsinrpackage}
                                                                onChange={(e) => handleFeatureInputChange(e, index, "brcoinsinrpackage")}
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
                                                                value={feature2.actualusdpackage} // Show fetched USD price
                                                                onChange={(e) => handleFeatureInputChange(e, index, "actualusdpackage")}
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
                                                                value={feature2.membersusdpackage} // Show fetched USD price
                                                                onChange={(e) => handleFeatureInputChange(e, index, "membersusdpackage")}
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
                                                                value={feature2.brcoinsusdpackage} // Show fetched USD price
                                                                onChange={(e) => handleFeatureInputChange(e, index, "brcoinsusdpackage")}
                                                                placeholder="Enter USD Price"
                                                            />
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </Col>
                                    ))}

                                    {newlySelectedFeatures.map((feature33, index) => (
                                        <Col md={6} key={index}> {/* Remove extra <Col md={12}> to avoid nesting issues */}
                                            <div className="mb-3">
                                                <div className="card_wrapper">
                                                    <div className="info">
                                                        <h3>Feature Name :</h3>
                                                        <h5>{feature33.label}</h5>
                                                    </div>
                                                    <div className="info">
                                                        <h3>Actual Price INR :</h3>
                                                        <div>

                                                            <Form.Control
                                                                type="hidden"
                                                                name={`itemid[${index}]`}
                                                                value={feature33.value}
                                                            />
                                                            <Form.Control
                                                                type="text"
                                                                name={`actualinrpackage[${index}]`}
                                                                value={feature33.actualinr || ""}
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
                                                                value={feature33.membersinr}
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
                                                                value={feature33.brcoinsinr}
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
                                                                value={feature33.actualusd || ""}
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
                                                                value={feature33.membersusd || ""}
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
                                                                value={feature33.brcoinsusd || ""}
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
                                                    <Form.Control as="textarea" rows={3} name="description"
                                                        placeholder="Description"    value={packageform.description} onChange={handleinput}/>
                                                 

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

            </Form >

        </>
    );
};

export default AddModulePreview;