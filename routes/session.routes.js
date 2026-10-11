const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/session.controller");
const { validateLogin } = require("../validators/user.validator");

router.post("/", validateLogin, sessionController.login);

module.exports = router;
