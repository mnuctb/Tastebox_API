import { initLayout } from "../layout.js";
import { request, getErrorText } from "../api.js";
import { startSession } from "../auth.js";
import { showLoading, showSuccess, showError } from "../status.js";
import { escapeHtml } from "../format.js";

const form = document.querySelector("#register-form");
const errorBox = document.querySelector("#register-error");

const showFormErrors = (messages) => {
    errorBox.innerHTML = `<ul>${messages.map((message) => `<li>${escapeHtml(message)}</li>`).join("")}</ul>`;
};

const getFormErrors = () => {
    const errors = [];
    if (form.password.value !== form.passwordConfirmation.value) errors.push("Las contraseñas no coinciden");
    if (!form.terms.checked) errors.push("Debes aceptar los términos de uso");
    return errors;
};

const register = async () => {
    errorBox.textContent = "";
    const formErrors = getFormErrors();
    if (formErrors.length > 0) {
        showFormErrors(formErrors);
        return;
    }
    const newUser = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        password: form.password.value
    };
    showLoading("Creando tu cuenta...");
    try {
        await request("/users", { method: "POST", body: newUser });
        await startSession(newUser.email, newUser.password);
        showSuccess("Cuenta creada con éxito", () => {
            location.href = "dashboard.html";
        });
    } catch (error) {
        showFormErrors(error.details?.length ? error.details : [error.message]);
        showError(getErrorText(error), register);
    }
};

initLayout("register");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    register();
});
