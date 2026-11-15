import { request } from "./api.js";
import { saveUser } from "./session.js";

export const startSession = async (email, password) => {
    const user = await request("/sessions", { method: "POST", body: { email, password } });
    saveUser(user);
    return user;
};
