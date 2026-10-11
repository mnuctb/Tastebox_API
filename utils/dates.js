const DAYS_IN_WEEK = 7;
const MONDAY = 1;

const formatDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
};

const toDate = (text) => {
    const [year, month, day] = text.split("-").map(Number);
    return new Date(year, month - 1, day);
};

const getCurrentMonth = () => formatDate(new Date()).slice(0, 7);

const getWeekStart = (date) => {
    const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysFromMonday = (weekStart.getDay() - MONDAY + DAYS_IN_WEEK) % DAYS_IN_WEEK;
    weekStart.setDate(weekStart.getDate() - daysFromMonday);
    return weekStart;
};

const getPreviousWeek = (weekStart) => {
    const previousWeek = new Date(weekStart);
    previousWeek.setDate(previousWeek.getDate() - DAYS_IN_WEEK);
    return previousWeek;
};

const isMonday = (text) => toDate(text).getDay() === MONDAY;

module.exports = { formatDate, toDate, getCurrentMonth, getWeekStart, getPreviousWeek, isMonday };
