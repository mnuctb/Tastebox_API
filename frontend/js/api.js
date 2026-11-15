import { API_URL } from "./config.js";
import { getUser } from "./session.js";

export class ApiError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export const request = async (path, { method = "GET", body } = {}) => {
    const headers = {};
    const user = getUser();
    if (user) headers["X-User-Id"] = String(user.id);
    if (body !== undefined) headers["Content-Type"] = "application/json";
    let response;
    try {
        response = await fetch(`${API_URL}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch {
        throw new ApiError(0, "No se pudo conectar con el servidor. Revisa que la API esté encendida.", []);
    }
    if (response.status === 204) return null;
    const data = await response.json();
    if (!response.ok) throw new ApiError(response.status, data.error, data.details ?? []);
    return data;
};

export const getErrorText = (error) => {
    if (error.details?.length) return `${error.message}: ${error.details.join(". ")}`;
    return error.message;
};
