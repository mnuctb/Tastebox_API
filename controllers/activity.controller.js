const activityDao = require("../dao/activity.dao");
const recipeDao = require("../dao/recipe.dao");
const { formatDate, toDate, getCurrentMonth, getWeekStart, getPreviousWeek } = require("../utils/dates");

const getWeeklyStreak = (cookingDates) => {
    const activeWeeks = new Set(cookingDates.map((date) => formatDate(getWeekStart(toDate(date)))));
    let week = getWeekStart(new Date());
    if (!activeWeeks.has(formatDate(week))) week = getPreviousWeek(week);
    let streak = 0;
    while (activeWeeks.has(formatDate(week))) {
        streak++;
        week = getPreviousWeek(week);
    }
    return streak;
};

const create = async (req, res) => {
    const { recipeId } = req.body;
    if (!await recipeDao.getPublishedById(recipeId)) return res.status(404).json({ error: "Receta no encontrada" });
    const activityId = await activityDao.create(Number(req.params.userId), recipeId);
    res.status(201).json(await activityDao.getById(activityId));
};

const getByMonth = async (req, res) => {
    const month = req.query.month ?? getCurrentMonth();
    res.json(await activityDao.getByMonth(Number(req.params.userId), month));
};

const getSummary = async (req, res) => {
    const userId = Number(req.params.userId);
    const month = req.query.month ?? getCurrentMonth();
    const byCuisine = await activityDao.countByCuisine(userId, month);
    const cookingDates = await activityDao.getCookingDates(userId);
    res.json({
        month,
        totalCooked: byCuisine.reduce((total, row) => total + row.total, 0),
        byCuisine,
        weeklyStreak: getWeeklyStreak(cookingDates)
    });
};

module.exports = { create, getByMonth, getSummary };
