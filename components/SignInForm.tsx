'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, GoogleIcon, FacebookIcon } from './icons';
import SocialButton from './SocialButton';
import Link from 'next/link';

interface SignInFormProps {
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSignUpClick, onForgotPasswordClick }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-container">
      <h2 className="form-title-large" style={{marginBottom: '0.25rem'}}>Welcome Back</h2>
      <p className="form-subtitle">Sign in to continue</p>
      
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label" htmlFor="signin-email">
            Email
          </label>
          <input
            id="signin-email"
            type="email"
            defaultValue="johnsondoe@nomail.com"
            className="input-field"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="signin-password">
            Password
          </label>
          <div className="password-input-wrapper">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              defaultValue="************"
              className="input-field"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        
        <Link href="/role" className="submit-button">
          SIGN IN
        </Link>

        <button
          type="button"
          onClick={onSignUpClick}
          className="submit-button"
        >
          Create an Account
        </button>
      </form>

      <div className="divider">
        <div className="divider-line"></div>
        <span className="divider-text">Or</span>
        <div className="divider-line"></div>
      </div>

      <div className="social-buttons-container">
        <SocialButton icon={<GoogleIcon />} text="Sign up with Google" />
        <SocialButton icon={<FacebookIcon />} text="Sign up with Facebook" />
      </div>

      <div className="text-center mt-6">
        <button type="button" onClick={onForgotPasswordClick} className="forgot-password-link">
          Forgot Password?
        </button>
      </div>
       <p className="text-center switch-form-text mt-4">
         Don&apos;t have an account? <button onClick={onSignUpClick} className="switch-form-button">CREATE ONE</button>
      </p>
    </div>
  );
};

export default SignInForm;
