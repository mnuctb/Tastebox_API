const db = require("../services/mysql.service");
const { RECIPE_STATUS } = require("../utils/constants");

const getByUser = async (userId) => {
    const [rows] = await db.query(
        `SELECT r.id, r.name, ct.name AS cuisineType, r.difficulty, r.prep_time_minutes AS prepTimeMinutes,
        r.is_premium AS isPremium, ci.saved_at AS savedAt
        FROM collection_items ci
        JOIN recipes r ON r.id = ci.recipe_id
        JOIN cuisine_types ct ON ct.id = r.cuisine_type_id
        WHERE ci.user_id = ? AND r.status = ?
        ORDER BY ci.saved_at DESC`,
        [userId, RECIPE_STATUS.published]
    );
    return rows;
};

const exists = async (userId, recipeId) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM collection_items WHERE user_id = ? AND recipe_id = ?", [userId, recipeId]);
    return rows[0].total > 0;
};

const add = async (userId, recipeId) => {
    await db.query("INSERT INTO collection_items (user_id, recipe_id) VALUES (?, ?)", [userId, recipeId]);
};

const remove = async (userId, recipeId) => {
    const [result] = await db.query("DELETE FROM collection_items WHERE user_id = ? AND recipe_id = ?", [userId, recipeId]);
    return result.affectedRows > 0;
};

module.exports = { getByUser, exists, add, remove };
