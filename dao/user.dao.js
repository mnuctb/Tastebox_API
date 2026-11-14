const db = require("../services/mysql.service");

const USER_FIELDS = "user.id, user.first_name AS firstName, user.last_name AS lastName, user.email, user.role, user.status, user.created_at AS createdAt";

const getById = async (id) => {
    const [rows] = await db.query(`SELECT ${USER_FIELDS} FROM user WHERE user.id = ?`, [id]);
    return rows[0];
};

const getByEmail = async (email) => {
    const [rows] = await db.query("SELECT id, password_hash AS passwordHash, status FROM user WHERE email = ?", [email]);
    return rows[0];
};

const getAll = async (status) => {
    const [rows] = await db.query(
        `SELECT ${USER_FIELDS}, plan.name AS planName
        FROM user
        LEFT JOIN subscription ON subscription.user_id = user.id AND subscription.status = 'active'
        LEFT JOIN plan ON plan.id = subscription.plan_id
        WHERE (? IS NULL OR user.status = ?)
        ORDER BY user.id`,
        [status ?? null, status ?? null]
    );
    return rows;
};

const create = async ({ firstName, lastName, email, passwordHash }) => {
    const [result] = await db.query(
        "INSERT INTO user (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
        [firstName, lastName, email, passwordHash]
    );
    return result.insertId;
};

const update = async (id, { firstName, lastName, email, passwordHash }) => {
    await db.query(
        `UPDATE user SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name),
        email = COALESCE(?, email), password_hash = COALESCE(?, password_hash)
        WHERE id = ?`,
        [firstName ?? null, lastName ?? null, email ?? null, passwordHash ?? null, id]
    );
};

const updateStatus = async (id, status) => {
    await db.query("UPDATE user SET status = ? WHERE id = ?", [status, id]);
};

module.exports = { getById, getByEmail, getAll, create, update, updateStatus };