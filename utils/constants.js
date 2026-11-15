const ROLES = { user: "user", admin: "admin" };
const USER_STATUS = { active: "active", suspended: "suspended" };
const RECIPE_STATUS = { draft: "draft", published: "published" };
const DIFFICULTIES = ["easy", "medium", "hard"];
const SUBSCRIPTION_STATUS = { active: "active", expired: "expired", cancelled: "cancelled" };
const PAID_PLAN_MONTHS = 1;
const USER_HEADER = "X-User-Id";
const HTTP_STATUS = { created: 201, noContent: 204, badRequest: 400, unauthorized: 401, forbidden: 403, notFound: 404, conflict: 409, internalError: 500 };
const ERROR_MESSAGES = { recipeNotFound: "Receta no encontrada", userNotFound: "Usuario no encontrado" };

module.exports = { ROLES, USER_STATUS, RECIPE_STATUS, DIFFICULTIES, SUBSCRIPTION_STATUS, PAID_PLAN_MONTHS, USER_HEADER, HTTP_STATUS, ERROR_MESSAGES };
