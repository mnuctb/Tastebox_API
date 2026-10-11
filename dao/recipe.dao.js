const db = require("../services/mysql.service");
const { RECIPE_STATUS } = require("../utils/constants");

const RECIPE_QUERY = `SELECT r.id, r.name, r.description, r.instructions, r.difficulty,
    r.prep_time_minutes AS prepTimeMinutes, r.is_premium AS isPremium, r.status, r.created_at AS createdAt,
    ct.id AS cuisineTypeId, ct.name AS cuisineType
    FROM recipes r
    JOIN cuisine_types ct ON ct.id = r.cuisine_type_id`;

const getRecipeValues = (recipe) => [
    recipe.cuisineTypeId,
    recipe.name,
    recipe.description ?? null,
    recipe.instructions,
    recipe.difficulty,
    recipe.prepTimeMinutes,
    recipe.isPremium ?? false,
    recipe.status ?? RECIPE_STATUS.draft
];

const getAll = async ({ status = null, cuisineTypeId = null, difficulty = null, maxPrepTime = null }) => {
    const [rows] = await db.query(
        `${RECIPE_QUERY}
        WHERE (? IS NULL OR r.status = ?)
        AND (? IS NULL OR r.cuisine_type_id = ?)
        AND (? IS NULL OR r.difficulty = ?)
        AND (? IS NULL OR r.prep_time_minutes <= ?)
        ORDER BY r.name`,
        [status, status, cuisineTypeId, cuisineTypeId, difficulty, difficulty, maxPrepTime, maxPrepTime]
    );
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query(`${RECIPE_QUERY} WHERE r.id = ?`, [id]);
    return rows[0];
};

const getPublishedById = async (id) => {
    const [rows] = await db.query(`${RECIPE_QUERY} WHERE r.id = ? AND r.status = ?`, [id, RECIPE_STATUS.published]);
    return rows[0];
};

const create = async (recipe) => {
    const [result] = await db.query(
        `INSERT INTO recipes (cuisine_type_id, name, description, instructions, difficulty, prep_time_minutes, is_premium, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        getRecipeValues(recipe)
    );
    return result.insertId;
};

const update = async (id, recipe) => {
    await db.query(
        `UPDATE recipes SET cuisine_type_id = ?, name = ?, description = ?, instructions = ?, difficulty = ?,
        prep_time_minutes = ?, is_premium = ?, status = ?
        WHERE id = ?`,
        [...getRecipeValues(recipe), id]
    );
};

const remove = async (id) => {
    await db.query("DELETE FROM recipes WHERE id = ?", [id]);
};

const getIngredients = async (recipeId) => {
    const [rows] = await db.query(
        `SELECT i.id, i.name, ri.quantity, ri.unit
        FROM recipe_ingredients ri
        JOIN ingredients i ON i.id = ri.ingredient_id
        WHERE ri.recipe_id = ?
        ORDER BY i.name`,
        [recipeId]
    );
    return rows;
};

const saveIngredient = async (recipeId, ingredientId, { quantity, unit }) => {
    await db.query(
        `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), unit = VALUES(unit)`,
        [recipeId, ingredientId, quantity ?? null, unit ?? null]
    );
};

const removeIngredient = async (recipeId, ingredientId) => {
    const [result] = await db.query("DELETE FROM recipe_ingredients WHERE recipe_id = ? AND ingredient_id = ?", [recipeId, ingredientId]);
    return result.affectedRows > 0;
};

module.exports = { getAll, getById, getPublishedById, create, update, remove, getIngredients, saveIngredient, removeIngredient };
