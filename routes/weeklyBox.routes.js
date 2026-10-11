const express = require("express");
const router = express.Router();
const weeklyBoxController = require("../controllers/weeklyBox.controller");
const { requireUser, onlyAdmin } = require("../middlewares/auth.middleware");
const { validateWeeklyBox } = require("../validators/interaction.validator");

router.get("/current", requireUser, weeklyBoxController.getCurrent);
router.post("/", requireUser, onlyAdmin, validateWeeklyBox, weeklyBoxController.create);

module.exports = router;
