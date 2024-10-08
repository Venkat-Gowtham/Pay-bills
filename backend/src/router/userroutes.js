const express = require("express");
const { getUserData } = require("../controllers/userController");
const router = express.Router();

router.get("/userdata/:email", getUserData);

module.exports = router;
