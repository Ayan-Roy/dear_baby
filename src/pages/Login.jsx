import React from "react";
import AuthPage from "./AuthPage.jsx";

export default function Login({ onLogin }) {
  return <AuthPage onLogin={onLogin} initialMode="login" />;
}
