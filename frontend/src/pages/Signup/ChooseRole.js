import { useNavigate } from "react-router-dom";
import "./signup.css";

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-choose-container">
      <div className="signup-card">

        <h2 className="title">Join Prescripto</h2>
        <p className="subtitle">
          Choose how you want to continue
        </p>

        <div className="role-grid">

          {/* Patient Card */}
          <div
            className="role-card patient"
            onClick={() => navigate("/signup/patient")}
          >
            <h3>👤 Patient</h3>
            <p>Book appointments, manage health records</p>
            <button>Continue</button>
          </div>

          {/* Doctor Card */}
          <div
            className="role-card doctor"
            onClick={() => navigate("/signup/doctor")}
          >
            <h3>🩺 Doctor</h3>
            <p>Join as a verified medical professional</p>
            <button>Continue</button>
          </div>

        </div>

        <p className="bottom-text">
          Already have an account? <span onClick={() => navigate("/signin")}>Sign In</span>
        </p>

      </div>
    </div>
  );
};

export default ChooseRole;