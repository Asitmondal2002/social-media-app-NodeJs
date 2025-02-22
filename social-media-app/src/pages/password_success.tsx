import React from 'react';
import { Link } from 'react-router-dom';

const PasswordSuccess = () => {
  return (
    <div className="success-container">
      <h2>Password Changed Successfully</h2>
      <p>Your password has been updated. You can now log in with your new credentials.</p>
      <Link to="/login">
        <button className="btn-primary">Go to Login</button>
      </Link>
    </div>
  );
};

export default PasswordSuccess;
