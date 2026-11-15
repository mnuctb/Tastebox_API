const SESSION_KEY = "tasteboxUser";

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

export const isAdmin = (user) => user?.role === "admin";

export const getCurrentPage = () => `${location.pathname.split("/").pop()}${location.search}${location.hash}`;

export const requireUser = () => {
    const user = getUser();
    if (!user) location.href = `login.html?next=${encodeURIComponent(getCurrentPage())}`;
    return user;
};
