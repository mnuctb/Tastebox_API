SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP SCHEMA IF EXISTS `tastebox` ;

CREATE SCHEMA IF NOT EXISTS `tastebox` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `tastebox` ;

CREATE TABLE IF NOT EXISTS `tastebox`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `status` ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`plan` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `monthly_recipe_limit` INT NULL,
  `includes_weekly_box` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`cuisine_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`ingredient` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`recipe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cuisine_type_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `instructions` TEXT NOT NULL,
  `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL,
  `prep_time_minutes` INT NOT NULL,
  `is_premium` TINYINT NOT NULL DEFAULT 0,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_recipe_cuisine_type_idx` (`cuisine_type_id` ASC) VISIBLE,
  CONSTRAINT `fk_recipe_cuisine_type`
    FOREIGN KEY (`cuisine_type_id`)
    REFERENCES `tastebox`.`cuisine_type` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`subscription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `plan_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `status` ENUM('active', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
  `auto_renew` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `fk_subscription_user_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_subscription_plan_idx` (`plan_id` ASC) VISIBLE,
  CONSTRAINT `fk_subscription_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `tastebox`.`user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_subscription_plan`
    FOREIGN KEY (`plan_id`)
    REFERENCES `tastebox`.`plan` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `rating` TINYINT NOT NULL,
  `comment` TEXT NULL,
  `would_cook_again` TINYINT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_review_user_recipe` (`user_id` ASC, `recipe_id` ASC) VISIBLE,
  INDEX `fk_review_recipe_idx` (`recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_review_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `tastebox`.`user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_recipe`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `tastebox`.`recipe` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`cooking_activity` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `cooked_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_cooking_activity_user_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_cooking_activity_recipe_idx` (`recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_cooking_activity_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `tastebox`.`user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cooking_activity_recipe`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `tastebox`.`recipe` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`recipe_view` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `viewed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_recipe_view_user_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_recipe_view_recipe_idx` (`recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_recipe_view_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `tastebox`.`user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recipe_view_recipe`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `tastebox`.`recipe` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`weekly_box` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `recipe_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) NULL,
  `week_start_date` DATE NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `week_start_date_UNIQUE` (`week_start_date` ASC) VISIBLE,
  INDEX `fk_weekly_box_recipe_idx` (`recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_weekly_box_recipe`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `tastebox`.`recipe` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`recipe_ingredient` (
  `recipe_id` INT NOT NULL,
  `ingredient_id` INT NOT NULL,
  `quantity` DECIMAL(8,2) NULL,
  `unit` VARCHAR(20) NULL,
  PRIMARY KEY (`recipe_id`, `ingredient_id`),
  INDEX `fk_recipe_ingredient_ingredient_idx` (`ingredient_id` ASC) VISIBLE,
  CONSTRAINT `fk_recipe_ingredient_recipe`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `tastebox`.`recipe` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recipe_ingredient_ingredient`
    FOREIGN KEY (`ingredient_id`)
    REFERENCES `tastebox`.`ingredient` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`collection_item` (
  `user_id` INT NOT NULL,
  `recipe_id` INT NOT NULL,
  `saved_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`, `recipe_id`),
  INDEX `fk_collection_item_recipe_idx` (`recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_collection_item_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `tastebox`.`user` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_collection_item_recipe`
    FOREIGN KEY (`recipe_id`)
    REFERENCES `tastebox`.`recipe` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `tastebox`.`review_tag` (
  `review_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`review_id`, `tag_id`),
  INDEX `fk_review_tag_tag_idx` (`tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_review_tag_review`
    FOREIGN KEY (`review_id`)
    REFERENCES `tastebox`.`review` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_review_tag_tag`
    FOREIGN KEY (`tag_id`)
    REFERENCES `tastebox`.`tag` (`id`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
ALTER TABLE `tastebox`.`review` ADD CONSTRAINT `chk_review_rating` CHECK (`rating` BETWEEN 1 AND 5);
ALTER TABLE `tastebox`.`recipe` ADD CONSTRAINT `chk_recipe_prep_time` CHECK (`prep_time_minutes` > 0);
ALTER TABLE `tastebox`.`plan` ADD CONSTRAINT `chk_plan_price` CHECK (`price` >= 0);
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;