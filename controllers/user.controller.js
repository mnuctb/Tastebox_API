const userDao = require("../dao/user.dao");
const planDao = require("../dao/plan.dao");
const subscriptionDao = require("../dao/subscription.dao");

const isEmailTaken = async (email, userId) => {
    const user = await userDao.getByEmail(email);
    return user !== undefined && user.id !== userId;
};

const register = async (req, res) => {
    if (await isEmailTaken(req.body.email)) return res.status(409).json({ error: "El correo ya está registrado" });
    const userId = await userDao.create(req.body);
    const freePlan = await planDao.getFreePlan();
    await subscriptionDao.create(userId, freePlan.id, null);
    res.status(201).json(await userDao.getById(userId));
};

const getAll = async (req, res) => {
    res.json(await userDao.getAll(req.query.status));
};

const getById = async (req, res) => {
    const user = await userDao.getById(Number(req.params.userId));
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
};

const update = async (req, res) => {
    const userId = Number(req.params.userId);
    if (req.body.email && await isEmailTaken(req.body.email, userId)) {
        return res.status(409).json({ error: "El correo ya está registrado" });
    }
    await userDao.update(userId, req.body);
    res.json(await userDao.getById(userId));
};

const changeStatus = async (req, res) => {
    const userId = Number(req.params.userId);
    if (!await userDao.getById(userId)) return res.status(404).json({ error: "Usuario no encontrado" });
    await userDao.updateStatus(userId, req.body.status);
    res.json(await userDao.getById(userId));
};

module.exports = { register, getAll, getById, update, changeStatus };
