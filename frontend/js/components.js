import { request } from "./api.js";
import { escapeHtml, getDifficultyLabel, renderStars, getAverageRating } from "./format.js";

export const getRecipeImage = (recipeId) => `img/recipes/${recipeId}.jpg`;

export const getRecipeRatings = async (recipes) => {
    const ratings = await Promise.all(recipes.map(async (recipe) => {
        try {
            return getAverageRating(await request(`/recipes/${recipe.id}/reviews`));
        } catch {
            return 0;
        }
    }));
    return new Map(recipes.map((recipe, index) => [recipe.id, ratings[index]]));
};

export const renderRecipeCard = (recipe, { rating = 0, extraButton = "" } = {}) => `
    <article class="recipe-card">
        <img src="${getRecipeImage(recipe.id)}" alt="${escapeHtml(recipe.name)}">
        ${recipe.isPremium ? "<span class=\"badge\">Premium</span>" : ""}
        ${rating > 0 ? `<span class="stars" title="Calificación promedio">${renderStars(rating)}</span>` : ""}
        <div class="recipe-card-overlay">
            <span class="recipe-card-name">${escapeHtml(recipe.name)}</span>
            <span class="recipe-card-meta">${escapeHtml(recipe.cuisineType)} · ${getDifficultyLabel(recipe.difficulty)} · ${recipe.prepTimeMinutes} min</span>
            <div class="recipe-card-actions">
                <a class="button light small" href="recipe.html?id=${recipe.id}">Ver receta</a>
                ${extraButton}
            </div>
        </div>
    </article>`;

export const renderRecipeGrid = (container, recipes, ratings = new Map()) => {
    container.innerHTML = recipes.map((recipe) => renderRecipeCard(recipe, { rating: ratings.get(recipe.id) })).join("");
};
