import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:9000";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [cred, setCred] = useState({});

  const authHandler = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      await axios.put(`${BASE_URL}/auth/signup`, {
        name: cred.username,
        email: cred.email,
        password: cred.password,
      });
      return navigate("/auth/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="auth auth-page">
      <div className="auth-content">
        <div className="auth-header">Create your account</div>
        <div className="header-text">Please enter your details.</div>
        <form className="auth-form-container" onSubmit={authHandler}>
          <label className="labels" htmlFor="username">
            Name
          </label>
          <br />
          <input
            required
            className="username input"
            placeholder="Name"
            name="username"
            type="text"
            onChange={(e) => setCred({ ...cred, username: e.target.value })}
          />

          <label className="labels" htmlFor="email">
            Email address
          </label>
          <br />
          <input
            required
            className="email input"
            placeholder="Email address"
            name="email"
            type="email"
            onChange={(e) => setCred({ ...cred, email: e.target.value })}
          />
          <br />

          <label className="labels" htmlFor="password">
            Password
          </label>
          <br />
          <div className="password-container">
            <input
              required
              className="password input"
              placeholder="Password (min. 6 characters)"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setCred({ ...cred, password: e.target.value })}
            />
            {!showPassword ? (
              <i
                onClick={() => setShowPassword((prev) => !prev)}
                className="show fa-solid fa-eye-slash"
              ></i>
            ) : (
              <i
                onClick={() => setShowPassword((prev) => !prev)}
                className="show fa-solid fa-eye"
              ></i>
            )}
          </div>

          {loader ? (
            <button className="auth-btn loaders">
              <div className="loader">
                <span></span>
              </div>
            </button>
          ) : (
            <button className="auth-btn" type="submit">
              Signup
            </button>
          )}
        </form>
        <p className="auth-text">
          Already have an account?{" "}
          <span>
            <Link className="login-link" to="/auth/login">
              Log In!
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
