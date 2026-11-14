USE tastebox;

INSERT INTO plan (name, price, monthly_recipe_limit, includes_weekly_box) VALUES
('Free', 0.00, 3, 0),
('Premium', 29900.00, NULL, 1);

INSERT INTO cuisine_type (name) VALUES
('Italiana'), ('Mexicana'), ('Asiática'), ('Mediterránea');

INSERT INTO ingredient (name) VALUES
('Pasta'), ('Albahaca fresca'), ('Ajo'), ('Queso parmesano'), ('Piñones'),
('Aceite de oliva'), ('Sal'), ('Pimienta'), ('Arroz arborio'), ('Champiñones'),
('Tortillas de maíz'), ('Carne de cerdo'), ('Piña'), ('Fideos ramen'), ('Huevo'),
('Leche de coco'), ('Pasta de curry verde'), ('Pollo'), ('Salmón'), ('Limón'),
('Vegetales mixtos');

INSERT INTO tag (name) VALUES
('Rápida'), ('Fácil'), ('Picante'), ('Saludable'), ('Para compartir');

INSERT INTO user (first_name, last_name, email, password_hash, role, status, created_at) VALUES
('Admin', 'TasteBox', 'admin@tastebox.com', '$2b$12$lw5t0OPprZkvG5HC./QUzuAFU./uU1xizoS3DV.F0mhjcry3R2mJW', 'admin', 'active', '2026-01-01 08:00:00'),
('Daniela', 'Campo', 'daniela@correo.com', '$2b$12$VqV3iWpeZtZv2SfXllwjh.5FYwSZ8D1xRJYBJZ6NLQzk3D9URzp36', 'user', 'active', '2026-01-03 10:00:00'),
('Hanna', 'Castaño', 'hanna@correo.com', '$2b$12$nUjfKP34BJ6.dk4FJkAkUOwrbfQ464nb7ldgdXphN28Tb8PW.t5bi', 'user', 'active', '2026-02-18 10:00:00'),
('Karen', 'Castaño', 'karen@correo.com', '$2b$12$oePTgzCxGtRF3T9H0TlQ8eaoOIJIKyQJzgOA6DqsiqTInMUlt5Huq', 'user', 'suspended', '2026-03-02 10:00:00'),
('Manuel', 'Vergara', 'manuel@correo.com', '$2b$12$/9Pl4KZ3QVxn80d4fQDf5uVvAEs5GvJZcpMjoLo6Wm8KnSROMuMI.', 'user', 'active', '2026-08-15 10:00:00'),
('Juan', 'Sotelo', 'juan@correo.com', '$2b$12$qaknmJtglfVTMNnKqN4OVuOUrX7HC2qdl2WKc5bpxBbpgqP78uGwW', 'user', 'active', '2026-09-20 10:00:00');

INSERT INTO recipe (cuisine_type_id, name, description, instructions, difficulty, prep_time_minutes, is_premium, status) VALUES
(1, 'Pasta al pesto', 'Pasta con salsa de albahaca fresca y piñones.', 'Cocinar la pasta. Triturar albahaca, ajo, piñones, parmesano y aceite. Mezclar y servir.', 'easy', 25, 0, 'published'),
(1, 'Risotto de champiñones', 'Arroz cremoso con champiñones salteados.', 'Saltear champiñones y ajo. Agregar el arroz y caldo poco a poco. Terminar con parmesano.', 'medium', 35, 0, 'published'),
(2, 'Tacos al pastor', 'Tacos de cerdo marinado con piña.', 'Marinar el cerdo. Asar con la piña. Servir en tortillas calientes.', 'easy', 25, 1, 'published'),
(3, 'Ramen casero', 'Sopa japonesa de fideos con huevo y pollo.', 'Preparar el caldo con pollo y ajo. Cocinar los fideos. Servir con huevo cocido.', 'hard', 50, 0, 'published'),
(3, 'Curry verde tailandés', 'Pollo en salsa de coco y curry verde.', 'Sofreír la pasta de curry. Agregar leche de coco, pollo y vegetales. Cocinar a fuego lento.', 'medium', 40, 1, 'published'),
(4, 'Salmón mediterráneo', 'Salmón al horno con vegetales y limón.', 'Disponer el salmón y los vegetales en una bandeja. Agregar aceite y limón. Hornear 20 minutos.', 'medium', 30, 1, 'published'),
(4, 'Ensalada griega', 'Ensalada fresca con aceite de oliva.', 'Cortar los vegetales, aliñar con aceite y sal.', 'easy', 15, 0, 'draft');

