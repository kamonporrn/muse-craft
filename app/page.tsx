'use client';

import React, { useState } from 'react';
import SignInForm from '../components/SignInForm';
import SignUpForm from '../components/SignUpForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

type FormState = 'signIn' | 'signUp' | 'forgotPassword';

const HomePage: React.FC = () => {
  const [formState, setFormState] = useState<FormState>('signIn');

  const showSignUp = () => setFormState('signUp');
  const showSignIn = () => setFormState('signIn');
  const showForgotPassword = () => setFormState('forgotPassword');

  return (
    <div className="container">
      {/* Background decorative elements */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <main className="main-card">
        <div className="info-panel">
          <img 
            src="/musecraft_logo.png" 
            alt="Muse Craft Logo" 
            className="info-panel-logo" 
          />
        </div>
        <div className="form-panel">
          {formState === 'signIn' && <SignInForm onSignUpClick={showSignUp} onForgotPasswordClick={showForgotPassword} />}
          {formState === 'signUp' && <SignUpForm onSignInClick={showSignIn} />}
          {formState === 'forgotPassword' && <ForgotPasswordForm onSignInClick={showSignIn} />}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
