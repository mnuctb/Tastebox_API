require("dotenv").config();

const config = {
    port: Number(process.env.PORT),
    database: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        corsOrigin: process.env.CORS_ORIGIN,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
};

module.exports = config;
