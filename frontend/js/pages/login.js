import { initLayout } from "../layout.js";
import { getErrorText } from "../api.js";
import { getUser, isAdmin } from "../session.js";
import { startSession } from "../auth.js";
import { showLoading, showSuccess, showError } from "../status.js";

const form = document.querySelector("#login-form");
const errorBox = document.querySelector("#login-error");

const getNextPage = (user) => {
    if (isAdmin(user)) return "admin-recipes.html";
    return new URLSearchParams(location.search).get("next") || "dashboard.html";
};

const login = async () => {
    errorBox.textContent = "";
    const email = form.email.value.trim();
    const password = form.password.value;
    if (!email || !password) {
        errorBox.textContent = "Escribe tu correo y tu contraseña.";
        return;
    }
    showLoading("Verificando tus datos...");
    try {
        const user = await startSession(email, password);
        showSuccess(`Bienvenido, ${user.firstName}`, () => {
            location.href = getNextPage(user);
        });
    } catch (error) {
        errorBox.textContent = getErrorText(error);
        showError(getErrorText(error), login);
    }
};

initLayout("login");
const currentUser = getUser();
if (currentUser) location.href = getNextPage(currentUser);
form.addEventListener("submit", (event) => {
    event.preventDefault();
    login();
});
