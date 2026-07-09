const express = require("express");

const router = express.Router();
const {

    submitVerification,
    getVerificationStatus,
    updateVerificationStatus

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
router.post(

    "/update-status",

    updateVerificationStatus

);

module.exports = router;