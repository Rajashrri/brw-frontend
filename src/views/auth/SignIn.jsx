import React, { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { NavLink } from 'react-router-dom';
import loginImage from '../../assets/images/auth/login.jpg'; // Using JPG
import logo from '../../assets/images/auth/logo.png'; // Using PNG
import AuthLogin from './JWTLogin';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";

const SignIn = () => {

  const {isLoggedIn}= useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/company/create-new-project');
    }
  }, [isLoggedIn, navigate]); // Depend on `isLoggedIn` and `navigate` to avoid repeated execution


  
  // Preload the logo for better LCP
  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = logo;
  }, []);

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <Row className="auth-row">
          <Col sm={12} md={6} className="image p-0">
            <img
              src={loginImage}
              alt="Login"
              loading="lazy" // Lazy load to defer loading of non-essential image
              width="600"
              height="400"
            />
            <div className="copyright_form">
              <p>
                Copyright © {new Date().getFullYear()} Dev Panel. All Rights Reserved. Powered By:{' '}
                <NavLink to={'https://www.digihost.in/'} target="_blank">
                  DigiHost Tech Solutions Pvt. Ltd.
                </NavLink>
              </p>
            </div>
          </Col>
          <Col sm={12} md={6} className="col-12 auth-content">
            <Card className="borderless d-flex align-items-center justify-content-center">
              <Card.Body>
                <div className="">
                  <div className="mb-4 text-center">
                    <div className="logo">
                      <img src={logo} alt="Logo" width="200" height="50" /> {/* Preload the logo */}
                    </div>
                    <h5 className="mt-1">Welcome Back!</h5>
                    <p>Sign in to continue to DiigiiHost.</p>
                  </div>
                </div>
                <AuthLogin />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default SignIn;
