const db = require("../services/mysql.service");

const THIS_MONTH = "viewed_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')";

const wasViewedThisMonth = async (userId, recipeId) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS total FROM recipe_views WHERE user_id = ? AND recipe_id = ? AND ${THIS_MONTH}`,
        [userId, recipeId]
    );
    return rows[0].total > 0;
};

const countViewedThisMonth = async (userId) => {
    const [rows] = await db.query(
        `SELECT COUNT(DISTINCT recipe_id) AS total FROM recipe_views WHERE user_id = ? AND ${THIS_MONTH}`,
        [userId]
    );
    return rows[0].total;
};

const create = async (userId, recipeId) => {
    await db.query("INSERT INTO recipe_views (user_id, recipe_id) VALUES (?, ?)", [userId, recipeId]);
};

module.exports = { wasViewedThisMonth, countViewedThisMonth, create };
