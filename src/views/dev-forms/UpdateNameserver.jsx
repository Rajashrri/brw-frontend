import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const UpdateNameserver = () => {
  return (
    <React.Fragment>
      <div className="mainForm">
        <p className="personal">
          Update Nameserver{' '}
          <div class="icon-wrapper">
            <Link to="/company/create-new-project">
              <i class="fas fa-home custom-icon">
                <span class="fix-editor">&nbsp;</span>
              </i>
            </Link>
          </div>
        </p>
        <p className="personalInfo">Nameserver list</p>

        <Row>
          <Col lg={12}>
            <ul className="custom-list">
              <li>
                <i class="fas fa-chevron-right"></i> ns1.digihost.in
              </li>
              <li>
                <i class="fas fa-chevron-right"></i> ns1.digihost.in
              </li>
            </ul>
          </Col>
          <Col lg={12}>
            <div className="text-start gap-2 d-flex align-items-center buy-btn">
              <button type="button" className="btn btn-primary waves-effect waves-light" variant="primary">
                Verify
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};
