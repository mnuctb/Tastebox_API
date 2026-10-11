const ROLES = { user: "user", admin: "admin" };
const USER_STATUS = { active: "active", suspended: "suspended" };
const RECIPE_STATUS = { draft: "draft", published: "published" };
const DIFFICULTIES = ["easy", "medium", "hard"];
const SUBSCRIPTION_STATUS = { active: "active", expired: "expired", cancelled: "cancelled" };
const PAID_PLAN_MONTHS = 1;
const USER_HEADER = "X-User-Id";

module.exports = { ROLES, USER_STATUS, RECIPE_STATUS, DIFFICULTIES, SUBSCRIPTION_STATUS, PAID_PLAN_MONTHS, USER_HEADER };
