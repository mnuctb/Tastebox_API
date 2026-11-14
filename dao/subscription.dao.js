const db = require("../services/mysql.service");
const { SUBSCRIPTION_STATUS } = require("../utils/constants");

const SUBSCRIPTION_QUERY = `SELECT subscription.id, subscription.user_id AS userId, subscription.start_date AS startDate, subscription.end_date AS endDate,
    subscription.status, subscription.auto_renew AS autoRenew, plan.id AS planId, plan.name AS planName, plan.price,
    plan.monthly_recipe_limit AS monthlyRecipeLimit, plan.includes_weekly_box AS includesWeeklyBox
    FROM subscription
    JOIN plan ON plan.id = subscription.plan_id`;

const expireOld = async (userId) => {
    await db.query(
        "UPDATE subscription SET status = ? WHERE status = ? AND end_date < CURDATE() AND (? IS NULL OR user_id = ?)",
        [SUBSCRIPTION_STATUS.expired, SUBSCRIPTION_STATUS.active, userId ?? null, userId ?? null]
    );
};

const getActive = async (userId) => {
    const [rows] = await db.query(
        `${SUBSCRIPTION_QUERY} WHERE subscription.user_id = ? AND subscription.status = ? ORDER BY subscription.start_date DESC LIMIT 1`,
        [userId, SUBSCRIPTION_STATUS.active]
    );
    return rows[0];
};

const getByUser = async (userId) => {
    const [rows] = await db.query(`${SUBSCRIPTION_QUERY} WHERE subscription.user_id = ? ORDER BY subscription.start_date DESC, subscription.id DESC`, [userId]);
    return rows;
};

const getAll = async (status) => {
    const [rows] = await db.query(
        `SELECT subscription.id, user.first_name AS firstName, user.last_name AS lastName, user.email, plan.name AS planName,
        subscription.start_date AS startDate, subscription.end_date AS endDate, subscription.status
        FROM subscription
        JOIN user ON user.id = subscription.user_id
        JOIN plan ON plan.id = subscription.plan_id
        WHERE (? IS NULL OR subscription.status = ?)
        ORDER BY subscription.end_date IS NULL, subscription.end_date`,
        [status ?? null, status ?? null]
    );
    return rows;
};

const create = async (userId, planId, months) => {
    await db.query(
        `INSERT INTO subscription (user_id, plan_id, start_date, end_date, auto_renew)
        VALUES (?, ?, CURDATE(), IF(? IS NULL, NULL, DATE_ADD(CURDATE(), INTERVAL ? MONTH)), ?)`,
        [userId, planId, months, months, months !== null]
    );
};

const cancel = async (id) => {
    await db.query("UPDATE subscription SET status = ? WHERE id = ?", [SUBSCRIPTION_STATUS.cancelled, id]);
};

module.exports = { expireOld, getActive, getByUser, getAll, create, cancel };
