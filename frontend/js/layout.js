import { request } from "./api.js";
import { getUser, clearSession, isAdmin } from "./session.js";
import { escapeHtml } from "./format.js";

const DEFAULT_IMAGE = "img/recipes/default.svg";

const NAV_LINKS = [
    { page: "home", href: "index.html", text: "Inicio" },
    { page: "recipes", href: "recipes.html", text: "Recetas" },
    { page: "plans", href: "index.html#plans", text: "Planes" }
];

const USER_LINKS = [
    { page: "dashboard", href: "dashboard.html", text: "Mi panel" },
    { page: "profile", href: "profile.html", text: "Perfil" }
];

const ADMIN_LINKS = [
    { page: "admin-recipes", href: "admin-recipes.html", text: "Recetas" },
    { page: "admin-subscriptions", href: "admin-subscriptions.html", text: "Suscripciones" },
    { page: "admin-users", href: "admin-users.html", text: "Usuarios" }
];

const getNavLinks = (user) => {
    if (isAdmin(user)) return ADMIN_LINKS;
    if (user) return [...NAV_LINKS, ...USER_LINKS];
    return NAV_LINKS;
};

const getHeaderActions = (user) => {
    if (!user) {
        return `
            <a class="link" href="login.html">Iniciar sesión</a>
            <a class="button" href="register.html">Registrarse</a>`;
    }
    return `
        <span class="user-greeting">Hola, ${escapeHtml(user.firstName)}</span>
        <button class="button secondary small" type="button" id="logout-button">Cerrar sesión</button>`;
};

export const logout = () => {
    clearSession();
    location.href = "index.html";
};

const getLogoHtml = (user) => {
    if (isAdmin(user)) return "<a class=\"logo\" href=\"admin-recipes.html\">TasteBox<span class=\"logo-tag\">Panel administrador</span></a>";
    return "<a class=\"logo\" href=\"index.html\">TasteBox</a>";
};

const renderHeader = (activePage) => {
    const user = getUser();
    const navHtml = getNavLinks(user)
        .map((link) => `<a href="${link.href}" class="${link.page === activePage ? "active" : ""}">${link.text}</a>`)
        .join("");
    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
        <div class="container">
            ${getLogoHtml(user)}
            <nav class="main-nav">${navHtml}</nav>
            <div class="header-actions">${getHeaderActions(user)}</div>
        </div>`;
    document.body.prepend(header);
    header.querySelector("#logout-button")?.addEventListener("click", logout);
};

const loadFooterCuisines = async (cuisineList) => {
    try {
        const cuisineTypes = await request("/cuisine-types");
        cuisineList.innerHTML = cuisineTypes
            .map((cuisineType) => `<li><a href="recipes.html?cuisineTypeId=${cuisineType.id}">${escapeHtml(cuisineType.name)}</a></li>`)
            .join("");
    } catch {
        cuisineList.innerHTML = "<li>No disponible</li>";
    }
};

const renderFooter = () => {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
        <div class="container">
            <div>
                <a class="logo" href="index.html">TasteBox</a>
                <p>Cajas con ingredientes y recetas para convertir cada comida en una experiencia.</p>
            </div>
            <div>
                <h4>Plataforma</h4>
                <ul>
                    <li><a href="recipes.html">Recetas</a></li>
                    <li><a href="index.html#plans">Planes</a></li>
                    <li><a href="profile.html">Mi cuenta</a></li>
                </ul>
            </div>
            <div>
                <h4>Cocinas</h4>
                <ul id="footer-cuisines"></ul>
            </div>
            <div>
                <h4>Proyecto académico</h4>
                <p>Prototipo funcional desarrollado para Ingeniería Multimedia, sin pagos ni envíos reales.</p>
            </div>
        </div>
        <div class="container footer-bottom"></div>`;
    document.body.append(footer);
    loadFooterCuisines(footer.querySelector("#footer-cuisines"));
};

const showDefaultImage = (image) => {
    if (!image.src.endsWith(DEFAULT_IMAGE)) image.src = DEFAULT_IMAGE;
};

const useDefaultImageOnError = () => {
    document.addEventListener("error", (event) => {
        if (event.target.tagName === "IMG") showDefaultImage(event.target);
    }, true);
    document.querySelectorAll("img").forEach((image) => {
        if (image.complete && image.naturalWidth === 0) showDefaultImage(image);
    });
};

export const initLayout = (activePage) => {
    useDefaultImageOnError();
    renderHeader(activePage);
    renderFooter();
};
