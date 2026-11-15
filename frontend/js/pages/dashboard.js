import { initLayout } from "../layout.js";
import { request, getCurrentSubscription } from "../api.js";
import { requireUser } from "../session.js";
import { escapeHtml, formatDate } from "../format.js";
import { showLoadingIn, showErrorIn } from "../status.js";
import { renderWeeklyBox } from "../weekly-box.js";

const content = document.querySelector("#dashboard-content");
const user = requireUser();

const renderDashboard = (subscription, collection, summary) => {
    content.innerHTML = `
        <div class="stat-pills">
            <span class="stat-pill">Plan <strong>${escapeHtml(subscription?.planName ?? "Sin plan")}</strong></span>
            <span class="stat-pill">Guardadas <strong>${collection.length}</strong></span>
            <span class="stat-pill">Preparadas <strong>${summary.totalCooked}</strong></span>
            <span class="stat-pill">Racha <strong>${summary.weeklyStreak} sem</strong></span>
        </div>
        <p class="eyebrow">Accesos rápidos</p>
        <div class="quick-links">
            <form action="recipes.html">
                <input name="search" type="search" placeholder="¿Explorar recetas?">
            </form>
            <a href="profile.html#subscription">Mi suscripción</a>
            <a href="collection.html">Mis recetas</a>
            <a href="activity.html">Mi actividad</a>
        </div>
        ${subscription?.endDate ? `<p class="field-hint">Tu plan vence el ${formatDate(subscription.endDate)}.</p>` : ""}
        <div id="weekly-box"></div>`;
    renderWeeklyBox(content.querySelector("#weekly-box"), subscription);
};

const loadDashboard = async () => {
    showLoadingIn(content, "Cargando tu panel...");
    try {
        const [subscription, collection, summary] = await Promise.all([
            getCurrentSubscription(user.id),
            request(`/users/${user.id}/collection`),
            request(`/users/${user.id}/cooking-activity/summary`)
        ]);
        renderDashboard(subscription, collection, summary);
    } catch (error) {
        showErrorIn(content, error.message, loadDashboard);
    }
};

initLayout("dashboard");
if (user) {
    document.querySelector("#greeting").textContent = `¡Hola, ${user.firstName}!`;
    loadDashboard();
}
