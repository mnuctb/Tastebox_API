const userDao = require("../dao/user.dao");
const planDao = require("../dao/plan.dao");
const subscriptionDao = require("../dao/subscription.dao");
const { hashPassword } = require("../utils/password");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");

const isEmailTaken = async (email, userId) => {
    const user = await userDao.getByEmail(email);
    return user !== undefined && user.id !== userId;
};

const register = async (req, res) => {
    if (await isEmailTaken(req.body.email)) return res.status(HTTP_STATUS.conflict).json({ error: "El correo ya está registrado" });
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await hashPassword(password);
    const userId = await userDao.create({ firstName, lastName, email, passwordHash });
    const freePlan = await planDao.getFreePlan();
    await subscriptionDao.create(userId, freePlan.id, null);
    res.status(HTTP_STATUS.created).json(await userDao.getById(userId));
};

const getAll = async (req, res) => {
    res.json(await userDao.getAll(req.query.status));
};

const getById = async (req, res) => {
    const user = await userDao.getById(Number(req.params.userId));
    if (!user) return res.status(HTTP_STATUS.notFound).json({ error: ERROR_MESSAGES.userNotFound });
    res.json(user);
};

const update = async (req, res) => {
    const userId = Number(req.params.userId);
    if (req.body.email && await isEmailTaken(req.body.email, userId)) {
        return res.status(HTTP_STATUS.conflict).json({ error: "El correo ya está registrado" });
    }
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = password ? await hashPassword(password) : null;
    await userDao.update(userId, { firstName, lastName, email, passwordHash });
    res.json(await userDao.getById(userId));
};

const changeStatus = async (req, res) => {
    const userId = Number(req.params.userId);
    if (!await userDao.getById(userId)) return res.status(HTTP_STATUS.notFound).json({ error: ERROR_MESSAGES.userNotFound });
    await userDao.updateStatus(userId, req.body.status);
    res.json(await userDao.getById(userId));
};

module.exports = { register, getAll, getById, update, changeStatus };