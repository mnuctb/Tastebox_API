const db = require("../services/mysql.service");

const getNames = async (table) => {
    const [rows] = await db.query(`SELECT id, name FROM ${table} ORDER BY name`);
    return rows;
};

const getCuisineTypes = () => getNames("cuisine_types");

const getIngredients = () => getNames("ingredients");

const getTags = () => getNames("tags");

const createIngredient = async (name) => {
    const [result] = await db.query("INSERT INTO ingredients (name) VALUES (?)", [name]);
    return { id: result.insertId, name };
};

const countTags = async (tagIds) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM tags WHERE id IN (?)", [tagIds]);
    return rows[0].total;
};

module.exports = { getCuisineTypes, getIngredients, getTags, createIngredient, countTags };
