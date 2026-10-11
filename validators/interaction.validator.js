const { isPositiveInteger, isText, isOptional, sendErrors } = require("./validation");
const { SUBSCRIPTION_STATUS } = require("../utils/constants");

const MIN_RATING = 1;
const MAX_RATING = 5;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const validateRecipeId = (req, res, next) => {
    const errors = isPositiveInteger(req.body?.recipeId) ? [] : ["recipeId debe ser un número entero positivo"];
    sendErrors(errors, res, next);
};

const validatePlanId = (req, res, next) => {
    const errors = isPositiveInteger(req.body?.planId) ? [] : ["planId debe ser un número entero positivo"];
    sendErrors(errors, res, next);
};

const validateMonth = (req, res, next) => {
    const { month } = req.query;
    const errors = month === undefined || MONTH_PATTERN.test(month) ? [] : ["month debe tener el formato AAAA-MM"];
    sendErrors(errors, res, next);
};

const validateSubscriptionStatus = (req, res, next) => {
    const { status } = req.query;
    const statusList = Object.values(SUBSCRIPTION_STATUS);
    const errors = status === undefined || statusList.includes(status) ? [] : [`status debe ser: ${statusList.join(", ")}`];
    sendErrors(errors, res, next);
};

const validateReview = (req, res, next) => {
    const { rating, comment, wouldCookAgain, tagIds } = req.body ?? {};
    const errors = [];
    if (!Number.isInteger(rating) || rating < MIN_RATING || rating > MAX_RATING) errors.push(`rating debe ser un número entero entre ${MIN_RATING} y ${MAX_RATING}`);
    if (!isOptional(comment) && typeof comment !== "string") errors.push("comment debe ser texto");
    if (!isOptional(wouldCookAgain) && typeof wouldCookAgain !== "boolean") errors.push("wouldCookAgain debe ser true o false");
    if (tagIds !== undefined && !(Array.isArray(tagIds) && tagIds.every(isPositiveInteger))) errors.push("tagIds debe ser una lista de ids");
    sendErrors(errors, res, next);
};

const validateWeeklyBox = (req, res, next) => {
    const { recipeId, name, weekStartDate } = req.body ?? {};
    const errors = [];
    if (!isPositiveInteger(recipeId)) errors.push("recipeId debe ser un número entero positivo");
    if (!isText(name)) errors.push("name es obligatorio");
    if (!DATE_PATTERN.test(String(weekStartDate))) errors.push("weekStartDate debe tener el formato AAAA-MM-DD");
    sendErrors(errors, res, next);
};

const validateName = (req, res, next) => {
    const errors = isText(req.body?.name) ? [] : ["name es obligatorio"];
    sendErrors(errors, res, next);
};

module.exports = {
    validateRecipeId,
    validatePlanId,
    validateMonth,
    validateSubscriptionStatus,
    validateReview,
    validateWeeklyBox,
    validateName
};
