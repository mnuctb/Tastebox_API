const catalogDao = require("../dao/catalog.dao");

const getCuisineTypes = async (req, res) => {
    res.json(await catalogDao.getCuisineTypes());
};

const getIngredients = async (req, res) => {
    res.json(await catalogDao.getIngredients());
};

const getTags = async (req, res) => {
    res.json(await catalogDao.getTags());
};

const createIngredient = async (req, res) => {
    res.status(201).json(await catalogDao.createIngredient(req.body.name));
};

module.exports = { getCuisineTypes, getIngredients, getTags, createIngredient };
