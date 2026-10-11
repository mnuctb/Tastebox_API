USE tastebox;

INSERT INTO plans (name, price, monthly_recipe_limit, includes_weekly_box) VALUES
('Free', 0.00, 3, 0),
('Premium', 29900.00, NULL, 1);

INSERT INTO cuisine_types (name) VALUES
('Italiana'), ('Mexicana'), ('Asiática'), ('Mediterránea');

INSERT INTO ingredients (name) VALUES
('Pasta'), ('Albahaca fresca'), ('Ajo'), ('Queso parmesano'), ('Piñones'),
('Aceite de oliva'), ('Sal'), ('Pimienta'), ('Arroz arborio'), ('Champiñones'),
('Tortillas de maíz'), ('Carne de cerdo'), ('Piña'), ('Fideos ramen'), ('Huevo'),
('Leche de coco'), ('Pasta de curry verde'), ('Pollo'), ('Salmón'), ('Limón'),
('Vegetales mixtos');

INSERT INTO tags (name) VALUES
('Rápida'), ('Fácil'), ('Picante'), ('Saludable'), ('Para compartir');

INSERT INTO users (first_name, last_name, email, password, role, status, created_at) VALUES
('Admin', 'TasteBox', 'admin@tastebox.com', 'Admin2026', 'admin', 'active', '2026-01-01 08:00:00'),
('Daniela', 'Campo', 'daniela@correo.com', 'Daniela2026', 'user', 'active', '2026-01-03 10:00:00'),
('Hanna', 'Castaño', 'hanna@correo.com', 'Hanna2026', 'user', 'active', '2026-02-18 10:00:00'),
('Karen', 'Castaño', 'karen@correo.com', 'Karen2026', 'user', 'suspended', '2026-03-02 10:00:00'),
('Manuel', 'Vergara', 'manuel@correo.com', 'Manuel2026', 'user', 'active', '2026-08-15 10:00:00'),
('Juan', 'Sotelo', 'juan@correo.com', 'Juan2026', 'user', 'active', '2026-09-20 10:00:00');

INSERT INTO recipes (cuisine_type_id, name, description, instructions, difficulty, prep_time_minutes, is_premium, status) VALUES
(1, 'Pasta al pesto', 'Pasta con salsa de albahaca fresca y piñones.', 'Cocinar la pasta. Triturar albahaca, ajo, piñones, parmesano y aceite. Mezclar y servir.', 'easy', 25, 0, 'published'),
(1, 'Risotto de champiñones', 'Arroz cremoso con champiñones salteados.', 'Saltear champiñones y ajo. Agregar el arroz y caldo poco a poco. Terminar con parmesano.', 'medium', 35, 0, 'published'),
(2, 'Tacos al pastor', 'Tacos de cerdo marinado con piña.', 'Marinar el cerdo. Asar con la piña. Servir en tortillas calientes.', 'easy', 25, 1, 'published'),
(3, 'Ramen casero', 'Sopa japonesa de fideos con huevo y pollo.', 'Preparar el caldo con pollo y ajo. Cocinar los fideos. Servir con huevo cocido.', 'hard', 50, 0, 'published'),
(3, 'Curry verde tailandés', 'Pollo en salsa de coco y curry verde.', 'Sofreír la pasta de curry. Agregar leche de coco, pollo y vegetales. Cocinar a fuego lento.', 'medium', 40, 1, 'published'),
(4, 'Salmón mediterráneo', 'Salmón al horno con vegetales y limón.', 'Disponer el salmón y los vegetales en una bandeja. Agregar aceite y limón. Hornear 20 minutos.', 'medium', 30, 1, 'published'),
(4, 'Ensalada griega', 'Ensalada fresca con aceite de oliva.', 'Cortar los vegetales, aliñar con aceite y sal.', 'easy', 15, 0, 'draft');

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES
(1, 1, 300, 'g'), (1, 2, 50, 'g'), (1, 3, 2, 'dientes'), (1, 4, 50, 'g'),
(1, 5, 40, 'g'), (1, 6, 60, 'ml'), (1, 7, NULL, 'al gusto'), (1, 8, NULL, 'al gusto'),
(2, 9, 300, 'g'), (2, 10, 250, 'g'), (2, 4, 40, 'g'), (2, 3, 2, 'dientes'), (2, 7, NULL, 'al gusto'),
(3, 11, 12, 'unidades'), (3, 12, 500, 'g'), (3, 13, 150, 'g'), (3, 7, NULL, 'al gusto'),
(4, 14, 200, 'g'), (4, 15, 2, 'unidades'), (4, 18, 200, 'g'), (4, 3, 1, 'diente'),
(5, 16, 400, 'ml'), (5, 17, 2, 'cucharadas'), (5, 18, 400, 'g'), (5, 21, 200, 'g'),
(6, 19, 400, 'g'), (6, 21, 300, 'g'), (6, 20, 1, 'unidad'), (6, 6, 30, 'ml'),
(7, 21, 300, 'g'), (7, 6, 30, 'ml'), (7, 7, NULL, 'al gusto');

INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status, auto_renew) VALUES
(2, 1, '2026-01-03', NULL, 'active', 0),
(3, 2, '2026-09-15', '2026-10-15', 'active', 1),
(4, 1, '2026-03-02', NULL, 'active', 0),
(5, 2, '2026-07-15', '2026-08-15', 'expired', 0),
(5, 1, '2026-08-16', NULL, 'active', 0),
(6, 2, '2026-09-20', '2026-10-20', 'active', 1);

INSERT INTO weekly_boxes (recipe_id, name, description, week_start_date) VALUES
(2, 'Caja Otoño Italiana', 'Arroz arborio + Champiñones + Parmesano', '2026-09-28'),
(6, 'Caja Mediterránea', 'Salmón + Vegetales + Limón', '2026-10-05');

INSERT INTO collection_items (user_id, recipe_id, saved_at) VALUES
(3, 1, '2026-09-20 18:00:00'),
(3, 3, '2026-09-25 19:30:00'),
(3, 5, '2026-09-30 20:00:00'),
(3, 6, '2026-10-05 12:00:00'),
(2, 1, '2026-10-01 09:00:00'),
(2, 2, '2026-10-02 09:15:00'),
(6, 4, '2026-10-03 21:00:00');

INSERT INTO cooking_activity (user_id, recipe_id, cooked_at) VALUES
(3, 1, '2026-09-21 19:00:00'),
(3, 3, '2026-09-29 20:00:00'),
(3, 5, '2026-10-02 19:30:00'),
(3, 6, '2026-10-06 20:00:00'),
(3, 1, '2026-10-08 19:00:00'),
(2, 2, '2026-10-03 13:00:00'),
(6, 4, '2026-10-07 20:30:00');

INSERT INTO reviews (user_id, recipe_id, rating, comment, would_cook_again, created_at) VALUES
(3, 1, 5, 'Muy fácil y deliciosa.', 1, '2026-09-21 21:00:00'),
(3, 3, 4, 'Buen sabor, un poco picante.', 1, '2026-09-29 22:00:00'),
(3, 5, 5, 'La mejor receta del catálogo.', 1, '2026-10-02 21:30:00'),
(2, 2, 3, NULL, 0, '2026-10-03 15:00:00'),
(6, 4, 4, 'Excelente caldo.', NULL, '2026-10-07 22:00:00');

INSERT INTO review_tags (review_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 5),
(3, 3),
(4, 2);

INSERT INTO recipe_views (user_id, recipe_id, viewed_at) VALUES
(2, 1, '2026-10-01 08:50:00'),
(2, 1, '2026-10-01 18:00:00'),
(2, 2, '2026-10-02 09:00:00'),
(2, 4, '2026-10-04 10:00:00'),
(5, 1, '2026-10-05 11:00:00'),
(3, 1, '2026-10-01 12:00:00'),
(3, 3, '2026-10-02 12:00:00'),
(3, 5, '2026-10-02 18:00:00'),
(3, 6, '2026-10-05 11:30:00');