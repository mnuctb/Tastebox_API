import { initLayout } from "../layout.js";
import { request } from "../api.js";
import { escapeHtml, getDifficultyOptions, countText } from "../format.js";
import { renderRecipeGrid, getRecipeRatings } from "../components.js";
import { showLoadingIn, showErrorIn } from "../status.js";

const form = document.querySelector("#filter-form");
const results = document.querySelector("#recipe-results");
const resultCount = document.querySelector("#result-count");
const timeLabel = document.querySelector("#max-prep-time-label");
const NO_TIME_LIMIT = "60";

let recipes = [];
let ratings = new Map();

const getApiFilters = () => {
    const filters = new URLSearchParams();
    if (form.cuisineTypeId.value) filters.set("cuisineTypeId", form.cuisineTypeId.value);
    if (form.difficulty.value) filters.set("difficulty", form.difficulty.value);
    if (form.maxPrepTime.value !== NO_TIME_LIMIT) filters.set("maxPrepTime", form.maxPrepTime.value);
    return filters.toString();
};

const matchesLocalFilters = (recipe) => {
    const search = form.search.value.trim().toLowerCase();
    const access = form.access.value;
    if (search && !recipe.name.toLowerCase().includes(search)) return false;
    if (access === "premium" && !recipe.isPremium) return false;
    if (access === "free" && recipe.isPremium) return false;
    return true;
};

const showRecipes = () => {
    const visibleRecipes = recipes.filter(matchesLocalFilters);
    resultCount.textContent = countText(visibleRecipes.length, "receta encontrada", "recetas encontradas");
    if (visibleRecipes.length === 0) {
        results.innerHTML = "<p class=\"center muted\">No hay recetas con esos filtros. Prueba con otra combinación.</p>";
        return;
    }
    results.innerHTML = "<div class=\"recipe-grid\"></div>";
    renderRecipeGrid(results.firstElementChild, visibleRecipes, ratings);
};

const loadRecipes = async () => {
    showLoadingIn(results, "Buscando recetas...");
    resultCount.textContent = "";
    try {
        const filters = getApiFilters();
        recipes = await request(`/recipes${filters ? `?${filters}` : ""}`);
        ratings = await getRecipeRatings(recipes);
        showRecipes();
    } catch (error) {
        showErrorIn(results, error.message, loadRecipes);
    }
};

const updateTimeLabel = () => {
    timeLabel.textContent = form.maxPrepTime.value === NO_TIME_LIMIT ? "Sin límite" : `${form.maxPrepTime.value} min`;
};

const loadFilterOptions = async () => {
    form.difficulty.insertAdjacentHTML("beforeend", getDifficultyOptions()
        .map(([value, label]) => `<option value="${value}">${label}</option>`).join(""));
    try {
        const cuisineTypes = await request("/cuisine-types");
        form.cuisineTypeId.insertAdjacentHTML("beforeend", cuisineTypes
            .map((cuisineType) => `<option value="${cuisineType.id}">${escapeHtml(cuisineType.name)}</option>`).join(""));
    } catch {
        form.cuisineTypeId.disabled = true;
    }
};

const applyUrlFilters = () => {
    const params = new URLSearchParams(location.search);
    form.search.value = params.get("search") ?? "";
    form.cuisineTypeId.value = params.get("cuisineTypeId") ?? "";
};

initLayout("recipes");
await loadFilterOptions();
applyUrlFilters();
updateTimeLabel();
loadRecipes();
form.addEventListener("submit", (event) => event.preventDefault());
form.search.addEventListener("input", showRecipes);
form.access.addEventListener("change", showRecipes);
form.cuisineTypeId.addEventListener("change", loadRecipes);
form.difficulty.addEventListener("change", loadRecipes);
form.maxPrepTime.addEventListener("input", updateTimeLabel);
form.maxPrepTime.addEventListener("change", loadRecipes);
