
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const API_URL = "https://58rc3pcr-5000.inc1.devtunnels.ms";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 6: Login Functionality
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/users?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      );

      if (!response.ok) {
        throw new Error("Login request failed");
      }

      const users = await response.json();

      if (users.length === 0) {
        alert("Invalid email or password.");
        return;
      }

      const user = users[0];

      localStorage.setItem("user", JSON.stringify(user));

      if (user.userType === "provider") {
        navigate("/provider-dashboard");
      } else if (user.userType === "consumer") {
        navigate("/consumer-dashboard");
      } else {
        alert("Invalid user type.");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to the server. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-content">

          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="login-form-group">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Sign In
            </button>

          </form>
        </div>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;
