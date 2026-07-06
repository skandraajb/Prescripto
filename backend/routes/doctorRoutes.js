const express = require("express");

const router = express.Router();

const { submitVerification } = require("../controllers/doctorController");

const { protect } = require("../middleware/authMiddleware");

router.post(
    "/verification",
    protect,
    submitVerification
);

module.exports = router;