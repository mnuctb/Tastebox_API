const subscriptionDao = require("../dao/subscription.dao");
const planDao = require("../dao/plan.dao");
const { PAID_PLAN_MONTHS } = require("../utils/constants");

const getPlans = async (req, res) => {
    res.json(await planDao.getAll());
};

const getCurrent = async (req, res) => {
    const userId = Number(req.params.userId);
    await subscriptionDao.expireOld(userId);
    const subscription = await subscriptionDao.getActive(userId);
    if (!subscription) return res.status(404).json({ error: "El usuario no tiene una suscripción activa" });
    res.json(subscription);
};

const getHistory = async (req, res) => {
    res.json(await subscriptionDao.getByUser(Number(req.params.userId)));
};

const changePlan = async (req, res) => {
    const userId = Number(req.params.userId);
    const plan = await planDao.getById(req.body.planId);
    if (!plan) return res.status(404).json({ error: "Plan no encontrado" });
    await subscriptionDao.expireOld(userId);
    const current = await subscriptionDao.getActive(userId);
    if (current?.planId === plan.id) return res.status(409).json({ error: "El usuario ya tiene ese plan activo" });
    if (current) await subscriptionDao.cancel(current.id);
    const months = Number(plan.price) > 0 ? PAID_PLAN_MONTHS : null;
    await subscriptionDao.create(userId, plan.id, months);
    res.status(201).json(await subscriptionDao.getActive(userId));
};

const getAll = async (req, res) => {
    await subscriptionDao.expireOld(null);
    res.json(await subscriptionDao.getAll(req.query.status));
};

module.exports = { getPlans, getCurrent, getHistory, changePlan, getAll };
