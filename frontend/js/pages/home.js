import { initLayout } from "../layout.js";
import { request } from "../api.js";
import { getUser } from "../session.js";
import { escapeHtml, formatPrice } from "../format.js";
import { renderRecipeGrid, getRecipeRatings } from "../components.js";
import { showLoadingIn, showErrorIn } from "../status.js";

const FEATURED_RECIPES = 8;

const getPlanBenefits = (plan) => {
    const benefits = [];
    benefits.push(plan.monthlyRecipeLimit === null
        ? "Acceso a todo el catálogo, incluidas las recetas premium"
        : `Consulta hasta ${plan.monthlyRecipeLimit} recetas gratuitas al mes`);
    benefits.push("Guardar recetas en tu colección");
    benefits.push("Consultar tu actividad de cocina");
    if (plan.includesWeeklyBox) benefits.push("Recomendación semanal de caja de ingredientes");
    return benefits;
};

const renderPlans = (plans) => {
    const target = getUser() ? "profile.html#subscription" : "register.html";
    document.querySelector("#plan-list").innerHTML = plans.map((plan) => `
        <article class="plan-card ${plan.includesWeeklyBox ? "featured" : ""}">
            <h3>Plan ${escapeHtml(plan.name)}</h3>
            <p class="plan-price">${formatPrice(plan.price)}<small>/mes</small></p>
            <ul>${getPlanBenefits(plan).map((benefit) => `<li>${benefit}</li>`).join("")}</ul>
            <a class="button ${plan.includesWeeklyBox ? "light" : ""}" href="${target}">Comenzar</a>
        </article>`).join("");
};

const loadFeaturedRecipes = async () => {
    const container = document.querySelector("#featured-recipes");
    showLoadingIn(container, "Cargando recetas destacadas...");
    try {
        const recipes = (await request("/recipes")).slice(0, FEATURED_RECIPES);
        renderRecipeGrid(container, recipes, await getRecipeRatings(recipes));
    } catch (error) {
        showErrorIn(container, error.message, loadFeaturedRecipes);
    }
};

const loadPlans = async () => {
    const container = document.querySelector("#plan-list");
    showLoadingIn(container, "Cargando planes...");
    try {
        renderPlans(await request("/plans"));
    } catch (error) {
        showErrorIn(container, error.message, loadPlans);
    }
};

initLayout("home");
if (getUser()) {
    const sessionLink = document.querySelector("#hero-session-link");
    sessionLink.textContent = "Ir a mi panel";
    sessionLink.href = "dashboard.html";
}
loadFeaturedRecipes();
loadPlans();
