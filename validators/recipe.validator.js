const { isPositiveInteger, isText, isOptional, sendErrors } = require("./validation");
const { DIFFICULTIES, RECIPE_STATUS } = require("../utils/constants");

const validateRecipe = (req, res, next) => {
    const { cuisineTypeId, name, instructions, difficulty, prepTimeMinutes, isPremium, status } = req.body ?? {};
    const errors = [];
    if (!isPositiveInteger(cuisineTypeId)) errors.push("cuisineTypeId debe ser un número entero positivo");
    if (!isText(name)) errors.push("name es obligatorio");
    if (!isText(instructions)) errors.push("instructions es obligatorio");
    if (!DIFFICULTIES.includes(difficulty)) errors.push(`difficulty debe ser: ${DIFFICULTIES.join(", ")}`);
    if (!isPositiveInteger(prepTimeMinutes)) errors.push("prepTimeMinutes debe ser un número entero mayor que 0");
    if (!isOptional(isPremium) && typeof isPremium !== "boolean") errors.push("isPremium debe ser true o false");
    if (!isOptional(status) && !Object.values(RECIPE_STATUS).includes(status)) errors.push("status debe ser draft o published");
    sendErrors(errors, res, next);
};

const validateFilters = (req, res, next) => {
    const { cuisineTypeId, difficulty, maxPrepTime } = req.query;
    const errors = [];
    if (cuisineTypeId !== undefined && !isPositiveInteger(Number(cuisineTypeId))) errors.push("cuisineTypeId debe ser un número entero positivo");
    if (difficulty !== undefined && !DIFFICULTIES.includes(difficulty)) errors.push(`difficulty debe ser: ${DIFFICULTIES.join(", ")}`);
    if (maxPrepTime !== undefined && !isPositiveInteger(Number(maxPrepTime))) errors.push("maxPrepTime debe ser un número entero positivo");
    sendErrors(errors, res, next);
};

const validateIngredientAmount = (req, res, next) => {
    const { quantity, unit } = req.body ?? {};
    const errors = [];
    if (!isOptional(quantity) && !(typeof quantity === "number" && quantity >= 0)) errors.push("quantity debe ser un número mayor o igual a 0");
    if (!isOptional(unit) && typeof unit !== "string") errors.push("unit debe ser texto");
    sendErrors(errors, res, next);
};

module.exports = { validateRecipe, validateFilters, validateIngredientAmount };
