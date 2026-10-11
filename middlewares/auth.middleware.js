const userDao = require("../dao/user.dao");
const { ROLES, USER_STATUS, USER_HEADER } = require("../utils/constants");

const requireUser = async (req, res, next) => {
    const userId = Number(req.get(USER_HEADER));
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(401).json({ error: `Debe enviar el encabezado ${USER_HEADER} con el id del usuario` });
    }
    const user = await userDao.getById(userId);
    if (!user) return res.status(401).json({ error: "El usuario no existe" });
    if (user.status === USER_STATUS.suspended) return res.status(403).json({ error: "La cuenta está suspendida" });
    req.user = user;
    next();
};

const optionalUser = (req, res, next) => {
    if (req.get(USER_HEADER) === undefined) return next();
    return requireUser(req, res, next);
};

const onlyAdmin = (req, res, next) => {
    if (req.user.role !== ROLES.admin) return res.status(403).json({ error: "Solo un administrador puede hacer esta acción" });
    next();
};

const onlyAccountOwner = (req, res, next) => {
    const isOwner = req.user.id === Number(req.params.userId);
    if (!isOwner && req.user.role !== ROLES.admin) {
        return res.status(403).json({ error: "Solo puede consultar o modificar su propia cuenta" });
    }
    next();
};

module.exports = { requireUser, optionalUser, onlyAdmin, onlyAccountOwner };
