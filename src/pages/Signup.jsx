import React from "react";
import AuthPage from "./AuthPage.jsx";

export default function Signup({ onSignup }) {
  return <AuthPage onSignup={onSignup} initialMode="signup" />;
}
