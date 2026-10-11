const recipeDao = require("../dao/recipe.dao");
const recipeViewDao = require("../dao/recipeView.dao");
const getUserPlan = require("../utils/userPlan");
const { ROLES, RECIPE_STATUS } = require("../utils/constants");

const getAccessError = async (userId, recipe) => {
    const plan = await getUserPlan(userId);
    if (plan.monthlyRecipeLimit === null) return null;
    if (recipe.isPremium) return "Esta receta es exclusiva del plan Premium";
    if (await recipeViewDao.wasViewedThisMonth(userId, recipe.id)) return null;
    const viewedRecipes = await recipeViewDao.countViewedThisMonth(userId);
    if (viewedRecipes >= plan.monthlyRecipeLimit) {
        return `Ya consultó las ${plan.monthlyRecipeLimit} recetas que permite su plan este mes`;
    }
    return null;
};

const sendRecipeWithIngredients = async (res, recipe, status = 200) => {
    const ingredients = await recipeDao.getIngredients(recipe.id);
    res.status(status).json({ ...recipe, ingredients });
};

const getAll = async (req, res) => {
    const isAdmin = req.user?.role === ROLES.admin;
    const status = isAdmin ? req.query.status : RECIPE_STATUS.published;
    res.json(await recipeDao.getAll({ ...req.query, status }));
};

const getById = async (req, res) => {
    const recipeId = Number(req.params.recipeId);
    if (req.user.role === ROLES.admin) {
        const recipe = await recipeDao.getById(recipeId);
        if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
        return sendRecipeWithIngredients(res, recipe);
    }
    const recipe = await recipeDao.getPublishedById(recipeId);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    const accessError = await getAccessError(req.user.id, recipe);
    if (accessError) return res.status(403).json({ error: accessError });
    await recipeViewDao.create(req.user.id, recipe.id);
    sendRecipeWithIngredients(res, recipe);
};

const create = async (req, res) => {
    const recipeId = await recipeDao.create(req.body);
    sendRecipeWithIngredients(res, await recipeDao.getById(recipeId), 201);
};

const update = async (req, res) => {
    const recipeId = Number(req.params.recipeId);
    if (!await recipeDao.getById(recipeId)) return res.status(404).json({ error: "Receta no encontrada" });
    await recipeDao.update(recipeId, req.body);
    sendRecipeWithIngredients(res, await recipeDao.getById(recipeId));
};

const remove = async (req, res) => {
    const recipeId = Number(req.params.recipeId);
    if (!await recipeDao.getById(recipeId)) return res.status(404).json({ error: "Receta no encontrada" });
    await recipeDao.remove(recipeId);
    res.status(204).end();
};

const saveIngredient = async (req, res) => {
    const recipe = await recipeDao.getById(Number(req.params.recipeId));
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    await recipeDao.saveIngredient(recipe.id, Number(req.params.ingredientId), req.body);
    sendRecipeWithIngredients(res, recipe);
};

const removeIngredient = async (req, res) => {
    const wasRemoved = await recipeDao.removeIngredient(Number(req.params.recipeId), Number(req.params.ingredientId));
    if (!wasRemoved) return res.status(404).json({ error: "La receta no tiene ese ingrediente" });
    res.status(204).end();
};

module.exports = { getAll, getById, create, update, remove, saveIngredient, removeIngredient };
