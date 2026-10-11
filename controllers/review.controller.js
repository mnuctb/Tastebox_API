const reviewDao = require("../dao/review.dao");
const recipeDao = require("../dao/recipe.dao");
const activityDao = require("../dao/activity.dao");
const catalogDao = require("../dao/catalog.dao");

const getReviewError = async (userId, recipeId, tagIds) => {
    if (!await activityDao.hasCooked(userId, recipeId)) return "Solo puede calificar recetas que haya marcado como preparadas";
    if (await reviewDao.exists(userId, recipeId)) return "Ya calificó esta receta";
    if (tagIds.length > 0 && await catalogDao.countTags(tagIds) !== tagIds.length) return "Alguna de las etiquetas no existe";
    return null;
};

const getByRecipe = async (req, res) => {
    const recipeId = Number(req.params.recipeId);
    if (!await recipeDao.getPublishedById(recipeId)) return res.status(404).json({ error: "Receta no encontrada" });
    res.json(await reviewDao.getByRecipe(recipeId));
};

const create = async (req, res) => {
    const recipeId = Number(req.params.recipeId);
    const tagIds = [...new Set(req.body.tagIds ?? [])];
    if (!await recipeDao.getPublishedById(recipeId)) return res.status(404).json({ error: "Receta no encontrada" });
    const reviewError = await getReviewError(req.user.id, recipeId, tagIds);
    if (reviewError) return res.status(409).json({ error: reviewError });
    const reviewId = await reviewDao.create(req.user.id, recipeId, req.body);
    if (tagIds.length > 0) await reviewDao.addTags(reviewId, tagIds);
    res.status(201).json(await reviewDao.getById(reviewId));
};

module.exports = { getByRecipe, create };
