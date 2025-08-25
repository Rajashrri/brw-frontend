import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap 5 installed

const DevForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nationalID: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    postCode: '',
    city: '',
    country: '',
    phoneNumber: '',
    email: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
    } else {
      console.log('Form Submitted', formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="mb-4">Business Account</h2>
            <div className="mb-3">
              <label className="form-label">Company Name:</label>
              <input
                type="text"
                className="form-control"
                name="nationalID"
                value={formData.nationalID}
                onChange={handleChange}
                placeholder="Company Name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Company Industry</label>
              <select className="form-select" name="country" value={formData.country} onChange={handleChange} required>
                <option value="Norway">Web</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="mb-4">Contact Details</h2>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="mb-4">Tax Details</h2>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="mb-4">Summary</h2>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="mb-4">Receipt</h2>
            <p>Thank you for submitting your information!</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create Account</h4>
              <ul className="list-group list-group-flush">
                <li className={`list-group-item ${step >= 1 ? 'active' : ''}`}>1. Business Account</li>
                <li className={`list-group-item ${step >= 2 ? 'active' : ''}`}>2. Domain Verification</li>
                <li className={`list-group-item ${step >= 3 ? 'active' : ''}`}>3. Update Name Server</li>
                <li className={`list-group-item ${step >= 4 ? 'active' : ''}`}>4. Choose Admin Panel Template</li>
                <li className={`list-group-item ${step >= 5 ? 'active' : ''}`}>5. Choose Front Theme</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {renderStep()}
                <div className="d-flex justify-content-between mt-4">
                  {step > 1 && (
                    <button className="btn btn-secondary" type="button" onClick={prevStep}>
                      Back
                    </button>
                  )}
                  {step < 5 ? (
                    <button className="btn btn-primary" type="submit">
                      Next
                    </button>
                  ) : (
                    <button className="btn btn-success" type="submit">
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevForm;
