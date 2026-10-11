const db = require("../services/mysql.service");

const SAME_MONTH = "DATE_FORMAT(ca.cooked_at, '%Y-%m') = ?";

const getById = async (id) => {
    const [rows] = await db.query(
        `SELECT ca.id, r.id AS recipeId, r.name AS recipeName, ca.cooked_at AS cookedAt
        FROM cooking_activity ca
        JOIN recipes r ON r.id = ca.recipe_id
        WHERE ca.id = ?`,
        [id]
    );
    return rows[0];
};

const getByMonth = async (userId, month) => {
    const [rows] = await db.query(
        `SELECT ca.id, r.id AS recipeId, r.name AS recipeName, ct.name AS cuisineType, ca.cooked_at AS cookedAt
        FROM cooking_activity ca
        JOIN recipes r ON r.id = ca.recipe_id
        JOIN cuisine_types ct ON ct.id = r.cuisine_type_id
        WHERE ca.user_id = ? AND ${SAME_MONTH}
        ORDER BY ca.cooked_at DESC`,
        [userId, month]
    );
    return rows;
};

const countByCuisine = async (userId, month) => {
    const [rows] = await db.query(
        `SELECT ct.name AS cuisineType, COUNT(*) AS total
        FROM cooking_activity ca
        JOIN recipes r ON r.id = ca.recipe_id
        JOIN cuisine_types ct ON ct.id = r.cuisine_type_id
        WHERE ca.user_id = ? AND ${SAME_MONTH}
        GROUP BY ct.name
        ORDER BY total DESC`,
        [userId, month]
    );
    return rows;
};

const getCookingDates = async (userId) => {
    const [rows] = await db.query("SELECT DISTINCT DATE(cooked_at) AS cookingDate FROM cooking_activity WHERE user_id = ?", [userId]);
    return rows.map((row) => row.cookingDate);
};

const hasCooked = async (userId, recipeId) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM cooking_activity WHERE user_id = ? AND recipe_id = ?", [userId, recipeId]);
    return rows[0].total > 0;
};

const create = async (userId, recipeId) => {
    const [result] = await db.query("INSERT INTO cooking_activity (user_id, recipe_id) VALUES (?, ?)", [userId, recipeId]);
    return result.insertId;
};

module.exports = { getById, getByMonth, countByCuisine, getCookingDates, hasCooked, create };
