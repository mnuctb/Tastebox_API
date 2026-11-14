const db = require("../services/mysql.service");

const SAME_MONTH = "DATE_FORMAT(cooking_activity.cooked_at, '%Y-%m') = ?";

const getById = async (id) => {
    const [rows] = await db.query(
        `SELECT cooking_activity.id, recipe.id AS recipeId, recipe.name AS recipeName, cooking_activity.cooked_at AS cookedAt
        FROM cooking_activity
        JOIN recipe ON recipe.id = cooking_activity.recipe_id
        WHERE cooking_activity.id = ?`,
        [id]
    );
    return rows[0];
};

const getByMonth = async (userId, month) => {
    const [rows] = await db.query(
        `SELECT cooking_activity.id, recipe.id AS recipeId, recipe.name AS recipeName, cuisine_type.name AS cuisineType, cooking_activity.cooked_at AS cookedAt
        FROM cooking_activity
        JOIN recipe ON recipe.id = cooking_activity.recipe_id
        JOIN cuisine_type ON cuisine_type.id = recipe.cuisine_type_id
        WHERE cooking_activity.user_id = ? AND ${SAME_MONTH}
        ORDER BY cooking_activity.cooked_at DESC`,
        [userId, month]
    );
    return rows;
};

const countByCuisine = async (userId, month) => {
    const [rows] = await db.query(
        `SELECT cuisine_type.name AS cuisineType, COUNT(*) AS total
        FROM cooking_activity
        JOIN recipe ON recipe.id = cooking_activity.recipe_id
        JOIN cuisine_type ON cuisine_type.id = recipe.cuisine_type_id
        WHERE cooking_activity.user_id = ? AND ${SAME_MONTH}
        GROUP BY cuisine_type.name
        ORDER BY total DESC`,
        [userId, month]
    );
    return rows;
};

const getCookingDates = async (userId) => {
    const [cookingDateRows] = await db.query("SELECT DISTINCT DATE(cooked_at) AS cookingDate FROM cooking_activity WHERE user_id = ?", [userId]);
    return cookingDateRows.map((cookingDateRow) => cookingDateRow.cookingDate);
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
