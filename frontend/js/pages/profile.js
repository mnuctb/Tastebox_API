import { initLayout, logout } from "../layout.js";
import { request, getCurrentSubscription } from "../api.js";
import { requireUser, saveUser } from "../session.js";
import { escapeHtml, formatDate, formatMonthYear, formatPrice, getDaysBetween, getTodayText, countText } from "../format.js";
import { showLoadingIn, showErrorIn, runAction } from "../status.js";
import { renderWeeklyBox } from "../weekly-box.js";
import { renderTable } from "../components.js";

const STATUS_LABELS = { active: "Activa", expired: "Vencida", cancelled: "Cancelada" };
const HISTORY_HEADERS = ["Plan", "Inicio", "Vencimiento", "Estado"];
const page = document.querySelector("#profile-page");
const sessionUser = requireUser();

const renderProgress = (subscription) => {
    if (!subscription.endDate) return "<p class=\"field-hint\">Este plan no tiene fecha de vencimiento.</p>";
    const totalDays = getDaysBetween(subscription.startDate, subscription.endDate);
    const elapsedDays = Math.min(Math.max(getDaysBetween(subscription.startDate, getTodayText()), 0), totalDays);
    const percentage = Math.round((elapsedDays / totalDays) * 100);
    const renewalText = subscription.autoRenew ? "se renueva" : "vence";
    return `
        <div class="progress"><span style="width: ${percentage}%"></span></div>
        <p class="field-hint">${elapsedDays} de ${totalDays} días transcurridos - ${renewalText} en ${totalDays - elapsedDays} días</p>`;
};

const renderSubscriptionCard = (subscription) => {
    if (!subscription) {
        return `
            <div class="card-top">
                <div>
                    <span class="badge dark">Sin suscripción activa</span>
                    <h2>Sin plan</h2>
                </div>
                <button class="button light small" type="button" id="change-plan-button">Elegir plan</button>
            </div>`;
    }
    return `
        <div class="card-top">
            <div>
                <span class="badge">Suscripción ${STATUS_LABELS[subscription.status].toLowerCase()}</span>
                <h2>Plan ${escapeHtml(subscription.planName)}</h2>
            </div>
            <button class="button light small" type="button" id="change-plan-button">Cambiar plan</button>
        </div>
        <div class="subscription-dates">
            <span>Fecha de inicio <strong>${formatDate(subscription.startDate)}</strong></span>
            <span>Vencimiento <strong>${subscription.endDate ? formatDate(subscription.endDate) : "Sin vencimiento"}</strong></span>
            <span>Renovación <strong>${subscription.autoRenew ? "Automática" : "Manual"}</strong></span>
        </div>
        ${renderProgress(subscription)}`;
};

const renderPlanOptions = (plans, subscription) => plans
    .filter((plan) => plan.id !== subscription?.planId)
    .map((plan) => `<button class="button light small" type="button" data-plan-id="${plan.id}">Cambiar a ${escapeHtml(plan.name)} (${formatPrice(plan.price)}/mes)</button>`)
    .join("");

const renderHistory = (history) => renderTable(HISTORY_HEADERS, history.map((subscription) => `
    <tr>
        <td>${escapeHtml(subscription.planName)}</td>
        <td>${formatDate(subscription.startDate)}</td>
        <td>${subscription.endDate ? formatDate(subscription.endDate) : "Sin vencimiento"}</td>
        <td>${STATUS_LABELS[subscription.status]}</td>
    </tr>`));

const renderProfileForm = (user, subscription) => `
    <form id="profile-form" novalidate>
        <div class="form-row">
            <div class="form-field">
                <label for="first-name">Nombre</label>
                <input id="first-name" name="firstName" value="${escapeHtml(user.firstName)}" disabled>
            </div>
            <div class="form-field">
                <label for="last-name">Apellido</label>
                <input id="last-name" name="lastName" value="${escapeHtml(user.lastName)}" disabled>
            </div>
        </div>
        <div class="form-row">
            <div class="form-field">
                <label for="email">Correo electrónico</label>
                <input id="email" name="email" type="email" value="${escapeHtml(user.email)}" disabled>
            </div>
            <div class="form-field">
                <label for="password">Contraseña</label>
                <input id="password" name="password" type="password" placeholder="Nueva contraseña" autocomplete="new-password" disabled>
                <span class="field-hint">Escríbela solo si la quieres cambiar.</span>
            </div>
        </div>
        <p>Tipo de cuenta <span class="badge">${escapeHtml(subscription?.planName ?? "Sin plan")}</span></p>
        <div id="profile-actions" class="hidden">
            <button class="button" type="submit">Guardar cambios</button>
            <button class="button secondary" type="button" id="cancel-edit-button">Cancelar</button>
        </div>
    </form>`;

