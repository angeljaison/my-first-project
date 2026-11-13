
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConsumerDashboard.css";


  function ConsumerDashboard() {
  const navigate = useNavigate();
  const API_URL = "https://58rc3pcr-5000.inc1.devtunnels.ms";
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Consumer details
   const consumer = {
    name: user?.name || "Consumer",
    email: user?.email || "",
    initials: user?.name
      ? user.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "CU",
  };
    // Providers fetched from JSON Server
  const [providers, setProviders] = useState([]);

  // Request form states
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Submitted requests
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || user.userType !== "consumer") {
          navigate("/");
          return;
        }

        // GET providers
        const providersRes = await fetch(
          `${API_URL}/users?userType=provider`
        );

        if (!providersRes.ok) {
          throw new Error("Unable to fetch providers");
        }

        const providersData = await providersRes.json();
        setProviders(providersData);

        // GET consumer requests
        const requestsRes = await fetch(
          `${API_URL}/requests?consumerId=${encodeURIComponent(user.id)}`
        );

        if (!requestsRes.ok) {
          throw new Error("Unable to fetch requests");
        }

        const requestsData = await requestsRes.json();
        setRequests(requestsData);

      } catch (error) {
        console.error("Fetch error:", error);
        alert("Unable to connect to the server.");
      }
    };

    fetchData();
  }, [navigate, user]);


  // Logout
  const handleLogout = () => {
  localStorage.removeItem("user");
  navigate("/");
  };
  // Open Create Request popup
  const handleCreateRequest = (provider) => {
    setSelectedProvider(provider);
    setSelectedPlatforms([]);
    setFromDate("");
    setToDate("");
  };

  // Close popup
  const handleCloseModal = () => {
    setSelectedProvider(null);
    setSelectedPlatforms([]);
    setFromDate("");
    setToDate("");
  };

  // Select or deselect platforms
  const handlePlatformSelect = (platform) => {
    setSelectedPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((item) => item !== platform)
        : [...previous, platform]
    );
  };

  // Submit service request
  const handleSubmitRequest = async(event) => {
    event.preventDefault();

    const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!user || user.userType !== "consumer") {
    alert("Please login as a consumer.");
    navigate("/");
    return;
  }

  if (
    !selectedProvider ||
    selectedPlatforms.length === 0 ||
    !fromDate ||
    !toDate
  ) {
    alert("Please complete all required fields.");
    return;
  }

  if (new Date(toDate) <= new Date(fromDate)) {
    alert("End date and time must be after start date and time.");
    return;
  }

  const newRequest = {
    providerId: String(selectedProvider.id),
    providerName: selectedProvider.name,
    consumerId: String(user.id),
    consumerName: user.name,
    consumerEmail: user.email,
    platforms: [...selectedPlatforms],
    platform: selectedPlatforms.join(", "),
    from: fromDate,
    to: toDate,
    status: "Pending",
  };

  try {
    const response = await fetch(`${API_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRequest),
    });

    if (!response.ok) {
      throw new Error("Failed to create request");
    }

    const createdRequest = await response.json();

    setRequests((previousRequests) => [
      ...previousRequests,
      createdRequest,
    ]);

    alert("Your request has been submitted successfully!");

    handleCloseModal();

  } catch (error) {
    console.error("Request submission error:", error);
    alert("Unable to submit request. Please try again.");
  }
};
  return (
    <div className="consumer-dashboard">

      {/* NAVIGATION BAR */}

      <header className="consumer-navbar">

        <div className="consumer-brand">

          <div className="consumer-brand-icon">
            <span>▣</span>
          </div>

          <h1>
            Platform<span>Connect</span>
          </h1>

        </div>

        <div className="consumer-navbar-right">

          <div className="consumer-info">
            <h4>{consumer.name}</h4>
            <p>{consumer.email}</p>
          </div>

          <div className="consumer-avatar">
            {consumer.initials}
          </div>

          <div className="consumer-divider"></div>

          <button
            className="consumer-logout"
            onClick={handleLogout}
            type="button"
          >
            <span>⇥</span>
            Logout
          </button>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main className="consumer-main">

        {/* PAGE HEADING */}

        <div className="providers-heading">

          <div>
            <h2>Available Providers</h2>

            <p>
              Browse and request services from registered platform providers.
            </p>
          </div>

          <span className="provider-count">
            {providers.length} Providers Found
          </span>

        </div>


        {/* PROVIDER CARDS */}

        <div className="provider-grid">

          {providers.map((provider) => (

            <div
              className="consumer-provider-card"
              key={provider.id}
            >

              {/* PROVIDER HEADER */}

              <div className="provider-card-header">

                <div className="provider-avatar">
                  {provider.initials}
                </div>

                <h3>{provider.name}</h3>

              </div>


              {/* CONTACT DETAILS */}

              <div className="provider-contact">

                <div className="contact-item">
                  <span className="contact-icon">✉</span>
                  <span>{provider.email}</span>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">☎</span>
                  <span>{provider.phone}</span>
                </div>

                <div className="contact-item">
                  <span className="contact-icon">⌖</span>
                  <span>{provider.address}</span>
                </div>

              </div>


              {/* SUPPORTED PLATFORMS */}

              <div className="supported-platforms">

                <label>SUPPORTED PLATFORMS</label>

                <div className="consumer-platform-tags">

                  {provider.platforms.map((platform) => (

                    <span key={platform}>
                      {platform}
                    </span>

                  ))}

                </div>

              </div>


              {/* CREATE REQUEST BUTTON */}

              <button
                className="create-request-button"
                onClick={() => handleCreateRequest(provider)}
                type="button"
              >
                <span>⊕</span>
                Create Request
              </button>

            </div>

          ))}

        </div>


        {/* MY REQUESTS SECTION */}

        {requests.length > 0 && (

          <section className="my-requests-section">

            <h2>My Requests</h2>

            <p>Track your submitted service requests.</p>

            <div className="my-requests-list">

              {requests.map((request) => (

                <div
                  className="my-request-item"
                  key={request.id}
                >

                  <div className="my-request-details">

                    <h4>{request.provider}</h4>

                    <p>
                      Platforms: {request.platforms.join(", ")}
                    </p>

                    <p>
                      From: {new Date(request.from).toLocaleString()}
                    </p>

                    <p>
                      To: {new Date(request.to).toLocaleString()}
                    </p>

                  </div>

                  <span className="consumer-pending">
                    {request.status}
                  </span>

                </div>

              ))}

            </div>

          </section>

        )}

      </main>


      {/* CREATE REQUEST POPUP */}

      {selectedProvider && (

        <div
          className="request-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="request-modal"
            onClick={(event) => event.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="request-modal-header">

              <div>

                <h2>Create Request</h2>

                <p>
                  Select a platform and time to request access from{" "}
                  <strong>{selectedProvider.name}</strong>.
                </p>

              </div>

              <button
                type="button"
                className="request-close"
                onClick={handleCloseModal}
                aria-label="Close popup"
              >
                ×
              </button>

            </div>


            {/* REQUEST FORM */}

            <form onSubmit={handleSubmitRequest}>

              <div className="request-modal-content">


                {/* PLATFORM SELECTION */}

                <div className="request-section">

                  <label className="request-section-label">
                    AVAILABLE PLATFORMS <span>*</span>
                  </label>

                  <div className="request-platform-grid">

                    {selectedProvider.platforms.map((platform) => (

                      <button
                        type="button"
                        key={platform}
                        className={`request-platform-option ${
                          selectedPlatforms.includes(platform)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handlePlatformSelect(platform)}
                        aria-pressed={selectedPlatforms.includes(platform)}
                      >

                        <span>{platform}</span>

                        {selectedPlatforms.includes(platform) && (
                          <span className="platform-check">✓</span>
                        )}

                      </button>

                    ))}

                  </div>

                </div>


                {/* TIME DURATION */}

                <div className="request-section">

                  <label className="request-section-label">
                    TIME DURATION <span>*</span>
                  </label>

                  <div className="request-date-grid">

                    {/* FROM DATE */}

                    <div className="request-date-field">

                      <label htmlFor="fromDate">From</label>

                      <input
                        type="datetime-local"
                        id="fromDate"
                        value={fromDate}
                        onChange={(event) =>
                          setFromDate(event.target.value)
                        }
                        required
                      />

                    </div>


                    {/* TO DATE */}

                    <div className="request-date-field">

                      <label htmlFor="toDate">To</label>

                      <input
                        type="datetime-local"
                        id="toDate"
                        value={toDate}
                        min={fromDate || undefined}
                        onChange={(event) =>
                          setToDate(event.target.value)
                        }
                        required
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* MODAL FOOTER */}

              <div className="request-modal-footer">

                <button
                  type="submit"
                  className="request-submit-button"
                  disabled={
                    selectedPlatforms.length === 0 ||
                    !fromDate ||
                    !toDate ||
                    new Date(toDate) <= new Date(fromDate)
                  }
                >
                  Submit Request
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default ConsumerDashboard;
