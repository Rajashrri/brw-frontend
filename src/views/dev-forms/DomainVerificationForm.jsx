import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const DomainVerificationForm = () => {
  return (
    <React.Fragment>
      <div className="mainForm">
        <p className="personal">
          Domain Verification Form{' '}
          <div class="icon-wrapper">
            <Link to="/company/create-new-project">
              <i class="fas fa-home custom-icon">
                <span class="fix-editor">&nbsp;</span>
              </i>
            </Link>
          </div>
        </p>
        <p className="personalInfo">Please provide your domain details.</p>

        <Row>
          <Col lg={12}>
            <Form>
              <Row>
                <Col lg={12}>
                  <Form.Group className="mb-3" controlId="DomainName">
                    <Form.Label>Enter Domains</Form.Label>
                    <Form.Control type="text" placeholder="Enter Domains" />
                  </Form.Group>
                </Col>

                <Col lg={12}>
                  <div className="text-start gap-2 d-flex align-items-center buy-btn">
                    <button type="submit" className="btn btn-primary waves-effect waves-light" variant="primary">
                      Verify
                    </button>
                    or
                    <Link to="/buy-domain">Buy Domain</Link>
                  </div>
                  <div className="details">
                    <h4>Details</h4>
                    <table>
                      <tr className="info">
                        <td>Is the domain correct?:</td>
                        <td>Yes</td>
                      </tr>
                      <tr className="info">
                        <td>Registry Domain ID:</td>
                        <td>HJIW4928</td>
                      </tr>
                      <tr className="info">
                        <td>Updated Date:</td>
                        <td>25th September 2024</td>
                      </tr>
                      <tr className="info">
                        <td>Creation Date: </td>
                        <td>25th September 2024</td>
                      </tr>
                      <tr className="info">
                        <td>Registrar Registration Expiration Date: </td>
                        <td>25th September 2024</td>
                      </tr>
                    </table>
                  </div>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};
