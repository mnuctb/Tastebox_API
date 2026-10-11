const userDao = require("../dao/user.dao");
const { USER_STATUS } = require("../utils/constants");

const login = async (req, res) => {
    const { email, password } = req.body;
    const credentials = await userDao.getByEmail(email);
    if (!credentials || credentials.password !== password) {
        return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }
    if (credentials.status === USER_STATUS.suspended) return res.status(403).json({ error: "La cuenta está suspendida" });
    res.status(201).json(await userDao.getById(credentials.id));
};

module.exports = { login };
