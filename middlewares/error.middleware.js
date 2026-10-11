const databaseErrors = {
    ER_DUP_ENTRY: { status: 409, message: "Ya existe un registro con esos datos" },
    ER_NO_REFERENCED_ROW_2: { status: 400, message: "Uno de los ids enviados no existe" },
    ER_ROW_IS_REFERENCED_2: { status: 409, message: "No se puede eliminar porque otros registros lo usan" },
    ER_CHECK_CONSTRAINT_VIOLATED: { status: 400, message: "Los datos no cumplen las reglas de la base de datos" },
    ER_DATA_TOO_LONG: { status: 400, message: "Uno de los textos supera la longitud permitida" },
    ER_TRUNCATED_WRONG_VALUE: { status: 400, message: "Una de las fechas no es válida" }
};

const handleNotFound = (req, res) => {
    res.status(404).json({ error: `La ruta ${req.method} ${req.originalUrl} no existe` });
};

const handleError = (err, req, res, _next) => {
    if (err.type === "entity.parse.failed") return res.status(400).json({ error: "El JSON enviado no es válido" });
    const databaseError = databaseErrors[err.code];
    if (databaseError) return res.status(databaseError.status).json({ error: databaseError.message });
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
};

module.exports = { handleNotFound, handleError };
