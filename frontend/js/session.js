const SESSION_KEY = "tasteboxUser";
const ADMIN_ROLE = "admin";

export const saveUser = (user) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getUser = () => {
    const savedUser = sessionStorage.getItem(SESSION_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
};

export const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
};

export const isAdmin = (user) => user?.role === ADMIN_ROLE;

const getCurrentPage = () => `${location.pathname.split("/").pop()}${location.search}${location.hash}`;

export const requireUser = () => {
    const user = getUser();
    if (!user) location.href = `login.html?next=${encodeURIComponent(getCurrentPage())}`;
    return user;
};

export const requireAdmin = () => {
    const user = requireUser();
    if (user && !isAdmin(user)) location.href = "index.html";
    return isAdmin(user) ? user : null;
};
