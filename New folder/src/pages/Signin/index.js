import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './signin.css';

const Signin = () => {
  const { setshowheaderfooter } = useContext(MyContext);
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "patient",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setshowheaderfooter(false);
    return () => setshowheaderfooter(true);
  }, [setshowheaderfooter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );
      alert("Signin successful!");

      // Save token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem('role', response.data.role);   // <-- make sure this is present


      if (response.data.role === "doctor") {
        navigate("/DoctorDashboard");
      } else {
        navigate("/Dashboard");
      }

    } catch (error) {
      alert("Signin failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <section>
      <div className="signin-container">
        <div className="signin-content">
          <div className="signin-form">
            <Link to="/"><div className="signin-logo"></div></Link>

            <div className="toggle-container">
              <span className={role === "patient" ? "active" : ""} onClick={() => {
                setRole("patient");
                setFormData({ ...formData, role: "patient" });
              }}>
                Patient
              </span>
              <span className={role === "doctor" ? "active" : ""} onClick={() => {
                setRole("doctor");
                setFormData({ ...formData, role: "doctor" });
              }}>
                Doctor
              </span>
            </div>

            <h3 style={{ color: '#014770' }}>Sign In</h3>
            <center><input type="email" name="email" placeholder="Email" className="em-i" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" className="pas-i" onChange={handleChange} />

            <button className="signin-b" onClick={handleSignin}>Sign In</button></center>

            <div className="not">
              <p>Not Registered?</p>
              <Link to="/Signup">Signup</Link>
            </div>
            <div className="other"><h3>Or</h3></div>
            <div className="google-sign"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
