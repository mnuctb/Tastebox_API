const express = require("express");
const config = require("./env/config");
const routes = require("./routes/index.routes");
const { handleNotFound, handleError } = require("./middlewares/error.middleware");

const api = express();

api.use(express.json());
api.use("/api", routes);
api.use(handleNotFound);
api.use(handleError);

api.listen(config.port, () => {
    console.log(`Server running in http://localhost:${config.port}/api`);
});
