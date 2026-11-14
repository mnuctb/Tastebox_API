const db = require("../services/mysql.service");
const { RECIPE_STATUS } = require("../utils/constants");

const getByUser = async (userId) => {
    const [rows] = await db.query(
        `SELECT recipe.id, recipe.name, cuisine_type.name AS cuisineType, recipe.difficulty, recipe.prep_time_minutes AS prepTimeMinutes,
        recipe.is_premium AS isPremium, collection_item.saved_at AS savedAt
        FROM collection_item
        JOIN recipe ON recipe.id = collection_item.recipe_id
        JOIN cuisine_type ON cuisine_type.id = recipe.cuisine_type_id
        WHERE collection_item.user_id = ? AND recipe.status = ?
        ORDER BY collection_item.saved_at DESC`,
        [userId, RECIPE_STATUS.published]
    );
    return rows;
};

const exists = async (userId, recipeId) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM collection_item WHERE user_id = ? AND recipe_id = ?", [userId, recipeId]);
    return rows[0].total > 0;
};

const add = async (userId, recipeId) => {
    await db.query("INSERT INTO collection_item (user_id, recipe_id) VALUES (?, ?)", [userId, recipeId]);
};

const remove = async (userId, recipeId) => {
    const [result] = await db.query("DELETE FROM collection_item WHERE user_id = ? AND recipe_id = ?", [userId, recipeId]);
    return result.affectedRows > 0;
};

module.exports = { getByUser, exists, add, remove };
