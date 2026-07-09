const User = require("../models/User");
const DoctorVerification = require("../models/DoctorVerification");
const { createDoctorVerification } = require("../Services/serviceNowService");

// =======================================
// Submit Doctor Verification
// =======================================

exports.submitVerification = async (req, res) => {

    try {

        if (req.user.role !== "doctor") {
            return res.status(403).json({
                message: "Only doctors can submit verification."
            });
        }

        const {
            registrationNumber,
            qualification,
            specialization,
            experience,
            clinicName
        } = req.body;

        // Find existing verification or create new
        let verification = await DoctorVerification.findOne({
            doctor: req.user._id
        });

        if (!verification) {
            verification = new DoctorVerification({
                doctor: req.user._id
            });
        }

        // Update verification document
        verification.registrationNumber = registrationNumber;
        verification.qualification = qualification;
        verification.specialization = specialization;
        verification.experience = experience;
        verification.clinicName = clinicName;

        // Get doctor
        const doctor = await User.findById(req.user._id);

        doctor.registrationNumber = registrationNumber;
        doctor.qualification = qualification;
        doctor.specialization = specialization;
        doctor.experience = experience;
        doctor.clinicName = clinicName;

        // =======================================
        // Create record in ServiceNow FIRST
        // =======================================

        const serviceNowRecord = await createDoctorVerification(doctor);

        // =======================================
        // Save only if ServiceNow succeeds
        // =======================================

        verification.serviceNowRequestId = serviceNowRecord.sys_id;
        await verification.save();

        doctor.verificationStatus = "Submitted";
        doctor.serviceNowRequestId = serviceNowRecord.sys_id;

        await doctor.save();

        res.status(200).json({
            message: "Verification submitted successfully.",
            serviceNowRequestId: serviceNowRecord.sys_id
        });

    } catch (err) {

        console.log("========= ERROR =========");
        console.log(err.response?.data || err.message);

        res.status(500).json({
            message: "Verification submission failed.",
            error: err.response?.data || err.message
        });

    }

};

// =======================================
// Get Verification Status
// =======================================

exports.getVerificationStatus = async (req, res) => {

    try {

        const doctor = await User.findById(req.user._id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            verificationStatus: doctor.verificationStatus,
            rejectionReason: doctor.rejectionReason,
            verifiedAt: doctor.verifiedAt
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};
// =======================================
// Update Verification Status (ServiceNow)
// =======================================

exports.updateVerificationStatus = async (req, res) => {

    try {

        const {
            serviceNowRequestId,
            status,
            remarks
        } = req.body;

        if (!serviceNowRequestId || !status) {
            return res.status(400).json({
                message: "serviceNowRequestId and status are required."
            });
        }

        const doctor = await User.findOne({
            serviceNowRequestId
        });

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found."
            });
        }

        doctor.verificationStatus = status;

        if (status === "Approved") {
            doctor.verifiedAt = new Date();
            doctor.rejectionReason = "";
        }

        if (status === "Rejected") {
            doctor.rejectionReason = remarks || "";
        }

        await doctor.save();

        res.status(200).json({
            message: "Verification status updated successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

};