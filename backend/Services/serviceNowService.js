require("dotenv").config();
const axios = require("axios");

const instance = process.env.SERVICENOW_INSTANCE;
const username = process.env.SERVICENOW_USERNAME;
const password = process.env.SERVICENOW_PASSWORD;

exports.createDoctorVerification = async (doctor) => {

    try {
        console.log("========== SERVICENOW CONFIG ==========");
        console.log("Instance:", instance);
        console.log("Username:", username);
        console.log("Password exists:", !!password);

        const response = await axios.post(

            `${instance}/api/x_1958820_prescr_0/prescripto_api/doctor-verification`,

            {
                doctor_name: doctor.name,
                email: doctor.email,
                mongo_user_id: doctor._id.toString(),
                registration_number: doctor.registrationNumber,
                qualification: doctor.qualification,
                specialization: doctor.specialization,
                experience: doctor.experience,
                clinic_name: doctor.clinicName
            },

            {
                auth: {
                    username,
                    password
                },

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }

        );

        console.log("========== SERVICENOW SUCCESS ==========");
        console.log(response.data);

        return response.data.result;

    }

    catch (err) {

        console.log("========== SERVICENOW ERROR ==========");

        console.log(err.response?.status);
        console.log(err.response?.data);

        throw err;

    }

};