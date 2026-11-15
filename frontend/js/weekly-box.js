import { request } from "./api.js";
import { escapeHtml, formatDate } from "./format.js";
import { showLoadingIn, showErrorIn } from "./status.js";

const formatIngredientNames = (ingredients) => ingredients.map((ingredient) => ingredient.name).join(" + ");

const renderLockedBox = (container) => {
    container.innerHTML = `
        <section class="weekly-box">
            <img src="img/weekly-box.jpg" alt="Caja de ingredientes">
            <div>
                <p class="eyebrow">Recomendación de la semana</p>
                <h3>Beneficio del plan Premium</h3>
                <p>Con el plan Premium recibes cada semana una caja de ingredientes recomendada con su receta.</p>
                <a class="button" href="profile.html#subscription">Cambiar a Premium</a>
            </div>
        </section>`;
};

export const renderWeeklyBox = async (container, subscription) => {
    if (!subscription?.includesWeeklyBox) {
        renderLockedBox(container);
        return;
    }
    showLoadingIn(container, "Buscando la caja de esta semana...");
    try {
        const box = await request("/weekly-boxes/current");
        container.innerHTML = `
            <section class="weekly-box">
                <img src="img/weekly-box.jpg" alt="${escapeHtml(box.name)}">
                <div>
                    <p class="eyebrow">Recomendación de la semana · desde el ${formatDate(box.weekStartDate)}</p>
                    <h3>${escapeHtml(box.name)}</h3>
                    <p>${escapeHtml(box.description ?? "")}</p>
                    <p class="muted">${escapeHtml(formatIngredientNames(box.ingredients))}</p>
                    <a class="button" href="recipe.html?id=${box.recipeId}">Ver receta: ${escapeHtml(box.recipeName)}</a>
                </div>
            </section>`;
    } catch (error) {
        showErrorIn(container, error.message, () => renderWeeklyBox(container, subscription));
    }
};
