const db = require("../services/mysql.service");
const { SUBSCRIPTION_STATUS } = require("../utils/constants");

const SUBSCRIPTION_QUERY = `SELECT s.id, s.user_id AS userId, s.start_date AS startDate, s.end_date AS endDate,
    s.status, s.auto_renew AS autoRenew, p.id AS planId, p.name AS planName, p.price,
    p.monthly_recipe_limit AS monthlyRecipeLimit, p.includes_weekly_box AS includesWeeklyBox
    FROM subscriptions s
    JOIN plans p ON p.id = s.plan_id`;

const expireOld = async (userId) => {
    await db.query(
        "UPDATE subscriptions SET status = ? WHERE status = ? AND end_date < CURDATE() AND (? IS NULL OR user_id = ?)",
        [SUBSCRIPTION_STATUS.expired, SUBSCRIPTION_STATUS.active, userId ?? null, userId ?? null]
    );
};

const getActive = async (userId) => {
    const [rows] = await db.query(
        `${SUBSCRIPTION_QUERY} WHERE s.user_id = ? AND s.status = ? ORDER BY s.start_date DESC LIMIT 1`,
        [userId, SUBSCRIPTION_STATUS.active]
    );
    return rows[0];
};

const getByUser = async (userId) => {
    const [rows] = await db.query(`${SUBSCRIPTION_QUERY} WHERE s.user_id = ? ORDER BY s.start_date DESC, s.id DESC`, [userId]);
    return rows;
};

const getAll = async (status) => {
    const [rows] = await db.query(
        `SELECT s.id, u.first_name AS firstName, u.last_name AS lastName, u.email, p.name AS planName,
        s.start_date AS startDate, s.end_date AS endDate, s.status
        FROM subscriptions s
        JOIN users u ON u.id = s.user_id
        JOIN plans p ON p.id = s.plan_id
        WHERE (? IS NULL OR s.status = ?)
        ORDER BY s.end_date IS NULL, s.end_date`,
        [status ?? null, status ?? null]
    );
    return rows;
};

const create = async (userId, planId, months) => {
    await db.query(
        `INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, auto_renew)
        VALUES (?, ?, CURDATE(), IF(? IS NULL, NULL, DATE_ADD(CURDATE(), INTERVAL ? MONTH)), ?)`,
        [userId, planId, months, months, months !== null]
    );
};

const cancel = async (id) => {
    await db.query("UPDATE subscriptions SET status = ? WHERE id = ?", [SUBSCRIPTION_STATUS.cancelled, id]);
};

module.exports = { expireOld, getActive, getByUser, getAll, create, cancel };
