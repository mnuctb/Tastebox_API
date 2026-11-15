import { initLayout } from "../layout.js";
import { request, HTTP_STATUS } from "../api.js";
import { requireUser } from "../session.js";
import { escapeHtml, getDifficultyLabel, renderStars, renderStarIcon, formatDate, formatIngredient } from "../format.js";
import { getRecipeImage } from "../components.js";
import { showLoadingIn, showErrorIn, runAction } from "../status.js";

const page = document.querySelector("#recipe-page");
const user = requireUser();
const recipeId = Number(new URLSearchParams(location.search).get("id"));

let isSaved = false;
let selectedRating = 0;

const getSteps = (instructions) => instructions
    .split(/\.\s+/)
    .map((step) => step.trim().replace(/\.$/, ""))
    .filter((step) => step.length > 0);

const renderReviews = (reviews) => {
    if (reviews.length === 0) return "<p class=\"muted\">Esta receta todavía no tiene calificaciones.</p>";
    return `<ul class="review-list">${reviews.map((review) => `
        <li class="review-item">
            <strong>${escapeHtml(review.userName)}</strong>
            <span class="stars">${renderStars(review.rating)}</span>
            <span class="muted"> - ${formatDate(review.createdAt)}</span>
            ${review.comment ? `<p>${escapeHtml(review.comment)}</p>` : ""}
            <p class="field-hint">
                ${review.wouldCookAgain === null ? "" : `La volvería a cocinar: ${review.wouldCookAgain ? "sí" : "no"}`}
                ${review.tags ? ` - Etiquetas: ${escapeHtml(review.tags)}` : ""}
            </p>
        </li>`).join("")}</ul>`;
};

const renderTags = (tags) => tags.map((tag) => `
    <label><input type="checkbox" name="tagIds" value="${tag.id}"> ${escapeHtml(tag.name)}</label>`).join("");

const renderRatingButtons = () => {
    const container = page.querySelector("#rating-input");
    container.innerHTML = [1, 2, 3, 4, 5].map((value) => `
        <button type="button" data-rating="${value}" aria-label="${value} estrellas">${renderStarIcon(value <= selectedRating)}</button>`).join("");
};

const updateSaveButton = () => {
    page.querySelector("#save-button").textContent = isSaved ? "Quitar de mi colección" : "Guardar en mi colección";
};

const renderReviewForm = (tags) => `
    <form class="panel" id="review-form">
        <h3>¿Qué te pareció?</h3>
        <p class="field-hint">Solo puedes calificar una receta después de marcarla como preparada.</p>
        <div class="rating-input" id="rating-input"></div>
        <p><strong>¿La volverías a cocinar?</strong></p>
        <div class="choice-group">
            <label><input type="radio" name="wouldCookAgain" value="true"> Sí</label>
            <label><input type="radio" name="wouldCookAgain" value="false"> No</label>
        </div>
        <p><strong>Etiquetas</strong></p>
        <div class="choice-group">${renderTags(tags)}</div>
        <div class="form-field">
            <label for="comment">Comentario</label>
            <textarea id="comment" name="comment" maxlength="500"></textarea>
        </div>
        <button class="button" type="submit">Enviar calificación</button>
    </form>`;

const renderRecipe = (recipe, reviews, tags) => {
    page.innerHTML = `
        <section class="recipe-detail">
            <div>
                <img class="recipe-detail-image" src="${getRecipeImage(recipe.id)}" alt="${escapeHtml(recipe.name)}">
                <h3 class="section-subtitle">Ingredientes</h3>
                <ul class="ingredient-list">${recipe.ingredients.map((ingredient) => `<li>${escapeHtml(formatIngredient(ingredient))}</li>`).join("")}</ul>
            </div>
            <div>
                <p class="eyebrow">${escapeHtml(recipe.cuisineType)}</p>
                <h1>${escapeHtml(recipe.name)}</h1>
                <div class="recipe-facts">
                    <span class="badge light">Dificultad: ${getDifficultyLabel(recipe.difficulty)}</span>
                    <span class="badge light">${recipe.prepTimeMinutes} minutos</span>
                    ${recipe.isPremium ? "<span class=\"badge\">Premium</span>" : ""}
                </div>
                <p>${escapeHtml(recipe.description ?? "")}</p>
                <h3>Preparación</h3>
                <ol>${getSteps(recipe.instructions).map((step) => `<li>${escapeHtml(step)}.</li>`).join("")}</ol>
                <div class="recipe-actions">
                    <button class="button" type="button" id="save-button"></button>
                    <button class="button secondary" type="button" id="cooked-button">Marcar como preparada</button>
                </div>
                ${renderReviewForm(tags)}
            </div>
        </section>
        <section class="section">
            <h2>Opiniones</h2>
            <div id="review-list">${renderReviews(reviews)}</div>
        </section>`;
    updateSaveButton();
    renderRatingButtons();
};

