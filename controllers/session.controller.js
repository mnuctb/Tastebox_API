const userDao = require("../dao/user.dao");
const { verifyPassword } = require("../utils/password");
const { USER_STATUS, HTTP_STATUS } = require("../utils/constants");

const login = async (req, res) => {
    const { email, password } = req.body;
    const credentials = await userDao.getByEmail(email);
    const isValid = credentials && await verifyPassword(password, credentials.passwordHash);
    if (!isValid) {
        return res.status(HTTP_STATUS.unauthorized).json({ error: "Correo o contraseña incorrectos" });
    }
    if (credentials.status === USER_STATUS.suspended) return res.status(HTTP_STATUS.forbidden).json({ error: "La cuenta está suspendida" });
    res.status(HTTP_STATUS.created).json(await userDao.getById(credentials.id));
};

module.exports = { login };