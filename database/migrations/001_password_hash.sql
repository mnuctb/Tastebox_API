RENAME TABLE `tastebox`.`users` TO `tastebox`.`user`,
  `tastebox`.`plans` TO `tastebox`.`plan`,
  `tastebox`.`cuisine_types` TO `tastebox`.`cuisine_type`,
  `tastebox`.`ingredients` TO `tastebox`.`ingredient`,
  `tastebox`.`tags` TO `tastebox`.`tag`,
  `tastebox`.`recipes` TO `tastebox`.`recipe`,
  `tastebox`.`subscriptions` TO `tastebox`.`subscription`,
  `tastebox`.`reviews` TO `tastebox`.`review`,
  `tastebox`.`recipe_views` TO `tastebox`.`recipe_view`,
  `tastebox`.`weekly_boxes` TO `tastebox`.`weekly_box`,
  `tastebox`.`recipe_ingredients` TO `tastebox`.`recipe_ingredient`,
  `tastebox`.`collection_items` TO `tastebox`.`collection_item`,
  `tastebox`.`review_tags` TO `tastebox`.`review_tag`;

ALTER TABLE `tastebox`.`user`
  CHANGE COLUMN `password` `password_hash` VARCHAR(255) NOT NULL;
