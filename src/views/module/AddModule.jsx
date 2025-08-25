import React from "react";
import { useState,useEffect } from "react";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from 'react-toastify';
import { MdKeyboardBackspace } from "react-icons/md";
import Modal from "react-bootstrap/Modal";

const AddModule = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const [pagetable, setPagename] = useState('');

  const handleSelect1Change = (event) => {
    setPagename(event.target.value);
  };

  const [fields, setRows] = useState([
    { name: "status", validation: "Auto Save",inputtype:"",ids:""},
    { name: "createdBy", validation: "Auto Save",inputtype:"",ids:""},
    { name: "createdDate", validation: "Auto Save",inputtype:"",ids:""},
    { name: "", validation: "",inputtype:"",ids:""},


  ]);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [searchClass, setSearchClass] = useState([""]); // State for dynamic search class
  const [pageOptions, setPageOptions] = useState([]);

  // Function to handle adding a new row
  const handleAddRow = () => {
    setRows([...fields,  { name: "" ,validation:"",inputtype:""}]);
  };

  // Function to handle removing a row by index
  const handleRemoveRow = async (index,ids) => {
     if(ids==undefined){
      const updatedRows = fields.filter((row, i) => i !== index);
      setRows(updatedRows);
    }else{
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/deletefield/${ids}`,{
            method:"DELETE",
        });
        const data = await response.json();
          if (response.ok == true) {
            getdatabyid();
            toast.success(data.msg);
          }else{
            toast.error(data.extraDetails ? data.extraDetails : data.msg);
          }
    
      } catch (error) {
        console.log(error);
      }
    }
    
  };

  // Function to handle input changes for a specific row
  const handleChange = (index, event, fieldName) => {
    const updatedRows = fields.map((row, i) => {
      if (i === index) {
        if (fieldName) {
          // Handle react-select changes
          return { ...row, [fieldName]: event.value }; // event contains { value, label }
        } else {
          // Handle standard input changes
          return { ...row, [event.target.name]: event.target.value };
        }
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Update the search term state
  };

  // Filtered rows based on search term
  const filteredRows = fields.filter((row) => {
    return (
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Adjust fields as per your needs
      row.length.toString().includes(searchTerm) // Convert age to string for comparison
    );
  });

  const [table_name, setModuleform] = useState("");

  const handleinput = (event) => {
    setModuleform(event.target.value);
  };
 
  const fieldsOptions = [
    { value: "Auto Save", label: "Auto Save" },
    { value: "Optional", label: "Optional" },
    { value: "Required", label: "Required" },
  ];
  const fieldTypesOptions = [
    { value: "Text", label: "Text" },
    { value: "Single Select", label: "Single Select" },
    { value: "Multi Select", label: "Multi Select" },
    { value: "Textarea", label: "Textarea" },
    { value: "file", label: "file" },
    { value: "Radio", label: "Radio" },
    { value: "CheckBox", label: "CheckBox" },
    { value: "DatePicker", label: "DatePicker" },
    { value: "Data Editor", label: "Data Editor" },
  ];

  const [errors, setErrors] = useState({});

  const validateRows = () => {
    const rowErrors = [];

    fields.forEach((row, index) => {
        // Ensure 'name' is a string and not empty
        if (!row.name || !row.name.trim()) {
            rowErrors.push(`Row ${index + 1}: "Name" is required.`);
        }
        // Ensure 'length' exists and is a valid number
        if (!row.length || isNaN(row.length)) {
            rowErrors.push(`Row ${index + 1}: "Length" must be a valid number.`);
        }
    });
    return rowErrors;
};

  const handlesubmitbtn = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!table_name) newErrors.table_name = 'Page name is required';
    if (!selectedOption1) newErrors.selectedOption = 'Select option is required';
    

      // Check for empty fields in the rows
      fields.forEach((field, index) => {
        if (index >= 3 && (!field.name || !field.validation || !field.inputtype )) {
          newErrors.rowErrors = newErrors.rowErrors || [];
          newErrors.rowErrors.push(`Row ${index + 1} is incomplete`);
        }
      });

      // If errors exist, set state and do not proceed
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      if(isEdit){
        try {
          const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/updatepages/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ table_name, fields, selectedOption1 }),
          });

          const res_data = await response.json();
          if (response.ok) {
                if(res_data.error ==true){
                  toast.error(res_data.extraDetails || res_data.message);
                }else{
                  toast.success('Module updated successfully!');
                } 
                getdatabyid();
              setErrors({});
          } else {
              toast.error(res_data.extraDetails || res_data.message);
          }
        } catch (error) {
            console.error("Error adding module:", error);
            toast.error("An error occurred.");
        }
      }else{  
          try {
              const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/createpages`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ table_name, fields,selectedOption1 }),
              });

              const res_data = await response.json();
              if (response.ok) {
                    if(res_data.error ==true){
                      toast.error(res_data.extraDetails || res_data.message);
                    }else{
                      toast.success('Module added successfully!');
                    }
                
                  setRows([ // Reset rows
                    { name: "status", validation: "Auto Save",inputtype:"",ids:""},
                    { name: "createdBy", validation: "Auto Save",inputtype:"",ids:""},
                    { name: "createdDate", validation: "Auto Save",inputtype:"",ids:""},
                    { name: "", validation: "",inputtype:"",ids:""},
                  ]);
                  setModuleform('');
                  setSelectedOption1('');
                  setErrors({});
              } else {
                  toast.error(res_data.extraDetails || res_data.message);
              }
          } catch (error) {
              console.error("Error adding module:", error);
              toast.error("An error occurred.");
          }
      }    
  };

  const [options, setIconOptions] = useState([]);
  const [options1, setIconOptions1] = useState([]);

  const [iconid, setIconid] = useState("");


  const getdatabyid= async () => {
    try {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/get/${id}`,{
        method:"GET",
    });
    const data = await response.json();
    
    setModuleform(data.page[0].page_name);
    setIconid(data.page[0].icon_id);
    fetchData();
      setRows(data.fields.map(field => ({
        name: field.fields_name,   
        validation: field.fields_validation,  
        inputtype: field.fields_type || "",
        dropdown: field.dropdown,
        ids:field._id||"",
      })));

    } catch (error) {
      console.error("Error adding module:", error);
    }
  };
  const fetchPageOptions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getPageOptions`,{
        method:"GET",
      });
      // Map data to react-select format
     


      const res_data = await response.json();

      // Ensure res_data.msg is an array before mapping
      const options = Array.isArray(res_data.msg) 
        ? res_data.msg.map((page) => ({
            value: page.table_name,
            label: page.page_name || page.page_name, // Adjust according to API response
          }))
        : [];
      setPageOptions(options);
    } catch (error) {
      console.error("Error fetching page options:", error);
    }
  };

  

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/getSidebarOptions`,{
        method:"GET",
      });
      const res_data = await response.json();

      const sidebarOptions = Array.isArray(res_data.msg) ? res_data.msg : [];
      const mappedOptions = sidebarOptions.map((item) => ({
        value: item._id,
        label: item.icontitle,
        image: `${import.meta.env.VITE_APP_API_URL}/sidebar/${item.icon}`, 
      }));

      const appendedOptions = [
        ...mappedOptions,
        {
          value: "Others",
          label: "Others",
          image: "/src/assets/images/sidebar/dashboard.svg",
        },
      ];

      setIconOptions(appendedOptions);
        const preselectedValue = iconid; 
        const preselectedOption = appendedOptions.find(
          (option) => option.value === preselectedValue
        );
        if (preselectedOption) {
          setSelectedOption(preselectedOption);
          setSelectedOption1(iconid);
          
        }
      // console.log(iconid);
    } catch (error) {
      console.error("Error fetching sidebar options:", error);
    }
  };


  useEffect(() => {
    const fetchInitialData = async () => {
      await getdatabyid(); // Fetch data and set `iconid`
    };
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (iconid) {
      fetchData();
      fetchPageOptions();

    }
    fetchData();
    fetchPageOptions();
  }, [iconid]);

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

 

  // Columns for DataTable
  const columns = [
    {
      name: "Name",
      cell: (row, index) => (
        index >= 3 ? (
          <div
          
        >
          <input
            type="text"
            name="name"
            className="form-control"
            value={row.name}
            onChange={(e) => handleChange(index, e)}
            placeholder="Enter name"
          />
          {!row.name && errors.rowErrors?.includes(`Row ${index + 1} is incomplete`) && (
            <small className="text-danger">Name is required</small>
          )}
        </div>
       ) : null
      ),
    },
    {
      name: "Field",
      cell: (row, index) => (
        index >= 3 ? (
        <div>
        <Select
          options={fieldsOptions}
          name="validation"
          value={fieldsOptions.find((option) => option.value === row.validation)}
          onChange={(selectedOption) => handleChange(index, selectedOption, "validation")}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (base) => ({ ...base, minHeight: "40px",borderColor: errors.rowErrors?.includes(`Row ${index + 2} is incomplete`) ? "red" : base.borderColor, }),
          }}
        />
        {!row.validation && errors.rowErrors?.includes(`Row ${index + 1} is incomplete`) && (
            <small className="text-danger">Field is required</small>
          )}
        </div>
      ) : null
      ),
    },
    {
      name: "Field Type",
      cell: (row, index) => (
        index >= 3 ? (
        <div>
        <Select
          options={fieldTypesOptions}
          name="inputtype"
          value={fieldTypesOptions.find((option) => option.value === row.inputtype)}
          onChange={(selectedOption) => handleChange(index, selectedOption, "inputtype")}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (base) => ({ ...base, minHeight: "40px",borderColor: errors.rowErrors?.includes(`Row ${index + 2} is incomplete`) ? "red" : base.borderColor, }),
          }}
        />


        {!row.inputtype && errors.rowErrors?.includes(`Row ${index + 1} is incomplete`) && (
          <small className="text-danger">Field Type is required</small>
        )}
        </div>
      ) : null
      ),
    },
    {
      name: "",
      cell: (row, index) => (
        index >= 3 ? (
        <div>
   {(row.inputtype === "Single Select" || row.inputtype === "Multi Select") && (
  <Select
    options={pageOptions}
    name="dropdown"
    value={pageOptions.find((option) => option.value === row.dropdown)}
    onChange={(selectedOption) => handleChange(index, selectedOption, "dropdown")}
    menuPortalTarget={document.body}
    menuPosition="fixed"
    styles={{
      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      control: (base) => ({
        ...base,
        minHeight: "40px",
        borderColor: errors.rowErrors?.includes(`Row ${index + 2} is incomplete`) ? "red" : base.borderColor,
      }),
    }}
  />
)}

</div>
      ) : null
      ),
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <div className="d-flex align-items-center">
          {index >= (!isEdit?'4':'3') ? (
            <a
              onClick={() => handleRemoveRow(index,row.ids)}
              className="btn btn-outline-danger btn-sm edit"
              title="Delete"
            >
              <MdDeleteOutline />
            </a>
          ) : null}
        </div>
      ),
    },
  ];

  // Custom search input with icon
  const searchOnHandler = () => {
    setSearchClass(["open-search"]); // Custom logic to handle opening the search
  };

  const searchOffHandler = () => {
    setSearchClass([""]); // Custom logic to handle closing the search
  };

  
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelectChange = (index, option, field) => {
    setSelectedOption(option);
    setSelectedOption1(option.value);
    if (option.value === "Others") {
      setShow(true); 
    }
  };


  

  const [icon, setIcon] = useState();
  const [icontitle, seIcontitle] = useState();

  const handleinputmodal = async (icontitle) => {
    seIcontitle(icontitle.target.value);
  };

  const handleinputfile = (e) => {
    setIcon(e.target.files[0]);
  };

  const handlesubmitmodal = async(e) => {
    e.preventDefault();
    const newErrors1 = {}; 
    
    if (!icontitle) newErrors1.icontitle = 'Icon title is required';
    if (!icon) newErrors1.icon = 'File is required';

    if (Object.keys(newErrors1).length > 0) {
      setErrors(newErrors1);
    }else{
      try{
        const formData = new FormData();
        formData.append("icontitle", icontitle);
        formData.append("icon", icon);

        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/form/addsidebaricon`,{
            method: "POST",
            body: formData,
    
        });
        const res_data = await response.json();
        if (response.ok) {
            toast.success('Icon Added successfully!');
            // setIconoptions(res_data.msg);
            seIcontitle('');
            setIcon('');
            setShow(false);
            fetchData();
        } else {
            toast.error(res_data.extraDetails || res_data.msg);
        }
       
      }catch(error){
        console.error("Error adding module:", error);
      }
    }
  };

  const CustomSelectOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ display: "flex", alignItems: "center", padding: "10px" }}
    >
      <img
        src={data.image}
        alt={data.label}
        style={{
          width: "25px",
          height: "25px",
          marginRight: "12px",
        }}
      />
      {data.label}
    </div>
  );

  const CustomSingleValue = ({ data }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={data.image}
        alt={data.label}
        style={{
          width: "25px",
          height: "25px",
          marginRight: "12px",
        }}
      />
      {data.label}
    </div>
  );

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
        <form onSubmit={handlesubmitbtn}>
          <Card className="create_new_page_card add-module add-module-table">
          <Card.Header>
              <Row className="">
                  <Col lg={4}>
                    <div className="data_tableHeader">
                      <div className="search-input mb-1">
                        <Form.Label>Page Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={table_name}
                          onChange={handleinput}
                          name="table_name"
                          placeholder="Page Name"
                        />
                        {errors.table_name && (
                          <span className="text-danger pg-er">
                            {errors.table_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="data_tableHeader">
                      <Form.Label>Select Title</Form.Label>
                      <Select
                         options={options}
                         value={selectedOption} onchange="handleDropdownChange()"
                         onChange={(option) => handleSelectChange(0, option, "")}
                         components={{
                          Option: CustomSelectOption,
                          SingleValue: CustomSingleValue,
                         }}
                      />
                      {errors.selectedOption && (
                          <span className="text-danger pg-er">
                            {errors.selectedOption}
                          </span>
                        )}
                    </div>
                  </Col>
                  {/* <Col lg={4}>
                    <div className="data_tableHeader">
                      <Form.Group className="mb-3" controlId="PageName">
                        <Form.Label>Upload</Form.Label>
                        <Form.Control
                          type="file"
                          placeholder="Page Name"
                        ></Form.Control>
                      </Form.Group>
                    </div>
                  </Col> */}
              </Row>
          </Card.Header>
            <Card.Body>
          
              <DataTable
                columns={columns}
                data={filteredRows} // Use filtered rows
                responsive
                striped
              />
              <Button
                className="waves-effect waves-light"
                variant="primary"
                onClick={handleAddRow}
                style={{ marginRight: "5px", marginTop: "20px" }} // Adjust spacing for alignment
              >
                <FaPlus /> Add Row
              </Button>

              <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between mt-3 align-items-center">
                      <div className="text-end">
                        <a
                          href="/module/module-list"
                          className="back-button"
                          variant="primary"
                        >
                          <MdKeyboardBackspace /> Back
                        </a>
                      </div>
                      <div className="text-end">
                        <Button
                          type="submit"
                          className="waves-effect waves-light"
                          variant="primary"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </Col>
              </Row>
             
            </Card.Body>
          </Card>
          </form>
        </Col>
      </Row>
      <Modal show={show} onHide={handleClose} className="other-icon-modal">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h3>Upload Other Icons</h3>
          <form onSubmit={handlesubmitmodal}>
            <div className="mb-3">
              <div className="search-input mb-1">
                <Form.Label>Icon Title</Form.Label>
                <Form.Control
                  type="text"
                  value={icontitle}
                  onChange={handleinputmodal}
                  name="icontitle"
                  placeholder="Page Name"
                />
                {errors.icontitle && (
                  <span className="text-danger">{errors.icontitle}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <Form.Group className="mb-3" controlId="PageName">
                <Form.Label>Upload Icon</Form.Label>
                <Form.Control type="file" name="file" onChange={handleinputfile} placeholder="Page Name"></Form.Control>
              </Form.Group>
              {errors.icon && (
                <span className="text-danger">{errors.icon}</span>
              )}
            </div>
            <div className="text-center mt-4">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default AddModule;
