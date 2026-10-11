const express = require("express");
const router = express.Router();
const sessionRoutes = require("./session.routes");
const userRoutes = require("./user.routes");
const collectionRoutes = require("./collection.routes");
const activityRoutes = require("./activity.routes");
const recipeRoutes = require("./recipe.routes");
const subscriptionRoutes = require("./subscription.routes");
const weeklyBoxRoutes = require("./weeklyBox.routes");
const catalogRoutes = require("./catalog.routes");

router.use("/sessions", sessionRoutes);
router.use("/users", userRoutes);
router.use("/users/:userId/collection", collectionRoutes);
router.use("/users/:userId/cooking-activity", activityRoutes);
router.use("/recipes", recipeRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/weekly-boxes", weeklyBoxRoutes);
router.use("/", catalogRoutes);

module.exports = router;
