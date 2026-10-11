const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const reviewController = require("../controllers/review.controller");
const { requireUser, optionalUser, onlyAdmin } = require("../middlewares/auth.middleware");
const { checkRecipeIdParam, checkRecipeAndIngredientParams } = require("../validators/validation");
const { validateRecipe, validateFilters, validateIngredientAmount } = require("../validators/recipe.validator");
const { validateReview } = require("../validators/interaction.validator");

router.get("/", optionalUser, validateFilters, recipeController.getAll);
router.get("/:recipeId", requireUser, checkRecipeIdParam, recipeController.getById);
router.post("/", requireUser, onlyAdmin, validateRecipe, recipeController.create);
router.put("/:recipeId", requireUser, onlyAdmin, checkRecipeIdParam, validateRecipe, recipeController.update);
router.delete("/:recipeId", requireUser, onlyAdmin, checkRecipeIdParam, recipeController.remove);

router.put("/:recipeId/ingredients/:ingredientId", requireUser, onlyAdmin, checkRecipeAndIngredientParams, validateIngredientAmount, recipeController.saveIngredient);
router.delete("/:recipeId/ingredients/:ingredientId", requireUser, onlyAdmin, checkRecipeAndIngredientParams, recipeController.removeIngredient);

router.get("/:recipeId/reviews", checkRecipeIdParam, reviewController.getByRecipe);
router.post("/:recipeId/reviews", requireUser, checkRecipeIdParam, validateReview, reviewController.create);

module.exports = router;
