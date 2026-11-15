const DIFFICULTY_LABELS = { easy: "Fácil", medium: "Media", hard: "Alta" };
const MILLISECONDS_IN_DAY = 86400000;
const MAX_RATING = 5;

const priceFormat = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export const escapeHtml = (text) => String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");

export const countText = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;

export const getDifficultyLabel = (difficulty) => DIFFICULTY_LABELS[difficulty] ?? difficulty;

export const getDifficultyOptions = () => Object.entries(DIFFICULTY_LABELS);

export const formatPrice = (price) => priceFormat.format(Number(price));

export const toDate = (text) => {
    const [year, month, day] = text.slice(0, 10).split("-").map(Number);
    return new Date(year, month - 1, day);
};

export const formatDate = (text) => (text ? toDate(text).toLocaleDateString("es-CO") : "Sin fecha");

export const formatMonthYear = (text) => toDate(text).toLocaleDateString("es-CO", { month: "long", year: "numeric" });

export const getDaysBetween = (startText, endText) => Math.round((toDate(endText) - toDate(startText)) / MILLISECONDS_IN_DAY);

export const getTodayText = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${today.getFullYear()}-${month}-${day}`;
};

const STAR_PATH = "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z";

export const renderStarIcon = (isFilled) => `<svg class="star-icon" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path d="${STAR_PATH}" fill="${isFilled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6"/></svg>`;

export const renderStars = (rating) => {
    const fullStars = Math.round(rating);
    return [...Array(MAX_RATING).keys()].map((position) => renderStarIcon(position < fullStars)).join("");
};

export const getAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((total, review) => total + review.rating, 0) / reviews.length;
};

export const formatIngredient = (ingredient) => {
    if (ingredient.quantity === null) return `${ingredient.name}: ${ingredient.unit ?? "al gusto"}`;
    return `${ingredient.name}: ${Number(ingredient.quantity)} ${ingredient.unit ?? ""}`;
};
