import { escapeHtml } from "./format.js";
import { getErrorText } from "./api.js";

const CONFIRMATION_TIME = 2200;

const ICONS = {
    loading: "<span class=\"spinner\"></span>",
    error: "<svg width=\"40\" height=\"40\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#d32f2f\" stroke-width=\"2\"><path d=\"M12 3 2 21h20L12 3z\"/><path d=\"M12 10v5M12 18h.01\"/></svg>",
    success: "<svg width=\"44\" height=\"44\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#2e9e3e\"/><path d=\"m6.5 12.5 3.5 3.5 7.5-8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.5\"/></svg>"
};

const TITLES = { loading: "Cargando", error: "Error", success: "Confirmación" };

const createStatusBox = (type, message) => {
    const box = document.createElement("div");
    box.className = "status-box";
    box.innerHTML = `
        <div class="status-icon">${ICONS[type]}</div>
        <h3>${TITLES[type]}</h3>
        <p>${escapeHtml(message)}</p>`;
    return box;
};

const addButton = (box, text, className, onClick) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button small ${className}`;
    button.textContent = text;
    if (onClick) button.addEventListener("click", onClick);
    box.append(button);
};

export const showLoadingIn = (container, message) => {
    const box = createStatusBox("loading", message);
    addButton(box, "Un momento", "light");
    container.replaceChildren(box);
};

export const showErrorIn = (container, message, onRetry) => {
    const box = createStatusBox("error", message);
    if (onRetry) addButton(box, "Reintentar", "outline", onRetry);
    container.replaceChildren(box);
};

let overlay = null;
let closeTimer = null;

const openOverlay = (box) => {
    clearTimeout(closeTimer);
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "status-overlay";
        document.body.append(overlay);
    }
    overlay.replaceChildren(box);
};

const closeStatus = () => {
    clearTimeout(closeTimer);
    overlay?.remove();
    overlay = null;
};

export const showLoading = (message) => {
    const box = createStatusBox("loading", message);
    addButton(box, "Un momento", "light");
    openOverlay(box);
};

export const showError = (message, onRetry) => {
    const box = createStatusBox("error", message);
    if (onRetry) {
        addButton(box, "Reintentar", "outline", () => {
            closeStatus();
            onRetry();
        });
    }
    addButton(box, "Cerrar", "light", closeStatus);
    openOverlay(box);
};

export const showSuccess = (message, onClose) => {
    const box = createStatusBox("success", "La operación se ejecutó con éxito.");
    addButton(box, message, "light");
    openOverlay(box);
    closeTimer = setTimeout(() => {
        closeStatus();
        if (onClose) onClose();
    }, CONFIRMATION_TIME);
};

export const runAction = async ({ loadingMessage, successMessage, action, onSuccess, onClose }) => {
    showLoading(loadingMessage);
    try {
        const result = await action();
        showSuccess(successMessage, onClose);
        if (onSuccess) await onSuccess(result);
        return result;
    } catch (error) {
        showError(getErrorText(error), () => runAction({ loadingMessage, successMessage, action, onSuccess, onClose }));
        return null;
    }
};
