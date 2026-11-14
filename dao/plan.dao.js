const db = require("../services/mysql.service");

const PLAN_FIELDS = "id, name, price, monthly_recipe_limit AS monthlyRecipeLimit, includes_weekly_box AS includesWeeklyBox";

const getAll = async () => {
    const [rows] = await db.query(`SELECT ${PLAN_FIELDS} FROM plan ORDER BY price`);
    return rows;
};

const getById = async (id) => {
    const [rows] = await db.query(`SELECT ${PLAN_FIELDS} FROM plan WHERE id = ?`, [id]);
    return rows[0];
};

const getFreePlan = async () => {
    const [rows] = await db.query(`SELECT ${PLAN_FIELDS} FROM plan WHERE price = 0 ORDER BY id LIMIT 1`);
    return rows[0];
};

module.exports = { getAll, getById, getFreePlan };