INSERT INTO recipe_ingredient (recipe_id, ingredient_id, quantity, unit) VALUES
(1, 1, 300, 'g'), (1, 2, 50, 'g'), (1, 3, 2, 'dientes'), (1, 4, 50, 'g'),
(1, 5, 40, 'g'), (1, 6, 60, 'ml'), (1, 7, NULL, 'al gusto'), (1, 8, NULL, 'al gusto'),
(2, 9, 300, 'g'), (2, 10, 250, 'g'), (2, 4, 40, 'g'), (2, 3, 2, 'dientes'), (2, 7, NULL, 'al gusto'),
(3, 11, 12, 'unidades'), (3, 12, 500, 'g'), (3, 13, 150, 'g'), (3, 7, NULL, 'al gusto'),
(4, 14, 200, 'g'), (4, 15, 2, 'unidades'), (4, 18, 200, 'g'), (4, 3, 1, 'diente'),
(5, 16, 400, 'ml'), (5, 17, 2, 'cucharadas'), (5, 18, 400, 'g'), (5, 21, 200, 'g'),
(6, 19, 400, 'g'), (6, 21, 300, 'g'), (6, 20, 1, 'unidad'), (6, 6, 30, 'ml'),
(7, 21, 300, 'g'), (7, 6, 30, 'ml'), (7, 7, NULL, 'al gusto');

SET @today = CURDATE();
SET @month_start = CURDATE() - INTERVAL (DAY(CURDATE()) - 1) DAY;
SET @monday = CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY;

INSERT INTO subscription (user_id, plan_id, start_date, end_date, status, auto_renew) VALUES
(2, 1, '2026-01-03', NULL, 'active', 0),
(3, 2, @today - INTERVAL 15 DAY, @today + INTERVAL 15 DAY, 'active', 1),
(4, 1, '2026-03-02', NULL, 'active', 0),
(5, 2, @today - INTERVAL 4 MONTH, @today - INTERVAL 3 MONTH, 'expired', 0),
(5, 1, @today - INTERVAL 3 MONTH + INTERVAL 1 DAY, NULL, 'active', 0),
(6, 2, @today - INTERVAL 10 DAY, @today + INTERVAL 20 DAY, 'active', 1);

INSERT INTO weekly_box (recipe_id, name, description, week_start_date) VALUES
(2, 'Caja Otoño Italiana', 'Caja de temporada para dos personas', @monday - INTERVAL 7 DAY),
(6, 'Caja Mediterránea', 'Caja de temporada para dos personas', @monday);

INSERT INTO collection_item (user_id, recipe_id, saved_at) VALUES
(3, 1, '2026-09-20 18:00:00'),
(3, 3, '2026-09-25 19:30:00'),
(3, 5, '2026-09-30 20:00:00'),
(3, 6, '2026-10-05 12:00:00'),
(2, 1, '2026-10-01 09:00:00'),
(2, 2, '2026-10-02 09:15:00'),
(6, 4, '2026-10-03 21:00:00');

INSERT INTO cooking_activity (user_id, recipe_id, cooked_at) VALUES
(3, 1, @monday - INTERVAL 21 DAY + INTERVAL 19 HOUR),
(3, 3, @monday - INTERVAL 14 DAY + INTERVAL 20 HOUR),
(3, 5, @monday - INTERVAL 7 DAY + INTERVAL 19 HOUR),
(3, 6, @monday - INTERVAL 5 DAY + INTERVAL 20 HOUR),
(3, 1, @monday + INTERVAL 19 HOUR),
(2, 2, @monday - INTERVAL 6 DAY + INTERVAL 13 HOUR),
(6, 4, @monday - INTERVAL 4 DAY + INTERVAL 20 HOUR);

INSERT INTO review (user_id, recipe_id, rating, comment, would_cook_again, created_at) VALUES
(3, 1, 5, 'Muy fácil y deliciosa.', 1, @monday - INTERVAL 21 DAY + INTERVAL 21 HOUR),
(3, 3, 4, 'Buen sabor, un poco picante.', 1, @monday - INTERVAL 14 DAY + INTERVAL 22 HOUR),
(3, 5, 5, 'La mejor receta del catálogo.', 1, @monday - INTERVAL 7 DAY + INTERVAL 21 HOUR),
(2, 2, 3, NULL, 0, @monday - INTERVAL 6 DAY + INTERVAL 15 HOUR),
(6, 4, 4, 'Excelente caldo.', NULL, @monday - INTERVAL 4 DAY + INTERVAL 22 HOUR);

INSERT INTO review_tag (review_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 5),
(3, 3),
(4, 2);

INSERT INTO recipe_view (user_id, recipe_id, viewed_at) VALUES
(2, 1, @month_start + INTERVAL 8 HOUR),
(2, 1, @month_start + INTERVAL 18 HOUR),
(2, 2, @month_start + INTERVAL 1 DAY + INTERVAL 9 HOUR),
(2, 4, @month_start + INTERVAL 3 DAY + INTERVAL 10 HOUR),
(5, 1, @month_start + INTERVAL 4 DAY + INTERVAL 11 HOUR),
(3, 1, @month_start + INTERVAL 12 HOUR),
(3, 3, @month_start + INTERVAL 1 DAY + INTERVAL 12 HOUR),
(3, 5, @month_start + INTERVAL 1 DAY + INTERVAL 18 HOUR),
(3, 6, @month_start + INTERVAL 4 DAY + INTERVAL 11 HOUR);
