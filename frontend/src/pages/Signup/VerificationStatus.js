import { useContext, useEffect } from "react";
import { MyContext } from "../../App";
import "./signup.css";

const VerificationStatus = () => {

    const { setshowheaderfooter } = useContext(MyContext);

    useEffect(() => {

        setshowheaderfooter(false);

        return () => setshowheaderfooter(true);

    }, [setshowheaderfooter]);

    const status = "Submitted";

    return (

        <div className="status-container">

            <div className="status-card">

                <div className="status-icon">
                    🟡
                </div>

                <h2>Verification Submitted</h2>

                <p>
                    Your verification request has been received.
                </p>

                <div className="status-box">

                    <h3>Current Status</h3>

                    <span className="submitted-status">

                        {status}

                    </span>

                </div>

                <div className="status-info">

                    <p>
                        Our team is reviewing your credentials.
                    </p>

                    <p>
                        Estimated review time: 24-48 hours.
                    </p>

                </div>

            </div>

        </div>

    );

};

export default VerificationStatus;