const renderQuickAccess = (collection, summary, subscription) => `
    <h3 class="section-subtitle">Accesos rápidos</h3>
    <div class="access-grid">
        <a class="access-card" href="collection.html"><strong>Mi colección</strong>${countText(collection.length, "receta guardada", "recetas guardadas")}</a>
        <a class="access-card" href="activity.html"><strong>Historial de cocina</strong>Racha de ${countText(summary.weeklyStreak, "semana", "semanas")}</a>
        <a class="access-card" href="#subscription"><strong>Suscripción</strong>Plan ${escapeHtml(subscription?.planName ?? "sin activar")}</a>
        <a class="access-card" href="recipes.html"><strong>Catálogo</strong>Buscar nuevas recetas</a>
        <a class="access-card" href="dashboard.html"><strong>Mi panel</strong>Resumen de tu cuenta</a>
        <button class="access-card" type="button" id="logout-card"><strong>Cerrar sesión</strong>Salir de tu cuenta</button>
    </div>`;

const renderProfile = ({ user, subscription, history, plans, collection, summary }) => {
    page.innerHTML = `
        <section class="profile-header">
            <span class="avatar">${escapeHtml(user.firstName.charAt(0))}</span>
            <div>
                <h2>${escapeHtml(`${user.firstName} ${user.lastName}`)}</h2>
                <span class="muted">${escapeHtml(user.email)} - miembro desde ${formatMonthYear(user.createdAt)}</span>
            </div>
            <button class="button secondary" type="button" id="edit-button">Editar perfil</button>
        </section>
        ${renderProfileForm(user, subscription)}

        ${renderQuickAccess(collection, summary, subscription)}

        <section class="subscription-card" id="subscription">
            ${renderSubscriptionCard(subscription)}
            <div class="plan-options hidden" id="plan-options">${renderPlanOptions(plans, subscription)}</div>
        </section>

        <section class="section">
            <h3>Historial de suscripciones</h3>
            ${renderHistory(history)}
        </section>

        <p class="eyebrow">Tu recomendación de esta semana</p>
        <div id="weekly-box"></div>`;
    renderWeeklyBox(page.querySelector("#weekly-box"), subscription);
    if (location.hash === "#subscription") page.querySelector("#subscription").scrollIntoView();
};

const setEditing = (isEditing) => {
    const form = page.querySelector("#profile-form");
    form.querySelectorAll("input").forEach((input) => {
        input.disabled = !isEditing;
    });
    page.querySelector("#profile-actions").classList.toggle("hidden", !isEditing);
    page.querySelector("#edit-button").classList.toggle("hidden", isEditing);
};

const getProfileChanges = (form) => {
    const changes = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim()
    };
    if (form.password.value) changes.password = form.password.value;
    return changes;
};

const saveProfile = (form) => {
    runAction({
        loadingMessage: "Guardando tus datos...",
        successMessage: "Datos actualizados con éxito",
        action: () => request(`/users/${sessionUser.id}`, { method: "PATCH", body: getProfileChanges(form) }),
        onSuccess: saveUser,
        onClose: () => location.reload()
    });
};

const changePlan = (planId) => {
    runAction({
        loadingMessage: "Cambiando tu plan...",
        successMessage: "Plan actualizado con éxito",
        action: () => request(`/users/${sessionUser.id}/subscriptions`, { method: "POST", body: { planId } }),
        onSuccess: loadProfile
    });
};

const addEvents = () => {
    page.querySelector("#edit-button").addEventListener("click", () => setEditing(true));
    page.querySelector("#cancel-edit-button").addEventListener("click", loadProfile);
    page.querySelector("#profile-form").addEventListener("submit", (event) => {
        event.preventDefault();
        saveProfile(event.currentTarget);
    });
    page.querySelector("#logout-card").addEventListener("click", logout);
    page.querySelector("#change-plan-button").addEventListener("click", () => {
        page.querySelector("#plan-options").classList.toggle("hidden");
    });
    page.querySelector("#plan-options").addEventListener("click", (event) => {
        const button = event.target.closest("button[data-plan-id]");
        if (button) changePlan(Number(button.dataset.planId));
    });
};

async function loadProfile() {
    showLoadingIn(page, "Cargando tu perfil...");
    try {
        const [user, subscription, history, plans, collection, summary] = await Promise.all([
            request(`/users/${sessionUser.id}`),
            getCurrentSubscription(sessionUser.id),
            request(`/users/${sessionUser.id}/subscriptions`),
            request("/plans"),
            request(`/users/${sessionUser.id}/collection`),
            request(`/users/${sessionUser.id}/cooking-activity/summary`)
        ]);
        renderProfile({ user, subscription, history, plans, collection, summary });
        addEvents();
    } catch (error) {
        showErrorIn(page, error.message, loadProfile);
    }
}

initLayout("profile");
if (sessionUser) loadProfile();
