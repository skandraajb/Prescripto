const express = require("express");

const router = express.Router();

const {

    submitVerification,
    getVerificationStatus
} = require("../controllers/doctorController");

const {

    protect

} = require("../middleware/authMiddleware");

router.post(

    "/submit",

    protect,

    submitVerification

);

router.get(

    "/status",

    protect,

    getVerificationStatus

);

module.exports = router;