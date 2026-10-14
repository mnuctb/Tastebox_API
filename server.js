const express = require("express");
const swaggerUi = require("swagger-ui-express");
const config = require("./env/config");
const routes = require("./routes/index.routes");
const openApiDocument = require("./docs/openapi.json");
const { handleNotFound, handleError } = require("./middlewares/error.middleware");

const api = express();

api.use(express.json());
api.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
api.use("/api", routes);
api.use(handleNotFound);
api.use(handleError);

api.listen(config.port, () => {
    console.log(`Server running in http://localhost:${config.port}/api`);
});