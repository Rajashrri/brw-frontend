import React, { useState } from 'react';
import { Row, Col, Alert, Button, Form, FloatingLabel, Container } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import loginImage from '../../assets/images/auth/login.jpg';
import logo from '../../assets/images/auth/logo.png';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FiAlertTriangle } from 'react-icons/fi';
import { IoMdLock } from 'react-icons/io';
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const SignIn = () => {
  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

   // Validation Schema
   const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').required('Email is required'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log(values);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/forgot`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(values),

      });
      const res_data = await response.json();
      
      if(response.ok == true){
        console.log(response.ok);
        localStorage.setItem("foremail", res_data.email);
          // storeTokenInLS(res_data.token);
          toast.success('Email Verified Successfully');
          setTimeout(() => {
            navigate('/auth/signin');
          }, 2000);
    
      }else{
          toast.error(res_data.extraDetails ? res_data.extraDetails :res_data.message);
      }
    } catch (error) {
      setErrors({ submit: 'Server error. Please try again later.' });
    }
    setSubmitting(false);
  };

  return (
    <React.Fragment>
      <div className="auth-wrapper">
        <Row className="auth-row">
          <Col sm={6} className="image p-0">
            <img src={loginImage} alt="" />
            <div className="copyright_form">
              <p>
                Copyright © {new Date().getFullYear()} Dev Panel. All Rights Reserved. Powered By:{' '}
                <NavLink to={'https://www.digihost.in/'} targe="_blank">
                  DigiHost Tech Solutions Pvt. Ltd.
                </NavLink>
              </p>
            </div>
          </Col>
          <Col sm={6} className="p-0">
            <div className="auth-content">
              <Card className="borderless d-flex align-items-center justify-content-center">
                <Card.Body className="">
                  <div className="mb-4 text-center">
                    <div className="logo">
                      <img src={logo} alt="" />
                    </div>
                    <h5 className="mt-1">Welcome Back !</h5>
                    <p>Sign in to continue to DiigiiHost.</p>
                  </div>
                  <Formik
                     initialValues={{ email: ''}}
                     validationSchema={validationSchema}
                     onSubmit={handleSubmit}
                  >
                     {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
                      <form noValidate onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <Form.Group className="mb-3" controlId="email">
                          <FloatingLabel controlId="floatingInput" label="Enter Email" className="mb-3">
                            <Form.Control
                              type="email"
                              placeholder="Enter Email"
                              onBlur={handleBlur}
                              onChange={handleChange}
                             name="email"
                              // value={values.email}
                            />
                          </FloatingLabel>
                          {touched.email && errors.email && (
                            <small className="text-danger form-text d-flex justify-content-start align-items-center gap-1">
                              <FiAlertTriangle />
                              {errors.email}
                            </small>
                          )}
                        </Form.Group>

                        {/* Error Message for Submit */}
                        {errors.submit && (
                          <Col sm={12}>
                            <Alert>{errors.submit}</Alert>
                          </Col>
                        )}

                        {/* Submit Button */}
                        <Row className="mt-4">
                          <Col sm={12} mt={2} className="">
                          <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                             Submit
                          </Button>
                            {/* <Link
                              to="/company/create-new-project"
                              className="btn-block mb-0 create-button btn btn-primary waves-effect waves-light"
                            >
                              Sumbit
                            </Link> */}
                          </Col>
                          <Col sm={12} mt={2} className="mt-3">
                            <span className="mb-2 text-muted forgot">
                              <NavLink to={'/auth/signin'} className="text-muted">
                                <IoMdLock /> Don't have an account ? Log In
                              </NavLink>
                            </span>
                          </Col>
                        </Row>
                      </form>
                    )}
                  </Formik>

                  {/* <div className="below-text">
                                    <p>
                                        Don't have an account ? <NavLink to={'/auth/signin'}>Log In</NavLink>{' '}
                                    </p>

                                </div> */}
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default SignIn;
