import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../../App";
import "./signup.css";

const DoctorVerification = () => {

    const navigate = useNavigate();

    const { setshowheaderfooter } = useContext(MyContext);

    useEffect(() => {

        setshowheaderfooter(false);

        return () => setshowheaderfooter(true);

    }, [setshowheaderfooter]);

    const [formData, setFormData] = useState({

        registrationNumber: "",
        qualification: "",
        specialization: "",
        experience: "",
        clinicName: "",

        medicalLicense: null,
        degreeCertificate: null,
        governmentId: null

    });

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        if (files) {

            setFormData({
                ...formData,
                [name]: files[0]
            });

        } else {

            setFormData({
                ...formData,
                [name]: value
            });

        }

    };

    const handleSubmit = async () => {

        try {

            const token = localStorage.getItem("token");
            console.log("TOKEN BEFORE SUBMIT:", token);

            await axios.post(

                "http://localhost:5000/api/doctor/submit",

                {
                    registrationNumber: formData.registrationNumber,
                    qualification: formData.qualification,
                    specialization: formData.specialization,
                    experience: formData.experience,
                    clinicName: formData.clinicName
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            alert("Verification submitted successfully.");

            navigate("/doctor/verification-status");

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                "Submission failed."
            );

        }

    };

    return (

        <div className="verification-container">

            <div className="verification-card">

                <h2>Doctor Verification</h2>

                <p>
                    Complete your professional profile.
                    Your account will become active only after successful verification.
                </p>

                <input
                    type="text"
                    name="registrationNumber"
                    placeholder="Medical Registration Number"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="qualification"
                    placeholder="Qualification"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="experience"
                    placeholder="Years of Experience"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="clinicName"
                    placeholder="Clinic / Hospital Name"
                    onChange={handleChange}
                />

                <label>Medical License</label>

                <input
                    type="file"
                    name="medicalLicense"
                    onChange={handleChange}
                />

                <label>Degree Certificate</label>

                <input
                    type="file"
                    name="degreeCertificate"
                    onChange={handleChange}
                />

                <label>Government ID</label>

                <input
                    type="file"
                    name="governmentId"
                    onChange={handleChange}
                />

                <button onClick={handleSubmit}>

                    Submit For Verification

                </button>

            </div>

        </div>

    );

};

export default DoctorVerification;