const mongoose = require("mongoose");

const doctorVerificationSchema = new mongoose.Schema({

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    registrationNumber: {
        type: String,
        required: true
    },

    qualification: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    experience: {
        type: Number,
        required: true
    },

    clinicName: {
        type: String,
        required: true
    },

    medicalLicense: {
        type: String,
        default: null
    },

    degreeCertificate: {
        type: String,
        default: null
    },

    governmentId: {
        type: String,
        default: null
    },

    serviceNowRequestId: {
        type: String,
        default: null
    },

    remarks: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "DoctorVerification",
    doctorVerificationSchema
);
