const db = require("../services/mysql.service");

const getNames = async (tableName) => {
    const [rows] = await db.query(`SELECT id, name FROM ${tableName} ORDER BY name`);
    return rows;
};

const getCuisineTypes = () => getNames("cuisine_type");

const getIngredients = () => getNames("ingredient");

const getTags = () => getNames("tag");

const createIngredient = async (name) => {
    const [result] = await db.query("INSERT INTO ingredient (name) VALUES (?)", [name]);
    return { id: result.insertId, name };
};

const countTags = async (tagIds) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM tag WHERE id IN (?)", [tagIds]);
    return rows[0].total;
};

module.exports = { getCuisineTypes, getIngredients, getTags, createIngredient, countTags };
