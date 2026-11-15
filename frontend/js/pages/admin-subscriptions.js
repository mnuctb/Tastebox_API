import { initLayout } from "../layout.js";
import { request, buildPath } from "../api.js";
import { requireAdmin } from "../session.js";
import { escapeHtml, formatDate, countText } from "../format.js";
import { renderBadge, renderTable } from "../components.js";
import { showLoadingIn, showErrorIn } from "../status.js";

const STATUS_BADGES = {
    active: { text: "Activa", variant: "" },
    expired: { text: "Vencida", variant: "light" },
    cancelled: { text: "Cancelada", variant: "dark" }
};

const SUBSCRIPTION_HEADERS = ["Usuario", "Correo", "Plan", "Inicio", "Vencimiento", "Estado"];

const subscriptionTable = document.querySelector("#subscription-table");
const subscriptionCount = document.querySelector("#subscription-count");
const statusFilter = document.querySelector("#subscription-status");

const renderSubscriptionRow = (subscription) => {
    const badge = STATUS_BADGES[subscription.status];
    return `
        <tr>
            <td>${escapeHtml(`${subscription.firstName} ${subscription.lastName}`)}</td>
            <td>${escapeHtml(subscription.email)}</td>
            <td>${escapeHtml(subscription.planName)}</td>
            <td>${formatDate(subscription.startDate)}</td>
            <td>${subscription.endDate ? formatDate(subscription.endDate) : "Sin vencimiento"}</td>
            <td>${renderBadge(badge.text, badge.variant)}</td>
        </tr>`;
};

const renderSubscriptionTable = (subscriptions) => {
    subscriptionCount.textContent = countText(subscriptions.length, "suscripción", "suscripciones");
    if (subscriptions.length === 0) {
        subscriptionTable.innerHTML = "<p class=\"center muted\">No hay suscripciones con ese estado.</p>";
        return;
    }
    subscriptionTable.innerHTML = renderTable(SUBSCRIPTION_HEADERS, subscriptions.map(renderSubscriptionRow));
};

const loadSubscriptions = async () => {
    showLoadingIn(subscriptionTable, "Cargando las suscripciones...");
    subscriptionCount.textContent = "";
    try {
        renderSubscriptionTable(await request(buildPath("/subscriptions", { status: statusFilter.value })));
    } catch (error) {
        showErrorIn(subscriptionTable, error.message, loadSubscriptions);
    }
};

if (requireAdmin()) {
    initLayout("admin-subscriptions");
    loadSubscriptions();
    statusFilter.addEventListener("change", loadSubscriptions);
}
