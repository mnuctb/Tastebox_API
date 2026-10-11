const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const subscriptionController = require("../controllers/subscription.controller");
const { requireUser, onlyAdmin, onlyAccountOwner } = require("../middlewares/auth.middleware");
const { checkUserIdParam } = require("../validators/validation");
const { validateRegister, validateUpdate, validateStatus } = require("../validators/user.validator");
const { validatePlanId } = require("../validators/interaction.validator");

router.post("/", validateRegister, userController.register);
router.get("/", requireUser, onlyAdmin, userController.getAll);
router.get("/:userId", requireUser, checkUserIdParam, onlyAccountOwner, userController.getById);
router.patch("/:userId", requireUser, checkUserIdParam, onlyAccountOwner, validateUpdate, userController.update);
router.patch("/:userId/status", requireUser, onlyAdmin, checkUserIdParam, validateStatus, userController.changeStatus);

router.get("/:userId/subscription", requireUser, checkUserIdParam, onlyAccountOwner, subscriptionController.getCurrent);
router.get("/:userId/subscriptions", requireUser, checkUserIdParam, onlyAccountOwner, subscriptionController.getHistory);
router.post("/:userId/subscriptions", requireUser, checkUserIdParam, onlyAccountOwner, validatePlanId, subscriptionController.changePlan);

module.exports = router;
