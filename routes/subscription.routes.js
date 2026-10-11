const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.controller");
const { requireUser, onlyAdmin } = require("../middlewares/auth.middleware");
const { validateSubscriptionStatus } = require("../validators/interaction.validator");

router.get("/", requireUser, onlyAdmin, validateSubscriptionStatus, subscriptionController.getAll);

module.exports = router;
