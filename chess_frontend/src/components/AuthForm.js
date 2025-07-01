import React, { useState } from "react";
import { useAuth } from "../AuthContext";

// PUBLIC_INTERFACE
export default function AuthForm() {
  const { login, signup, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({ email: "", password: "" });

  const handleChange = e => setInputs(i => ({
    ...i,
    [e.target.name]: e.target.value
  }));
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!inputs.email || !inputs.password) {
      setError("Please enter all fields");
      return;
    }
    const fn = isLogin ? login : signup;
    const { error } = await fn(inputs.email, inputs.password);
    if (error) setError(error.message);
  };

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={inputs.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={inputs.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
        <button type="submit" className="btn" disabled={loading}>
          {isLogin ? "Login" : "Sign up"}
        </button>
        {error && <div className="error-msg">{error}</div>}
      </form>
      <div style={{ marginTop: 12 }}>
        {isLogin
          ? <>Don't have an account? <button className="btn-link" onClick={() => setIsLogin(false)}>Sign up</button></>
          : <>Already have an account? <button className="btn-link" onClick={() => setIsLogin(true)}>Login</button></>
        }
      </div>
    </div>
  );
}
