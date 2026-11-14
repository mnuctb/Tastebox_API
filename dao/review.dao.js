const db = require("../services/mysql.service");

const REVIEW_QUERY = `SELECT review.id, review.recipe_id AS recipeId, user.first_name AS userName, review.rating, review.comment,
    review.would_cook_again AS wouldCookAgain, review.created_at AS createdAt,
    (SELECT GROUP_CONCAT(tag.name ORDER BY tag.name SEPARATOR ', ')
        FROM review_tag
        JOIN tag ON tag.id = review_tag.tag_id
        WHERE review_tag.review_id = review.id) AS tags
    FROM review
    JOIN user ON user.id = review.user_id`;

const getById = async (id) => {
    const [rows] = await db.query(`${REVIEW_QUERY} WHERE review.id = ?`, [id]);
    return rows[0];
};

const getByRecipe = async (recipeId) => {
    const [rows] = await db.query(`${REVIEW_QUERY} WHERE review.recipe_id = ? ORDER BY review.created_at DESC`, [recipeId]);
    return rows;
};

const exists = async (userId, recipeId) => {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM review WHERE user_id = ? AND recipe_id = ?", [userId, recipeId]);
    return rows[0].total > 0;
};

const create = async (userId, recipeId, { rating, comment, wouldCookAgain }) => {
    const [result] = await db.query(
        "INSERT INTO review (user_id, recipe_id, rating, comment, would_cook_again) VALUES (?, ?, ?, ?, ?)",
        [userId, recipeId, rating, comment ?? null, wouldCookAgain ?? null]
    );
    return result.insertId;
};

const addTags = async (reviewId, tagIds) => {
    const reviewTagRows = tagIds.map((tagId) => [reviewId, tagId]);
    await db.query("INSERT INTO review_tag (review_id, tag_id) VALUES ?", [reviewTagRows]);
};

module.exports = { getById, getByRecipe, exists, create, addTags };
