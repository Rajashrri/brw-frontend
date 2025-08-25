import React, { useState, useEffect } from 'react';
import TextEditor from "./TextEditor";
import InputMask from "react-input-mask";
import Select from "react-select";
import DatePicker from "react-datepicker";
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
  const options = [
    { value: "Number", label: "Number" },
    { value: "Text", label: "Text" },
    { value: "Password", label: "Password" },
  ];

  const multipleOptions = [
    { value: "Number", label: "Number" },
    { value: "Text", label: "Text" },
    { value: "Password", label: "Password" },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selected) => {
    setSelectedOptions(selected);
  };
  const [field, setData] = useState([]);



  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/form/get/673ec60359468307edb6bd79');
        const result = await response.json();


        if (result && result.fields) {
          setData(result.fields);
        } else {
          console.error("Invalid response structure:", result);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);
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

            {
                field.map((field, index) => (
              <Row className="mb-3 align-items-center">
                {field.fields_type == 'Text' && (
                <Col md={6}>
                  <div className="mb-3">
                    <Form.Label>{field.fields_name}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter Name"
                    />
                  </div>
                </Col>
                )}
                  {field.fields_type == 'Password' && (
              <Col md={6}>
                  <div className="mb-3">
                    <Form.Label>{field.fields_name}</Form.Label>
                    <Form.Control required type="password" />
                  </div>
                </Col>
                  )}
              </Row>
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddModulePreview;
