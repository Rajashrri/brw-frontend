import React, { useState } from 'react';
import {useEffect } from 'react';
import loginImage from '../../assets/images/auth/login.jpg'; // Using JPG
import logo from '../../assets/images/auth/logo.png'; // Using PNG

import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Alert,
  FloatingLabel,
  Container,
} from "react-bootstrap";
import * as Yup from 'yup';
import { Formik } from 'formik';
import { FiAlertTriangle } from 'react-icons/fi';
import { IoMdLock } from 'react-icons/io';
import { useAuth } from "../../store/auth";
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const SignIn = () => {
    const navigate = useNavigate();
     const email= JSON.parse(localStorage.getItem("otpemail"));
    //  const [email, setEmail] = useState("");
 
    // useEffect(() => {
    //     if (lemail && lemail.email) {
    //         setEmail(lemail.email);
    //     }
    // }, [email]);

   
    const { storeTokenInLS } = useAuth();
  
     // Validation Schema
     const validationSchema = Yup.object().shape({
        otp: Yup.string()
        .min(6, 'Otp must be at least 6 characters')
        .max(6, 'Otp must be 6 characters')
        .required('OTP is required'),
    });
  
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
      console.log(JSON.parse(localStorage.getItem("otpemail")));
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/authverify`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, ...values }), // Fixed payload
        });
    
        const res_data = await response.json();
    
        if (response.ok) {
          if (res_data.msg === true) {
            storeTokenInLS(res_data.token);
            toast.success('Otp Verified Successfully');
            setTimeout(() => {
              navigate('/company/create-new-project');
            }, 2000);
          } else {
            toast.error('Incorrect Otp/Timed Out');
          }
        } else {
          toast.error(res_data.extraDetails ? res_data.extraDetails : res_data.message);
        }
      } catch (error) {
        console.error("Frontend Error:", error);
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
                      <h5 className="mt-1">OTP Verification !</h5>
                      <p>Complete verification to continue to DiigiiHost.</p>
                    </div>
                    <Formik
                        initialValues={{ otp: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        >
                        {({ errors, touched, handleBlur, handleChange, handleSubmit, isSubmitting, setFieldValue }) => (
                            <form noValidate onSubmit={handleSubmit}>
                            {/* OTP Input */}
                            <Form.Group className="mb-3" controlId="otp">
                                <FloatingLabel controlId="floatingInput" label="Enter OTP" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter otp"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        name="otp"
                                    />
                                </FloatingLabel>
                                {touched.otp && errors.otp && (
                                <small className="text-danger form-text d-flex justify-content-start align-items-center gap-1">
                                    <FiAlertTriangle />
                                    {errors.otp}
                                </small>
                                )}
                            </Form.Group>

                            {/* Error Message for Submit */}
                            {errors.submit && (
                                <Col sm={12}>
                                <Alert variant="danger">{errors.submit}</Alert>
                                </Col>
                            )}

                            {/* Submit Button */}
                            <Row className="mt-4">
                                <Col sm={12} className="text-center">
                                <Button
                                    className="btn-block"
                                    color="primary"
                                    disabled={isSubmitting}
                                    size="lg"
                                    type="submit"
                                    variant="primary"
                                >
                                    Submit
                                </Button>
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
  