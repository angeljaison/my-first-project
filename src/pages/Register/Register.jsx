import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const API_URL = "https://58rc3pcr-5000.inc1.devtunnels.ms";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    dob: "",
    userType: "",
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const platforms = [
    "Amazon Prime",
    "Netflix",
    "Hulu",
    "Disney+",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "userType" && value === "consumer") {
      setSelectedPlatforms([]);
    }
  };

const handlePlatformChange = (platform) => {
  setSelectedPlatforms((prev) =>
    prev.includes(platform)
      ? prev.filter((item) => item !== platform)
      : [...prev, platform]
  );
};

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    // Prepare registration data
    const registrationData = {
      ...formData,
      platforms:
        formData.userType === "provider"
          ? selectedPlatforms
          : [],
    };
    // STEP 1: Check whether email already exists
    const checkResponse = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(formData.email)}`
    );

    if (!checkResponse.ok) {
      throw new Error("Unable to check existing users");
    }

    const existingUsers = await checkResponse.json();

    // STEP 2: Prevent duplicate email registration
    if (existingUsers.length > 0) {
      alert("An account with this email already exists.");
      return;
    }

    // STEP 3: Register user using POST request
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const newUser = await response.json();

    console.log("Registered User:", newUser);

    // STEP 4: Show success message
    alert("Registration successful!");

    // STEP 5: Navigate to Login page
    navigate("/");

  } catch (error) {
    console.error("Registration error:", error);
    alert("Something went wrong. Please try again.");
  }
};



return (
  <div className="auth-page">
    <div className="auth-card">

      <div className="form-header">
        <h1>Create an Account</h1>
        <p>
          Enter your information to register as a consumer or provider.
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="123 Main St, City, Country"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>User Type</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
            >
              <option value="">Select a user type</option>
              <option value="consumer">Consumer</option>
              <option value="provider">Provider</option>
            </select>
          </div>

        </div>

        {/* Show platforms only for Provider */}
        {formData.userType === "provider" && (
          <div className="platform-section">

            <h3>Provider Platforms</h3>

            <p>
              Select the platforms you provide services for.
            </p>

            <div className="platform-grid">
              {platforms.map((platform) => (
                <label
                  className="platform-option"
                  key={platform}
                >
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                  />
                  <span>{platform}</span>
                </label>
              ))}
            </div>

          </div>
        )}

        <button type="submit" className="submit-button">
          Complete Registration
        </button>

      </form>
    </div>
  </div>
);
}

export default Register;