const toggleSaved = () => {
    const collectionPath = `/users/${user.id}/collection`;
    runAction({
        loadingMessage: isSaved ? "Quitando receta de tu colección..." : "Guardando receta en tu colección...",
        successMessage: isSaved ? "Receta quitada de tu colección" : "Receta guardada con éxito",
        action: () => (isSaved
            ? request(`${collectionPath}/${recipeId}`, { method: "DELETE" })
            : request(collectionPath, { method: "POST", body: { recipeId } })),
        onSuccess: () => {
            isSaved = !isSaved;
            updateSaveButton();
        }
    });
};

const markAsCooked = () => {
    runAction({
        loadingMessage: "Registrando tu preparación...",
        successMessage: "Receta marcada como preparada",
        action: () => request(`/users/${user.id}/cooking-activity`, { method: "POST", body: { recipeId } })
    });
};

const getReviewData = (form) => {
    const review = { rating: selectedRating };
    const comment = form.comment.value.trim();
    if (comment) review.comment = comment;
    if (form.wouldCookAgain.value) review.wouldCookAgain = form.wouldCookAgain.value === "true";
    review.tagIds = [...form.querySelectorAll("input[name='tagIds']:checked")].map((input) => Number(input.value));
    return review;
};

const sendReview = (form) => {
    runAction({
        loadingMessage: "Enviando tu calificación...",
        successMessage: "Calificación enviada con éxito",
        action: () => request(`/recipes/${recipeId}/reviews`, { method: "POST", body: getReviewData(form) }),
        onSuccess: async () => {
            form.reset();
            selectedRating = 0;
            renderRatingButtons();
            page.querySelector("#review-list").innerHTML = renderReviews(await request(`/recipes/${recipeId}/reviews`));
        }
    });
};

const addEvents = () => {
    page.querySelector("#save-button").addEventListener("click", toggleSaved);
    page.querySelector("#cooked-button").addEventListener("click", markAsCooked);
    page.querySelector("#rating-input").addEventListener("click", (event) => {
        const button = event.target.closest("button[data-rating]");
        if (!button) return;
        selectedRating = Number(button.dataset.rating);
        renderRatingButtons();
    });
    page.querySelector("#review-form").addEventListener("submit", (event) => {
        event.preventDefault();
        sendReview(event.currentTarget);
    });
};

const showRecipeError = (error) => {
    showErrorIn(page, error.message, error.status === HTTP_STATUS.forbidden ? null : loadRecipe);
    if (error.status === HTTP_STATUS.forbidden) {
        page.insertAdjacentHTML("beforeend", "<p class=\"center\"><a class=\"button\" href=\"profile.html#subscription\">Ver planes</a> <a class=\"button secondary\" href=\"recipes.html\">Volver al catálogo</a></p>");
    }
};

const loadRecipe = async () => {
    showLoadingIn(page, "Cargando receta...");
    try {
        const [recipe, reviews, tags, collection] = await Promise.all([
            request(`/recipes/${recipeId}`),
            request(`/recipes/${recipeId}/reviews`),
            request("/tags"),
            request(`/users/${user.id}/collection`)
        ]);
        isSaved = collection.some((savedRecipe) => savedRecipe.id === recipeId);
        document.title = `TasteBox | ${recipe.name}`;
        renderRecipe(recipe, reviews, tags);
        addEvents();
    } catch (error) {
        showRecipeError(error);
    }
};

initLayout("recipes");
if (user) loadRecipe();
