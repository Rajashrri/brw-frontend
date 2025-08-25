import React from 'react';
import { Row, Col } from 'react-bootstrap';
function Footer() {
  return (
    <React.Fragment>
      <footer className="footer">
        <div className="d-flex justify-content-between">
          <div>Copyright © {new Date().getFullYear()} Dev Panel. All Rights Reserved.</div>
          <div>
            Powered By:{' '}
            <a href="https://www.digihost.in/" target="_blank">
              DigiHost Tech Solutions Pvt. Ltd.
            </a>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Footer;
