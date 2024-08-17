const express = require("express");
const controller = require("./../Controller/userController");
const router = express.Router();

router.route("/login").post(controller.loginUser);

module.exports = router;
