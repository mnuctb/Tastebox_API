const collectionDao = require("../dao/collection.dao");
const recipeDao = require("../dao/recipe.dao");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");

const getAll = async (req, res) => {
    res.json(await collectionDao.getByUser(Number(req.params.userId)));
};

const add = async (req, res) => {
    const userId = Number(req.params.userId);
    const { recipeId } = req.body;
    if (!await recipeDao.getPublishedById(recipeId)) return res.status(HTTP_STATUS.notFound).json({ error: ERROR_MESSAGES.recipeNotFound });
    if (await collectionDao.exists(userId, recipeId)) return res.status(HTTP_STATUS.conflict).json({ error: "La receta ya está en la colección" });
    await collectionDao.add(userId, recipeId);
    res.status(HTTP_STATUS.created).json(await collectionDao.getByUser(userId));
};

const remove = async (req, res) => {
    const wasRemoved = await collectionDao.remove(Number(req.params.userId), Number(req.params.recipeId));
    if (!wasRemoved) return res.status(HTTP_STATUS.notFound).json({ error: "La receta no está en la colección" });
    res.status(HTTP_STATUS.noContent).end();
};

module.exports = { getAll, add, remove };
