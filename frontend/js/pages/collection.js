import { initLayout } from "../layout.js";
import { request } from "../api.js";
import { requireUser } from "../session.js";
import { countText } from "../format.js";
import { renderRecipeCard, getRecipeRatings } from "../components.js";
import { showLoadingIn, showErrorIn, runAction } from "../status.js";

const PAGE_SIZE = 6;
const content = document.querySelector("#collection-content");
const user = requireUser();

let visibleCount = PAGE_SIZE;
let savedRecipes = [];
let ratings = new Map();

const renderCollection = () => {
    if (savedRecipes.length === 0) {
        content.innerHTML = `
            <div class="panel center">
                <p>Todavía no has guardado recetas.</p>
                <a class="button" href="recipes.html">Explorar el catálogo</a>
            </div>`;
        return;
    }
    const removeButton = (recipeId) => `<button class="button danger small" type="button" data-remove-id="${recipeId}">Quitar</button>`;
    content.innerHTML = `
        <p class="muted">${countText(savedRecipes.length, "receta guardada", "recetas guardadas")}</p>
        <div class="recipe-grid">${savedRecipes.slice(0, visibleCount)
        .map((recipe) => renderRecipeCard(recipe, { rating: ratings.get(recipe.id), extraButton: removeButton(recipe.id) }))
        .join("")}</div>
        ${visibleCount < savedRecipes.length ? "<div class=\"center\"><button class=\"button\" type=\"button\" id=\"more-button\">Ver más</button></div>" : ""}`;
};

const removeRecipe = (recipeId) => {
    runAction({
        loadingMessage: "Quitando receta de tu colección...",
        successMessage: "Receta quitada de tu colección",
        action: () => request(`/users/${user.id}/collection/${recipeId}`, { method: "DELETE" }),
        onSuccess: () => {
            savedRecipes = savedRecipes.filter((recipe) => recipe.id !== recipeId);
            renderCollection();
        }
    });
};

const loadCollection = async () => {
    showLoadingIn(content, "Cargando tus recetas guardadas...");
    try {
        savedRecipes = await request(`/users/${user.id}/collection`);
        ratings = await getRecipeRatings(savedRecipes);
        renderCollection();
    } catch (error) {
        showErrorIn(content, error.message, loadCollection);
    }
};

initLayout("profile");
content.addEventListener("click", (event) => {
    const removeButton = event.target.closest("button[data-remove-id]");
    if (removeButton) removeRecipe(Number(removeButton.dataset.removeId));
    if (event.target.id === "more-button") {
        visibleCount += PAGE_SIZE;
        renderCollection();
    }
});
if (user) loadCollection();
