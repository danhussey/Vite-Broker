import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

export default function AuthForms() {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => setIsSignIn(!isSignIn);

  return isSignIn ? (
    <SignInForm onSwitch={toggleForm} />
  ) : (
    <SignUpForm onSwitch={toggleForm} />
  );
}
