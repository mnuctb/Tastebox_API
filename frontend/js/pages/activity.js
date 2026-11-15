import { initLayout } from "../layout.js";
import { request } from "../api.js";
import { requireUser } from "../session.js";
import { escapeHtml, formatDate, getTodayText } from "../format.js";
import { showLoadingIn, showErrorIn } from "../status.js";
import { renderTable } from "../components.js";

const ACTIVITY_HEADERS = ["Receta", "Cocina", "Fecha"];
const content = document.querySelector("#activity-content");
const monthInput = document.querySelector("#month");
const user = requireUser();

const renderCuisineBars = (summary) => {
    if (summary.byCuisine.length === 0) return "<p class=\"muted\">No preparaste recetas en este mes.</p>";
    const highestTotal = Math.max(...summary.byCuisine.map((row) => row.total));
    return `<div class="cuisine-bars">${summary.byCuisine.map((row) => `
        <div class="cuisine-bar">
            <span>${escapeHtml(row.cuisineType)}</span>
            <div class="progress"><span style="width: ${(row.total / highestTotal) * 100}%"></span></div>
            <strong>${row.total}</strong>
        </div>`).join("")}</div>`;
};

const renderActivityList = (activity) => {
    if (activity.length === 0) return "<p class=\"muted\">Sin registros en este mes.</p>";
    return renderTable(ACTIVITY_HEADERS, activity.map((item) => `
        <tr>
            <td><a href="recipe.html?id=${item.recipeId}">${escapeHtml(item.recipeName)}</a></td>
            <td>${escapeHtml(item.cuisineType)}</td>
            <td>${formatDate(item.cookedAt)}</td>
        </tr>`));
};

const renderActivity = (summary, activity) => {
    content.innerHTML = `
        <div class="stat-pills">
            <span class="stat-pill">Preparadas <strong>${summary.totalCooked}</strong></span>
            <span class="stat-pill">Tipos de cocina <strong>${summary.byCuisine.length}</strong></span>
            <span class="stat-pill">Racha <strong>${summary.weeklyStreak} sem</strong></span>
        </div>
        <div class="two-columns">
            <section class="panel">
                <h3>Por tipo de cocina</h3>
                ${renderCuisineBars(summary)}
            </section>
            <section class="panel">
                <h3>Recetas preparadas</h3>
                ${renderActivityList(activity)}
            </section>
        </div>`;
};

const loadActivity = async () => {
    showLoadingIn(content, "Cargando tu actividad...");
    const month = monthInput.value;
    try {
        const [summary, activity] = await Promise.all([
            request(`/users/${user.id}/cooking-activity/summary?month=${month}`),
            request(`/users/${user.id}/cooking-activity?month=${month}`)
        ]);
        renderActivity(summary, activity);
    } catch (error) {
        showErrorIn(content, error.message, loadActivity);
    }
};

initLayout("profile");
monthInput.value = getTodayText().slice(0, 7);
monthInput.addEventListener("change", loadActivity);
if (user) loadActivity();
