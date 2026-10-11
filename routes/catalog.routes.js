const express = require("express");
const router = express.Router();
const catalogController = require("../controllers/catalog.controller");
const subscriptionController = require("../controllers/subscription.controller");
const { requireUser, onlyAdmin } = require("../middlewares/auth.middleware");
const { validateName } = require("../validators/interaction.validator");

router.get("/plans", subscriptionController.getPlans);
router.get("/cuisine-types", catalogController.getCuisineTypes);
router.get("/ingredients", catalogController.getIngredients);
router.post("/ingredients", requireUser, onlyAdmin, validateName, catalogController.createIngredient);
router.get("/tags", catalogController.getTags);

module.exports = router;
