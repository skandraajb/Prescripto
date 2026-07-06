import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { MyContext } from "../../App";
import "./signup.css";

const PatientSignup = () => {
  const navigate = useNavigate();
  const { setshowheaderfooter } = useContext(MyContext);

  useEffect(() => {
    setshowheaderfooter(false);

    return () => setshowheaderfooter(true);
  }, [setshowheaderfooter]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      alert(response.data.message || "Account created successfully! Please sign in.");

      navigate("/signin");

    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="patient-signup-container">
      <div className="signup-box">

        <h2>👤 Patient Signup</h2>
        <p>Create your patient account</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button onClick={handleSignup}>
          Create Account
        </button>

        <p className="bottom-text">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>

      </div>
    </div>
  );
};

export default PatientSignup;