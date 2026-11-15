import { initLayout } from "../layout.js";
import { request, buildPath } from "../api.js";
import { requireAdmin, isAdmin } from "../session.js";
import { escapeHtml, formatDate, countText } from "../format.js";
import { renderBadge, renderTable } from "../components.js";
import { showLoadingIn, showErrorIn, runAction } from "../status.js";

const ACTIVE = "active";
const SUSPENDED = "suspended";
const USER_HEADERS = ["Nombre", "Correo", "Tipo de cuenta", "Registro", "Estado", "Acción"];

const userTable = document.querySelector("#user-table");
const userCount = document.querySelector("#user-count");
const statusFilter = document.querySelector("#user-status");
const admin = requireAdmin();

let users = [];

const getAccountType = (user) => {
    if (isAdmin(user)) return renderBadge("Administrador", "dark");
    if (!user.planName) return renderBadge("Sin plan", "light");
    return renderBadge(user.planName);
};

const renderStatusButton = (user) => {
    if (user.id === admin.id) return "<span class=\"field-hint\">Tu cuenta</span>";
    const isActive = user.status === ACTIVE;
    return `<button class="button ${isActive ? "danger" : "secondary"} small" type="button" data-id="${user.id}">${isActive ? "Suspender" : "Reactivar"}</button>`;
};

const renderUserRow = (user) => `
    <tr>
        <td>${escapeHtml(`${user.firstName} ${user.lastName}`)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${getAccountType(user)}</td>
        <td>${formatDate(user.createdAt)}</td>
        <td>${user.status === ACTIVE ? renderBadge("Activa") : renderBadge("Suspendida", "light")}</td>
        <td>${renderStatusButton(user)}</td>
    </tr>`;

const renderUserTable = () => {
    userCount.textContent = countText(users.length, "usuario", "usuarios");
    if (users.length === 0) {
        userTable.innerHTML = "<p class=\"center muted\">No hay usuarios con ese estado.</p>";
        return;
    }
    userTable.innerHTML = renderTable(USER_HEADERS, users.map(renderUserRow));
};

const loadUsers = async () => {
    showLoadingIn(userTable, "Cargando los usuarios...");
    userCount.textContent = "";
    try {
        users = await request(buildPath("/users", { status: statusFilter.value }));
        renderUserTable();
    } catch (error) {
        showErrorIn(userTable, error.message, loadUsers);
    }
};

const changeUserStatus = (user) => {
    const status = user.status === ACTIVE ? SUSPENDED : ACTIVE;
    runAction({
        loadingMessage: status === SUSPENDED ? "Suspendiendo la cuenta..." : "Reactivando la cuenta...",
        successMessage: status === SUSPENDED ? "Cuenta suspendida" : "Cuenta reactivada",
        action: () => request(`/users/${user.id}/status`, { method: "PATCH", body: { status } }),
        onSuccess: loadUsers
    });
};

const handleTableClick = (event) => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    changeUserStatus(users.find((user) => user.id === Number(button.dataset.id)));
};

if (admin) {
    initLayout("admin-users");
    loadUsers();
    statusFilter.addEventListener("change", loadUsers);
    userTable.addEventListener("click", handleTableClick);
}
