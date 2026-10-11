const express = require("express");
const router = express.Router({ mergeParams: true });
const collectionController = require("../controllers/collection.controller");
const { requireUser, onlyAccountOwner } = require("../middlewares/auth.middleware");
const { checkUserIdParam, checkRecipeIdParam } = require("../validators/validation");
const { validateRecipeId } = require("../validators/interaction.validator");

router.use(requireUser, checkUserIdParam, onlyAccountOwner);

router.get("/", collectionController.getAll);
router.post("/", validateRecipeId, collectionController.add);
router.delete("/:recipeId", checkRecipeIdParam, collectionController.remove);

module.exports = router;
