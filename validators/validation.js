const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const isText = (value) => typeof value === "string" && value.trim() !== "";

const isOptional = (value) => value === undefined || value === null;

const sendErrors = (errors, res, next) => {
    if (errors.length > 0) return res.status(400).json({ error: "Datos inválidos", details: errors });
    next();
};

const ID_PATTERN = /^[1-9]\d*$/;

const checkParams = (req, res, next, names) => {
    const errors = names
        .filter((name) => !ID_PATTERN.test(req.params[name]))
        .map((name) => `${name} debe ser un número entero positivo`);
    sendErrors(errors, res, next);
};

const checkUserIdParam = (req, res, next) => checkParams(req, res, next, ["userId"]);

const checkRecipeIdParam = (req, res, next) => checkParams(req, res, next, ["recipeId"]);

const checkRecipeAndIngredientParams = (req, res, next) => checkParams(req, res, next, ["recipeId", "ingredientId"]);

module.exports = { isPositiveInteger, isText, isOptional, sendErrors, checkUserIdParam, checkRecipeIdParam, checkRecipeAndIngredientParams };
