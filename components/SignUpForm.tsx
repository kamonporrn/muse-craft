'use client';

import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, GoogleIcon, FacebookIcon } from './icons';
import SocialButton from './SocialButton';
import Link from 'next/link';

interface SignUpFormProps {
  onSignInClick: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignInClick }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-container">
      <p className="form-title-small">Let&apos;s get you started</p>
      <h2 className="form-title-large">Create an Account</h2>
      
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-name">
            Your Name
          </label>
          <input
            id="signup-name"
            type="text"
            placeholder="Johnson Doe"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            placeholder="johnsondoe@nomail.com"
            className="input-field"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">
            Password
          </label>
          <div className="password-input-wrapper">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="************"
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
          GET STARTED
        </Link>
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

      <p className="text-center switch-form-text mt-6">
        Already have an account? <button onClick={onSignInClick} className="switch-form-button">LOGIN HERE</button>
      </p>
    </div>
  );
};

export default SignUpForm;