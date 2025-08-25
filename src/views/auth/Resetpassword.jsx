
import React, { useState } from 'react';
import {useEffect } from 'react';
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
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/auth/logo.png";
import { MdLockOutline } from "react-icons/md";
import loginImage from "../../assets/images/auth/login.jpg";
import { Formik } from "formik";
import { FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../../store/auth';
import { toast } from 'react-toastify';
import { useParams,useNavigate } from 'react-router-dom';

const Resetpassword = () => {

  const { token } = useParams(); 
  

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/verify-reset-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }), // Send token as an object
            });

            const data = await response.json();

            if (data.valid) {
              setEmail(data.email);
            } else {
                toast.error('Session Timed Out or Invalid URL');
                setTimeout(() => {
                    navigate('/auth/signin');
                }, 2000);
            }
        } catch (error) {
            toast.error('Invalid or expired token');
            setTimeout(() => {
                navigate('/auth/signin');
            }, 2000);
        }
    };

    verifyToken();
}, [token, navigate]);

  // Validation Schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    cpassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm Password is required')
  });

  

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log(values);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/auth/resetpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email,password: values.password, cpassword: values.cpassword }),
      });
      const res_data = await response.json();

      if (response.ok) {
      
        toast.success(res_data.msg);
             
        setTimeout(() => {
          navigate('/auth/signin');
         }, 2000);
       
      } else {
        setErrors({ submit: res_data.message || 'Login failed' });
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
          <Col sm={12} md={6} className="image p-0">
            <img
              src={loginImage}
              alt="Login"
              loading="lazy"
              width="600"
              height="400"
            />
            <div className="copyright_form">
              <p>
                Copyright © {new Date().getFullYear()} Dev Panel. All Rights
                Reserved. Powered By:{" "}
                <NavLink to={"https://www.digihost.in/"} target="_blank">
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
                      <img src={logo} alt="Logo" width="200" height="50" />
                    </div>
                    <h5 className="mt-1">Welcome Back!</h5>
                    <p>Reset Your Password.</p>
                  </div>
                </div>
                <Formik  
                  initialValues={{ password: '', cpassword: '' }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form noValidate onSubmit={handleSubmit}>
                      <Form.Group className="mb-3" controlId="old-password">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="New Password"

                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="New Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="password"
                          />
                        </FloatingLabel>
                        {touched.password && errors.password && (
                          <small className="text-danger form-text d-flex justify-content-start align-items-center gap-1">
                            <FiAlertTriangle /> {errors.password}
                          </small>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="new-password">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Confirm Password"
                          className="mb-3"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Confirm Password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name="cpassword"
                          />
                        </FloatingLabel>
                        {touched.cpassword && errors.cpassword && (
                          <small className="text-danger form-text d-flex justify-content-start align-items-center gap-1">
                            <FiAlertTriangle /> {errors.cpassword}
                          </small>
                        )}
                      </Form.Group>

                      <Row className="mt-4">
                        {errors.submit && (
                          <Col sm={12}>
                            <Alert>{errors.submit}</Alert>
                          </Col>
                        )}
                        <Col sm={12} mt={1}>
                          <Button
                            className="btn-block"
                            color="primary"
                            size="large"
                            type="submit"
                            variant="primary"
                          >
                            Reset
                          </Button>
                        </Col>
                        <Col sm={12} mt={2}>
                          <div className="below-text mt-3 text-center">
                            <p className="mb-4">
                              Don't have an account ?{" "}
                              <NavLink to={"#"}>Register</NavLink>{" "}
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Resetpassword;
