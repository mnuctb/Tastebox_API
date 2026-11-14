const db = require("../services/mysql.service");
const { RECIPE_STATUS } = require("../utils/constants");

const RECIPE_QUERY = `SELECT recipe.id, recipe.name, recipe.description, recipe.instructions, recipe.difficulty,
    recipe.prep_time_minutes AS prepTimeMinutes, recipe.is_premium AS isPremium, recipe.status, recipe.created_at AS createdAt,
    cuisine_type.id AS cuisineTypeId, cuisine_type.name AS cuisineType
    FROM recipe
    JOIN cuisine_type ON cuisine_type.id = recipe.cuisine_type_id`;

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
        WHERE (? IS NULL OR recipe.status = ?)
        AND (? IS NULL OR recipe.cuisine_type_id = ?)
        AND (? IS NULL OR recipe.difficulty = ?)
        AND (? IS NULL OR recipe.prep_time_minutes <= ?)
        ORDER BY recipe.name`,
        [status, status, cuisineTypeId, cuisineTypeId, difficulty, difficulty, maxPrepTime, maxPrepTime]
    );
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query(`${RECIPE_QUERY} WHERE recipe.id = ?`, [id]);
    return rows[0];
};

const getPublishedById = async (id) => {
    const [rows] = await db.query(`${RECIPE_QUERY} WHERE recipe.id = ? AND recipe.status = ?`, [id, RECIPE_STATUS.published]);
    return rows[0];
};

const create = async (recipe) => {
    const [result] = await db.query(
        `INSERT INTO recipe (cuisine_type_id, name, description, instructions, difficulty, prep_time_minutes, is_premium, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        getRecipeValues(recipe)
    );
    return result.insertId;
};

const update = async (id, recipe) => {
    await db.query(
        `UPDATE recipe SET cuisine_type_id = ?, name = ?, description = ?, instructions = ?, difficulty = ?,
        prep_time_minutes = ?, is_premium = ?, status = ?
        WHERE id = ?`,
        [...getRecipeValues(recipe), id]
    );
};

const remove = async (id) => {
    await db.query("DELETE FROM recipe WHERE id = ?", [id]);
};

const getIngredients = async (recipeId) => {
    const [rows] = await db.query(
        `SELECT ingredient.id, ingredient.name, recipe_ingredient.quantity, recipe_ingredient.unit
        FROM recipe_ingredient
        JOIN ingredient ON ingredient.id = recipe_ingredient.ingredient_id
        WHERE recipe_ingredient.recipe_id = ?
        ORDER BY ingredient.name`,
        [recipeId]
    );
    return rows;
};

const saveIngredient = async (recipeId, ingredientId, { quantity, unit }) => {
    await db.query(
        `INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), unit = VALUES(unit)`,
        [recipeId, ingredientId, quantity ?? null, unit ?? null]
    );
};

const removeIngredient = async (recipeId, ingredientId) => {
    const [result] = await db.query("DELETE FROM recipe_ingredient WHERE recipe_id = ? AND ingredient_id = ?", [recipeId, ingredientId]);
    return result.affectedRows > 0;
};

module.exports = { getAll, getById, getPublishedById, create, update, remove, getIngredients, saveIngredient, removeIngredient };

