const subscriptionDao = require("../dao/subscription.dao");
const planDao = require("../dao/plan.dao");

const getUserPlan = async (userId) => {
    await subscriptionDao.expireOld(userId);
    const subscription = await subscriptionDao.getActive(userId);
    return subscription ?? planDao.getFreePlan();
};

module.exports = getUserPlan;
