import { initLayout } from "../layout.js";
import { request } from "../api.js";
import { requireAdmin } from "../session.js";
import { escapeHtml, getDifficultyLabel, getDifficultyOptions, countText, formatIngredient } from "../format.js";
import { renderBadge, renderTable } from "../components.js";
import { showLoadingIn, showErrorIn, runAction } from "../status.js";

const PUBLISHED = "published";
const DRAFT = "draft";
const STATUS_LABELS = { published: "Publicada", draft: "Borrador" };
const INGREDIENT_HEADERS = ["Ingrediente y cantidad", "Acción"];
const RECIPE_HEADERS = ["Nombre", "Tipo de cocina", "Dificultad", "Tiempo", "Estado", "Acciones"];

const recipeTable = document.querySelector("#recipe-table");
const recipeCount = document.querySelector("#recipe-count");
const editor = document.querySelector("#recipe-editor");
const editorTitle = document.querySelector("#editor-title");
const recipeForm = document.querySelector("#recipe-form");
const ingredientSection = document.querySelector("#ingredient-section");
const ingredientList = document.querySelector("#ingredient-list");
const ingredientForm = document.querySelector("#ingredient-form");
const newIngredientForm = document.querySelector("#new-ingredient-form");

let recipes = [];
let editingRecipe = null;

const getField = (form, name) => form.elements.namedItem(name);

const toRecipeBody = (recipe) => ({
    name: recipe.name,
    cuisineTypeId: recipe.cuisineTypeId,
    difficulty: recipe.difficulty,
    prepTimeMinutes: recipe.prepTimeMinutes,
    description: recipe.description,
    instructions: recipe.instructions,
    isPremium: Boolean(recipe.isPremium),
    status: recipe.status
});

const readRecipeForm = () => ({
    name: getField(recipeForm, "name").value.trim(),
    cuisineTypeId: Number(getField(recipeForm, "cuisineTypeId").value),
    difficulty: getField(recipeForm, "difficulty").value,
    prepTimeMinutes: Number(getField(recipeForm, "prepTimeMinutes").value),
    description: getField(recipeForm, "description").value.trim() || null,
    instructions: getField(recipeForm, "instructions").value.trim(),
    isPremium: getField(recipeForm, "isPremium").checked,
    status: getField(recipeForm, "status").value
});

const fillRecipeForm = (recipe) => {
    getField(recipeForm, "name").value = recipe.name;
    getField(recipeForm, "cuisineTypeId").value = recipe.cuisineTypeId;
    getField(recipeForm, "difficulty").value = recipe.difficulty;
    getField(recipeForm, "prepTimeMinutes").value = recipe.prepTimeMinutes;
    getField(recipeForm, "description").value = recipe.description ?? "";
    getField(recipeForm, "instructions").value = recipe.instructions;
    getField(recipeForm, "isPremium").checked = Boolean(recipe.isPremium);
    getField(recipeForm, "status").value = recipe.status;
};

const renderStatusBadges = (recipe) => {
    const statusBadge = renderBadge(STATUS_LABELS[recipe.status], recipe.status === PUBLISHED ? "" : "dark");
    const premiumBadge = recipe.isPremium ? renderBadge("Premium", "light") : "";
    return `${statusBadge} ${premiumBadge}`;
};

const renderRecipeRow = (recipe) => `
    <tr>
        <td>${escapeHtml(recipe.name)}</td>
        <td>${escapeHtml(recipe.cuisineType)}</td>
        <td>${getDifficultyLabel(recipe.difficulty)}</td>
        <td>${recipe.prepTimeMinutes} min</td>
        <td>${renderStatusBadges(recipe)}</td>
        <td>
            <div class="table-actions">
                <button class="button secondary small" type="button" data-action="edit" data-id="${recipe.id}">Editar</button>
                <button class="button light small" type="button" data-action="toggle" data-id="${recipe.id}">${recipe.status === PUBLISHED ? "Pasar a borrador" : "Publicar"}</button>
                <button class="button danger small" type="button" data-action="delete" data-id="${recipe.id}">Eliminar</button>
            </div>
        </td>
    </tr>`;

const renderRecipeTable = () => {
    recipeCount.textContent = countText(recipes.length, "receta en el catálogo", "recetas en el catálogo");
    recipeTable.innerHTML = renderTable(RECIPE_HEADERS, recipes.map(renderRecipeRow));
};

const loadRecipes = async () => {
    showLoadingIn(recipeTable, "Cargando el catálogo...");
    recipeCount.textContent = "";
    try {
        recipes = await request("/recipes");
        renderRecipeTable();
    } catch (error) {
        showErrorIn(recipeTable, error.message, loadRecipes);
    }
};

const renderIngredientList = () => {
    if (editingRecipe.ingredients.length === 0) {
        ingredientList.innerHTML = "<p class=\"field-hint\">Esta receta todavía no tiene ingredientes.</p>";
        return;
    }
    ingredientList.innerHTML = renderTable(INGREDIENT_HEADERS, editingRecipe.ingredients.map((ingredient) => `
        <tr>
            <td>${escapeHtml(formatIngredient(ingredient))}</td>
            <td><button class="button danger small" type="button" data-ingredient-id="${ingredient.id}">Quitar</button></td>
        </tr>`));
};

const showEditorFor = (recipe) => {
    editingRecipe = recipe;
    editorTitle.textContent = `Editar: ${recipe.name}`;
    fillRecipeForm(recipe);
    ingredientSection.hidden = false;
    renderIngredientList();
};

const openNewRecipe = () => {
    editingRecipe = null;
    editorTitle.textContent = "Agregar receta";
    recipeForm.reset();
    ingredientSection.hidden = true;
    editor.hidden = false;
    editor.scrollIntoView({ behavior: "smooth" });
};

