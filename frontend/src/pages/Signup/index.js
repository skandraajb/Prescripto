import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";
import axios from "axios";
import './signup.css';

const Signup = () => {
  const { setshowheaderfooter } = useContext(MyContext);
  const [role, setRole] = useState("patient");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "patient",
    gender: "",
    dob: "",
    address: "",
    bloodGroup: "",
    medicalHistory: "",
    profilePic: ""
  });

  useEffect(() => {
    setshowheaderfooter(false);
    return () => setshowheaderfooter(true);
  }, [setshowheaderfooter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Signup successful!");
      // Optionally redirect to signin page here
    } catch (error) {
      alert("Signup failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="signin-background">
      <section>
        <div className="signup-container">
          <div className="signin-content">
            <div className="signup-form">
              <Link to="/"><div className="signin-logo"></div></Link>

              <div className="toggle-container">
                <span
                  className={role === "patient" ? "active" : ""}
                  onClick={() => {
                    setRole("patient");
                    setFormData({ ...formData, role: "patient" });
                  }}
                >
                  Patient
                </span>
                <span
                  className={role === "doctor" ? "active" : ""}
                  onClick={() => {
                    setRole("doctor");
                    setFormData({ ...formData, role: "doctor" });
                  }}
                >
                  Doctor
                </span>
              </div>

              <h3 style={{ color: "#014770" }}>Create Account</h3>

              <div className="form-row">
                <div className="form-column">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="contact_i"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="contact_i"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="contact_i"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea
                    name="address"
                    placeholder="Address"
                    className="contact_i"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                  ></textarea>
                  <textarea
                    name="medicalHistory"
                    placeholder="Medical History"
                    className="contact_i"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows={3}
                  ></textarea>
                </div>

                <div className="form-column">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="contact_i"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="contact_i"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    className="contact_i"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="contact_i"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <input
                    type="text"
                    name="profilePic"
                    placeholder="Profile Picture URL"
                    className="contact_i"
                    value={formData.profilePic}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <center><button className="signin-b" onClick={handleSignup}>Sign Up</button></center>

              <div className="not">
                <p>Already Registered?</p>
                <Link to="/Signin">Signin</Link>
              </div>

              <div className="other"><h3>Or</h3></div>
              <div className="google-sign"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Signup;
