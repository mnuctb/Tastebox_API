const weeklyBoxDao = require("../dao/weeklyBox.dao");
const recipeDao = require("../dao/recipe.dao");
const getUserPlan = require("../utils/userPlan");
const { isMonday } = require("../utils/dates");
const { ROLES } = require("../utils/constants");

const getCurrent = async (req, res) => {
    if (req.user.role !== ROLES.admin) {
        const plan = await getUserPlan(req.user.id);
        if (!plan.includesWeeklyBox) return res.status(403).json({ error: "La caja semanal es un beneficio del plan Premium" });
    }
    const weeklyBox = await weeklyBoxDao.getCurrent();
    if (!weeklyBox) return res.status(404).json({ error: "No hay caja semanal disponible" });
    const ingredients = await recipeDao.getIngredients(weeklyBox.recipeId);
    res.json({ ...weeklyBox, ingredients });
};

const create = async (req, res) => {
    if (!isMonday(req.body.weekStartDate)) return res.status(400).json({ error: "weekStartDate debe ser un lunes" });
    if (!await recipeDao.getById(req.body.recipeId)) return res.status(404).json({ error: "Receta no encontrada" });
    const weeklyBoxId = await weeklyBoxDao.create(req.body);
    res.status(201).json(await weeklyBoxDao.getById(weeklyBoxId));
};

module.exports = { getCurrent, create };
