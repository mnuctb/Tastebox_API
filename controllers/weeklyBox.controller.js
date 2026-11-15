const weeklyBoxDao = require("../dao/weeklyBox.dao");
const recipeDao = require("../dao/recipe.dao");
const getUserPlan = require("../utils/userPlan");
const { isMonday } = require("../utils/dates");
const { ROLES, HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");

const getCurrent = async (req, res) => {
    if (req.user.role !== ROLES.admin) {
        const plan = await getUserPlan(req.user.id);
        if (!plan.includesWeeklyBox) return res.status(HTTP_STATUS.forbidden).json({ error: "La caja semanal es un beneficio del plan Premium" });
    }
    const weeklyBox = await weeklyBoxDao.getCurrent();
    if (!weeklyBox) return res.status(HTTP_STATUS.notFound).json({ error: "No hay caja semanal disponible" });
    const ingredients = await recipeDao.getIngredients(weeklyBox.recipeId);
    res.json({ ...weeklyBox, ingredients });
};

const create = async (req, res) => {
    if (!isMonday(req.body.weekStartDate)) return res.status(HTTP_STATUS.badRequest).json({ error: "weekStartDate debe ser un lunes" });
    if (!await recipeDao.getById(req.body.recipeId)) return res.status(HTTP_STATUS.notFound).json({ error: ERROR_MESSAGES.recipeNotFound });
    const weeklyBoxId = await weeklyBoxDao.create(req.body);
    res.status(HTTP_STATUS.created).json(await weeklyBoxDao.getById(weeklyBoxId));
};

module.exports = { getCurrent, create };
