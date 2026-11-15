import { API_URL } from "./config.js";
import { getUser } from "./session.js";

export const HTTP_STATUS = { noContent: 204, forbidden: 403, notFound: 404 };

class ApiError extends Error {
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
    if (response.status === HTTP_STATUS.noContent) return null;
    const data = await response.json();
    if (!response.ok) throw new ApiError(response.status, data.error, data.details ?? []);
    return data;
};

export const getErrorText = (error) => {
    if (error.details?.length) return `${error.message}: ${error.details.join(". ")}`;
    return error.message;
};

export const buildPath = (path, params) => {
    const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value)).toString();
    return query ? `${path}?${query}` : path;
};

export const getCurrentSubscription = async (userId) => {
    try {
        return await request(`/users/${userId}/subscription`);
    } catch (error) {
        if (error.status === HTTP_STATUS.notFound) return null;
        throw error;
    }
};
