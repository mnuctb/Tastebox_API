const { isText, isOptional, sendErrors } = require("./validation");
const { USER_STATUS } = require("../utils/constants");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const PASSWORD_ERROR = "password debe tener mínimo 8 caracteres, una mayúscula y un número";

const validateRegister = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body ?? {};
    const errors = [];
    if (!isText(firstName)) errors.push("firstName es obligatorio");
    if (!isText(lastName)) errors.push("lastName es obligatorio");
    if (!EMAIL_PATTERN.test(String(email))) errors.push("email no es válido");
    if (!PASSWORD_PATTERN.test(String(password))) errors.push(PASSWORD_ERROR);
    sendErrors(errors, res, next);
};

const validateUpdate = (req, res, next) => {
    const { firstName, lastName, email, password } = req.body ?? {};
    const errors = [];
    if ([firstName, lastName, email, password].every(isOptional)) errors.push("Debe enviar al menos un dato para actualizar");
    if (!isOptional(firstName) && !isText(firstName)) errors.push("firstName no puede estar vacío");
    if (!isOptional(lastName) && !isText(lastName)) errors.push("lastName no puede estar vacío");
    if (!isOptional(email) && !EMAIL_PATTERN.test(String(email))) errors.push("email no es válido");
    if (!isOptional(password) && !PASSWORD_PATTERN.test(String(password))) errors.push(PASSWORD_ERROR);
    sendErrors(errors, res, next);
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body ?? {};
    const errors = [];
    if (!isText(email)) errors.push("email es obligatorio");
    if (!isText(password)) errors.push("password es obligatorio");
    sendErrors(errors, res, next);
};

const validateStatus = (req, res, next) => {
    const statusList = Object.values(USER_STATUS);
    const errors = statusList.includes(req.body?.status) ? [] : [`status debe ser: ${statusList.join(" o ")}`];
    sendErrors(errors, res, next);
};

module.exports = { validateRegister, validateUpdate, validateLogin, validateStatus };
