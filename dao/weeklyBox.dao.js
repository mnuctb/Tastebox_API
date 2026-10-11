const db = require("../services/mysql.service");

const BOX_QUERY = `SELECT wb.id, wb.name, wb.description, wb.week_start_date AS weekStartDate,
    r.id AS recipeId, r.name AS recipeName
    FROM weekly_boxes wb
    JOIN recipes r ON r.id = wb.recipe_id`;

const getCurrent = async () => {
    const [rows] = await db.query(`${BOX_QUERY} WHERE wb.week_start_date <= CURDATE() ORDER BY wb.week_start_date DESC LIMIT 1`);
    return rows[0];
};

const getById = async (id) => {
    const [rows] = await db.query(`${BOX_QUERY} WHERE wb.id = ?`, [id]);
    return rows[0];
};

const create = async ({ recipeId, name, description, weekStartDate }) => {
    const [result] = await db.query(
        "INSERT INTO weekly_boxes (recipe_id, name, description, week_start_date) VALUES (?, ?, ?, ?)",
        [recipeId, name, description ?? null, weekStartDate]
    );
    return result.insertId;
};

module.exports = { getCurrent, getById, create };