const openRecipe = async (recipeId) => {
    editor.hidden = false;
    editor.scrollIntoView({ behavior: "smooth" });
    ingredientSection.hidden = false;
    showLoadingIn(ingredientList, "Cargando la receta...");
    try {
        showEditorFor(await request(`/recipes/${recipeId}`));
    } catch (error) {
        showErrorIn(ingredientList, error.message, () => openRecipe(recipeId));
    }
};

const closeEditor = () => {
    editor.hidden = true;
    editingRecipe = null;
};

const saveRecipe = () => {
    const isNewRecipe = editingRecipe === null;
    runAction({
        loadingMessage: "Guardando la receta...",
        successMessage: isNewRecipe ? "Receta creada" : "Receta actualizada",
        action: () => request(isNewRecipe ? "/recipes" : `/recipes/${editingRecipe.id}`, {
            method: isNewRecipe ? "POST" : "PUT",
            body: readRecipeForm()
        }),
        onSuccess: async (recipe) => {
            showEditorFor(recipe);
            await loadRecipes();
        }
    });
};

const toggleRecipeStatus = (recipe) => {
    const status = recipe.status === PUBLISHED ? DRAFT : PUBLISHED;
    runAction({
        loadingMessage: "Actualizando la receta...",
        successMessage: status === PUBLISHED ? "Receta publicada" : "Receta pasada a borrador",
        action: () => request(`/recipes/${recipe.id}`, { method: "PUT", body: { ...toRecipeBody(recipe), status } }),
        onSuccess: loadRecipes
    });
};

const deleteRecipe = (recipe) => {
    if (!window.confirm(`¿Eliminar la receta "${recipe.name}"? Esta acción no se puede deshacer.`)) return;
    runAction({
        loadingMessage: "Eliminando la receta...",
        successMessage: "Receta eliminada",
        action: () => request(`/recipes/${recipe.id}`, { method: "DELETE" }),
        onSuccess: async () => {
            if (editingRecipe?.id === recipe.id) closeEditor();
            await loadRecipes();
        }
    });
};

const readIngredientAmount = () => {
    const quantity = getField(ingredientForm, "quantity").value;
    return {
        quantity: quantity === "" ? null : Number(quantity),
        unit: getField(ingredientForm, "unit").value.trim() || null
    };
};

const addIngredient = () => {
    const ingredientId = getField(ingredientForm, "ingredientId").value;
    runAction({
        loadingMessage: "Agregando el ingrediente...",
        successMessage: "Ingrediente agregado",
        action: () => request(`/recipes/${editingRecipe.id}/ingredients/${ingredientId}`, { method: "PUT", body: readIngredientAmount() }),
        onSuccess: (recipe) => {
            ingredientForm.reset();
            showEditorFor(recipe);
        }
    });
};

const removeIngredient = (ingredientId) => {
    runAction({
        loadingMessage: "Quitando el ingrediente...",
        successMessage: "Ingrediente quitado",
        action: () => request(`/recipes/${editingRecipe.id}/ingredients/${ingredientId}`, { method: "DELETE" }),
        onSuccess: () => {
            editingRecipe.ingredients = editingRecipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId);
            renderIngredientList();
        }
    });
};

const renderIngredientOptions = (ingredients) => {
    getField(ingredientForm, "ingredientId").innerHTML = ingredients
        .map((ingredient) => `<option value="${ingredient.id}">${escapeHtml(ingredient.name)}</option>`).join("");
};

const createIngredient = () => {
    const name = getField(newIngredientForm, "ingredientName").value.trim();
    runAction({
        loadingMessage: "Creando el ingrediente...",
        successMessage: "Ingrediente creado",
        action: () => request("/ingredients", { method: "POST", body: { name } }),
        onSuccess: async (ingredient) => {
            newIngredientForm.reset();
            renderIngredientOptions(await request("/ingredients"));
            getField(ingredientForm, "ingredientId").value = ingredient.id;
        }
    });
};

const loadFormOptions = async () => {
    getField(recipeForm, "difficulty").innerHTML = getDifficultyOptions()
        .map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    const [cuisineTypes, ingredients] = await Promise.all([request("/cuisine-types"), request("/ingredients")]);
    getField(recipeForm, "cuisineTypeId").innerHTML = cuisineTypes
        .map((cuisineType) => `<option value="${cuisineType.id}">${escapeHtml(cuisineType.name)}</option>`).join("");
    renderIngredientOptions(ingredients);
};

const handleTableClick = (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const recipe = recipes.find((item) => item.id === Number(button.dataset.id));
    if (button.dataset.action === "edit") openRecipe(recipe.id);
    if (button.dataset.action === "toggle") toggleRecipeStatus(recipe);
    if (button.dataset.action === "delete") deleteRecipe(recipe);
};

const handleIngredientClick = (event) => {
    const button = event.target.closest("button[data-ingredient-id]");
    if (button) removeIngredient(Number(button.dataset.ingredientId));
};

const preventAndRun = (action) => (event) => {
    event.preventDefault();
    action();
};

if (requireAdmin()) {
    initLayout("admin-recipes");
    loadRecipes();
    loadFormOptions().catch((error) => showErrorIn(recipeTable, error.message, loadFormOptions));
    document.querySelector("#add-recipe-button").addEventListener("click", openNewRecipe);
    document.querySelector("#close-editor-button").addEventListener("click", closeEditor);
    recipeForm.addEventListener("submit", preventAndRun(saveRecipe));
    ingredientForm.addEventListener("submit", preventAndRun(addIngredient));
    newIngredientForm.addEventListener("submit", preventAndRun(createIngredient));
    recipeTable.addEventListener("click", handleTableClick);
    ingredientList.addEventListener("click", handleIngredientClick);
}
