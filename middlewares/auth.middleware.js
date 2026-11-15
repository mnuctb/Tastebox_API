const userDao = require("../dao/user.dao");
const { ROLES, USER_STATUS, USER_HEADER, HTTP_STATUS } = require("../utils/constants");

const requireUser = async (req, res, next) => {
    const userId = Number(req.get(USER_HEADER));
    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(HTTP_STATUS.unauthorized).json({ error: `Debe enviar el encabezado ${USER_HEADER} con el id del usuario` });
    }
    const user = await userDao.getById(userId);
    if (!user) return res.status(HTTP_STATUS.unauthorized).json({ error: "El usuario no existe" });
    if (user.status === USER_STATUS.suspended) return res.status(HTTP_STATUS.forbidden).json({ error: "La cuenta está suspendida" });
    req.user = user;
    next();
};

const optionalUser = (req, res, next) => {
    if (req.get(USER_HEADER) === undefined) return next();
    return requireUser(req, res, next);
};

const onlyAdmin = (req, res, next) => {
    if (req.user.role !== ROLES.admin) return res.status(HTTP_STATUS.forbidden).json({ error: "Solo un administrador puede hacer esta acción" });
    next();
};

const onlyAccountOwner = (req, res, next) => {
    const isOwner = req.user.id === Number(req.params.userId);
    if (!isOwner && req.user.role !== ROLES.admin) {
        return res.status(HTTP_STATUS.forbidden).json({ error: "Solo puede consultar o modificar su propia cuenta" });
    }
    next();
};

module.exports = { requireUser, optionalUser, onlyAdmin, onlyAccountOwner };
