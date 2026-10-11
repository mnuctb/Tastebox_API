const db = require("../services/mysql.service");

const USER_FIELDS = "u.id, u.first_name AS firstName, u.last_name AS lastName, u.email, u.role, u.status, u.created_at AS createdAt";

const getById = async (id) => {
    const [rows] = await db.query(`SELECT ${USER_FIELDS} FROM users u WHERE u.id = ?`, [id]);
    return rows[0];
};

const getByEmail = async (email) => {
    const [rows] = await db.query("SELECT id, password, status FROM users WHERE email = ?", [email]);
    return rows[0];
};

const getAll = async (status) => {
    const [rows] = await db.query(
        `SELECT ${USER_FIELDS}, p.name AS planName
        FROM users u
        LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
        LEFT JOIN plans p ON p.id = s.plan_id
        WHERE (? IS NULL OR u.status = ?)
        ORDER BY u.id`,
        [status ?? null, status ?? null]
    );
    return rows;
};

const create = async ({ firstName, lastName, email, password }) => {
    const [result] = await db.query(
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
        [firstName, lastName, email, password]
    );
    return result.insertId;
};

const update = async (id, { firstName, lastName, email, password }) => {
    await db.query(
        `UPDATE users SET first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name),
        email = COALESCE(?, email), password = COALESCE(?, password)
        WHERE id = ?`,
        [firstName ?? null, lastName ?? null, email ?? null, password ?? null, id]
    );
};

const updateStatus = async (id, status) => {
    await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
};

module.exports = { getById, getByEmail, getAll, create, update, updateStatus };
