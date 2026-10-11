const express = require("express");
const router = express.Router({ mergeParams: true });
const activityController = require("../controllers/activity.controller");
const { requireUser, onlyAccountOwner } = require("../middlewares/auth.middleware");
const { checkUserIdParam } = require("../validators/validation");
const { validateRecipeId, validateMonth } = require("../validators/interaction.validator");

router.use(requireUser, checkUserIdParam, onlyAccountOwner);

router.get("/", validateMonth, activityController.getByMonth);
router.post("/", validateRecipeId, activityController.create);
router.get("/summary", validateMonth, activityController.getSummary);

module.exports = router;
