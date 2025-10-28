'use client';

import React from 'react';
import { ArrowLeftIcon } from './icons';

interface ForgotPasswordFormProps {
  onSignInClick: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSignInClick }) => {
  return (
    <div className="form-container">
      <h2 className="form-title-large" style={{marginBottom: '0.25rem'}}>Forgot Password?</h2>
      <p className="form-subtitle">No worries, we'll send you reset instructions.</p>
      
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label" htmlFor="reset-email">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            placeholder="Enter your email"
            className="input-field"
          />
        </div>
        
        <button type="submit" className="submit-button">
          SEND RESET LINK
        </button>
      </form>

      <div className="text-center mt-6">
        <button onClick={onSignInClick} className="back-to-login-button">
          <ArrowLeftIcon />
          <span>Back to Login</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;