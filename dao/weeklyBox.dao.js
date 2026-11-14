const db = require("../services/mysql.service");

const BOX_QUERY = `SELECT weekly_box.id, weekly_box.name, weekly_box.description, weekly_box.week_start_date AS weekStartDate,
    recipe.id AS recipeId, recipe.name AS recipeName
    FROM weekly_box
    JOIN recipe ON recipe.id = weekly_box.recipe_id`;

const getCurrent = async () => {
    const [rows] = await db.query(`${BOX_QUERY} WHERE weekly_box.week_start_date <= CURDATE() ORDER BY weekly_box.week_start_date DESC LIMIT 1`);
    return rows[0];
};

const getById = async (id) => {
    const [rows] = await db.query(`${BOX_QUERY} WHERE weekly_box.id = ?`, [id]);
    return rows[0];
};

const create = async ({ recipeId, name, description, weekStartDate }) => {
    const [result] = await db.query(
        "INSERT INTO weekly_box (recipe_id, name, description, week_start_date) VALUES (?, ?, ?, ?)",
        [recipeId, name, description ?? null, weekStartDate]
    );
    return result.insertId;
};

module.exports = { getCurrent, getById, create };
