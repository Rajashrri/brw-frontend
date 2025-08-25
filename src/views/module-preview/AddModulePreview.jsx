import React from "react";
import { useState,useEffect } from "react";
import TextEditor from "./TextEditor";
import InputMask from "react-input-mask";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useParams, useNavigate } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
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
  const isPreview = !!id;

  const [fields, setFields] = useState([]);
  const [pages, setRows] = useState();

  const getdatabyid= async () => {
    try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/get/${id}`,{
        method:"GET",
    });
    const data = await response.json();
    
    setRows(data.page[0].page_name);
    setFields(data.fields);
                       
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  useEffect(()=>{
  if(isPreview){
   getdatabyid();
    fetchPageOptions();
  
  }
   fetchPageOptions();
}, [isPreview, id]);

const formatString = (str) => {
  if (!str) return "";

  return str
    .replace(/_/g, " ") 
    .replace(/\b\w/g, (char) => char.toUpperCase()); 
};

  const options = [
    { value: "Number", label: "Number" },
    { value: "Text", label: "Text" },
    { value: "Password", label: "Password" },
  ];
    const [pageOptions, setPageOptions] = useState([]);
   const [selectedPage, setSelectedPage] = useState(null);
  const [tableData, setTableData] = useState([]);



  const [dropdownOptions, setDropdownOptions] = useState([]);

const handlePageChange = async (selectedOption) => {
  setSelectedPage(selectedOption);

  // Fetch specific field data from selected table
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_API_URL}/api/form/getTableFieldData/${selectedOption.value}/title`
    );
    const res_data = await response.json();

    // Assuming res_data.data is an array of strings
    const options = res_data.data.map((item) => ({
      label: item,
      value: item,
    }));
    setDropdownOptions(options); // use in second dropdown
  } catch (error) {
    console.error("Error fetching field data:", error);
  }
};
const fetchPageOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getPageOptions`);
      const res_data = await response.json();
      const options = Array.isArray(res_data.msg)
        ? res_data.msg.map((page) => ({
            value: page.table_name,
            label: page.page_name || page.table_name,
          }))
        : [];
      setPageOptions(options);
    } catch (error) {
      console.error("Error fetching page options:", error);
    }
  };

 
  const multipleOptions = [
    { value: "Number", label: "Number" },
    { value: "Text", label: "Text" },
    { value: "Password", label: "Password" },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };

  const [dateMMDDYYYY, setDateMMDDYYYY] = useState("");
  const [dateDDMMYYYY, setDateDDMMYYYY] = useState("");
  const [creditCardNumber, setCreditCardNumber] = useState("");

  const [rangeValue, setRangeValue] = useState(50); // Default value for the range

  const handleRangeChange = (e) => {
    setRangeValue(e.target.value);
  };

  const [color, setColor] = useState("#24786f"); // Default color

  const handleColorChange = (e) => {
    setColor(e.target.value); // Update the color state
  };

  const [startDate, setStartDate] = useState(new Date());
  return (
    <>
      <Row className="mb-5 form-templates">
        <Col lg={12}>
          <Card>
            <Card.Body>
              <Row className="mb-3 align-items-center">
              {
                fields.map((field, index) => (
                  <React.Fragment key={index}>
                    {field.fields_type === 'Text' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder={`Enter ${formatString(field.fields_name)}`}
                          />
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Password' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control required type="password" />
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Number' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control required type="number" value="42" />
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'DatePicker' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <div className="w-100">
                            <DatePicker
                              selected={startDate}
                              className="form-control"
                              onChange={(date) => setStartDate(date)}
                            />
                          </div>
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Single Select' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Select
  options={dropdownOptions}
  value={dropdownOptions.find((opt) => opt.value === field.dropdown)}
  onChange={(selectedOption) => handleChange(index, selectedOption, "dropdown")}
/>
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Dropdown1' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Select
                            options={multipleOptions}
                            isMulti
                            value={selectedOptions}
                            onChange={handleChange}
                            placeholder="Choose..."
                          />
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Textarea' && (
                      <Col md={6}>
                        <div className="mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control as="textarea" rows={3} />
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'file' && (
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="PageName">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <Form.Control type="file" placeholder="Page Name" />
                        </Form.Group>
                      </Col>
                    )}
                    {field.fields_type === 'CheckBox' && (
                      <Col md={6}>
                        <div className="Checkboxes-left mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              inline
                              label="Checkbox"
                              name="group1"
                              type="checkbox"
                              id="checkbox-1"
                            />
                            <Form.Check
                              inline
                              label="Checkbox checked"
                              name="group1"
                              type="checkbox"
                              defaultChecked
                              id="checkbox-2"
                            />
                          </div>
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Radio' && (
                      <Col md={6}>
                        <div className="Checkboxes-left mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Check
                              inline
                              label="Radio"
                              name="group1"
                              type="radio"
                              id="radio-1"
                            />
                            <Form.Check
                              inline
                              label="Radio checked"
                              name="group1"
                              type="radio"
                              defaultChecked
                              id="radio-2"
                            />
                          </div>
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Switch' && (
                      <Col md={6}>
                        <div className="switch mb-3">
                          <Form.Label>{formatString(field.fields_name)}</Form.Label>
                          <span className="toggle">
                            <input type="checkbox" id="toggle-switch-1" />
                            <label htmlFor="toggle-switch-1"></label> Toggle switch
                          </span>
                        </div>
                      </Col>
                    )}
                    {field.fields_type === 'Data Editor' && (
                      <Col sm={12}>
                        <Form.Label>{formatString(field.fields_name)}</Form.Label>
                        <TextEditor />
                      </Col>
                    )}
                  </React.Fragment>
                ))
              }
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddModulePreview;
