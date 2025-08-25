import React, { useState } from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch, FaEdit, FaThLarge, FaRegEye } from 'react-icons/fa';
import { admin1, admin2 } from '../../images';

export const AdminPanelTemplate = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <React.Fragment>
      <div className="mainForm">
        <p className="personal">
          Choose Admin Panel Template{' '}
          <div className="icon-wrapper">
            <Link to="/company/create-new-project">
              <i className="fas fa-home custom-icon">
                <span className="fix-editor">&nbsp;</span>
              </i>
            </Link>
          </div>
        </p>

        <Row>
          <Col lg={12}>
            <Form>
              <Row>
                <Col lg={4}>
                  <Form.Group className="mb-3" controlId="DomainName">
                    <div className="input-group rounded">
                      <Form.Control
                        type="text"
                        placeholder="Search template by"
                        className="rounded-start" // Rounded start
                      />
                      <span className="input-group-text rounded-end"> {/* Rounded end for the icon */}
                        <FaSearch />
                      </span>
                    </div>
                  </Form.Group>
                </Col>
                <Col lg={8}>
                  <div className="form-btn-panel">
                    <div>
                      <select
                        id="options"
                        value={selectedOption}
                        onChange={handleSelectChange}
                        className="form-select"
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        <option value="option1">Corporate Business Templates</option>
                        <option value="option2">Admin Panel Templates</option>
                        <option value="option3">E-commerce Templates</option>
                      </select>
                    </div>

                    <div className="text-right m-l-10">
                      <Link to="#" className="create-button btn btn-primary waves-effect waves-light">
                        <FaEdit /> Start From Scratch
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg={4}>
                  <Card className="project-card admin-card">
                    <div className="card-image-wrapper">
                      <Card.Img variant="top" src={admin1} />
                      <div className="overlay">
                        <div className="button">
                          <a href="#" target="_blank" className="create-button btn btn-primary waves-effect waves-light">
                            Preview
                          </a>
                          <a href="#" target="_blank" className="create-button btn btn-primary waves-effect waves-light">
                            View Layout
                          </a>
                        </div>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title>
                        Template 1{' '}
                        <div style={{ float: 'right', display: 'inline' }}>
                          <a href="#" title="View" target="_blank" className="view-color">
                            <FaRegEye />
                          </a>
                          <a href="#" title="View Layout" target="_blank" className="view-color m-l-10">
                            <FaThLarge />
                          </a>
                        </div>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="project-card admin-card">
                    <div className="card-image-wrapper">
                      <Card.Img variant="top" src={admin2} />
                      <div className="overlay">
                        <div className="button">
                          <a href="#" target="_blank" className="create-button btn btn-primary waves-effect waves-light">
                            Preview
                          </a>
                          <a href="#" target="_blank" className="create-button btn btn-primary waves-effect waves-light">
                            View Layout
                          </a>
                        </div>
                      </div>
                    </div>
                    <Card.Body>
                      <Card.Title>
                        Template 2{' '}
                        <div style={{ float: 'right', display: 'inline' }}>
                          <a href="#" title="View" target="_blank" className="view-color">
                            <FaRegEye />
                          </a>
                          <a href="#" title="View Layout" target="_blank" className="view-color m-l-10">
                            <FaThLarge />
                          </a>
                        </div>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};
