const db = require("../services/mysql.service");

const REVIEW_QUERY = `SELECT r.id, r.recipe_id AS recipeId, u.first_name AS userName, r.rating, r.comment,
    r.would_cook_again AS wouldCookAgain, r.created_at AS createdAt,
    (SELECT GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ')
        FROM review_tags rt
        JOIN tags t ON t.id = rt.tag_id
        WHERE rt.review_id = r.id) AS tags
    FROM reviews r
    JOIN users u ON u.id = r.user_id`;

const getById = async (id) => {
    const [rows] = await db.query(`${REVIEW_QUERY} WHERE r.id = ?`, [id]);
    return rows[0];
};

const getByRecipe = async (recipeId) => {
    const [rows] = await db.query(`${REVIEW_QUERY} WHERE r.recipe_id = ? ORDER BY r.created_at DESC`, [recipeId]);
    return rows;
};

const exists = async (userId, recipeId) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM reviews WHERE user_id = ? AND recipe_id = ?", [userId, recipeId]);
    return rows[0].total > 0;
};

const create = async (userId, recipeId, { rating, comment, wouldCookAgain }) => {
    const [result] = await db.query(
        "INSERT INTO reviews (user_id, recipe_id, rating, comment, would_cook_again) VALUES (?, ?, ?, ?, ?)",
        [userId, recipeId, rating, comment ?? null, wouldCookAgain ?? null]
    );
    return result.insertId;
};

const addTags = async (reviewId, tagIds) => {
    const rows = tagIds.map((tagId) => [reviewId, tagId]);
    await db.query("INSERT INTO review_tags (review_id, tag_id) VALUES ?", [rows]);
};

module.exports = { getById, getByRecipe, exists, create, addTags };
