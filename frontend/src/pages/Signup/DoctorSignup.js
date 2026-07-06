import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../../App";
import "./signup.css";

const DoctorSignup = () => {
    const navigate = useNavigate();
    const { setshowheaderfooter } = useContext(MyContext);

    useEffect(() => {
        setshowheaderfooter(false);

        return () => setshowheaderfooter(true);
    }, [setshowheaderfooter]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "doctor"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/signup",
                formData
            );

            alert(response.data.message || "Account created successfully! Please sign in.");

            // Redirect to Sign In page after successful signup
            navigate("/signin");

        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        }
    };

    return (
        <div className="doctor-signup-container">
            <div className="doctor-signup-card">

                <h2>🩺 Join Prescripto</h2>

                <p>
                    Create your doctor account.
                    Verification will be required after you sign in.
                </p>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button onClick={handleSignup}>
                    Create Doctor Account
                </button>

                <p className="signin-link">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>

            </div>
        </div>
    );
};

export default DoctorSignup;