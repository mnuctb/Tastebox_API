const collectionDao = require("../dao/collection.dao");
const recipeDao = require("../dao/recipe.dao");

const getAll = async (req, res) => {
    res.json(await collectionDao.getByUser(Number(req.params.userId)));
};

const add = async (req, res) => {
    const userId = Number(req.params.userId);
    const { recipeId } = req.body;
    if (!await recipeDao.getPublishedById(recipeId)) return res.status(404).json({ error: "Receta no encontrada" });
    if (await collectionDao.exists(userId, recipeId)) return res.status(409).json({ error: "La receta ya está en la colección" });
    await collectionDao.add(userId, recipeId);
    res.status(201).json(await collectionDao.getByUser(userId));
};

const remove = async (req, res) => {
    const wasRemoved = await collectionDao.remove(Number(req.params.userId), Number(req.params.recipeId));
    if (!wasRemoved) return res.status(404).json({ error: "La receta no está en la colección" });
    res.status(204).end();
};

module.exports = { getAll, add, remove };
