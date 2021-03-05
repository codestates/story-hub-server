# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.22)
# Database: story_hub
# Generation Time: 2021-03-05 00:15:40 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table board_comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `board_comments`;

CREATE TABLE `board_comments` (
  `board_index` int NOT NULL,
  `comment_index` int NOT NULL,
  `is_checked` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`board_index`,`comment_index`),
  KEY `comment_index` (`comment_index`),
  CONSTRAINT `board_comments_ibfk_3` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `board_comments_ibfk_4` FOREIGN KEY (`comment_index`) REFERENCES `comments` (`comment_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table board_commits
# ------------------------------------------------------------

DROP TABLE IF EXISTS `board_commits`;

CREATE TABLE `board_commits` (
  `commit_index` int NOT NULL,
  `board_index` int NOT NULL,
  `merge_check` tinyint(1) NOT NULL DEFAULT '0',
  `is_checked` tinyint(1) DEFAULT '0',
  `depth` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commit_index`,`board_index`,`merge_check`),
  KEY `board_index` (`board_index`),
  CONSTRAINT `board_commits_ibfk_3` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `board_commits_ibfk_4` FOREIGN KEY (`commit_index`) REFERENCES `commits` (`commit_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `board_commits` WRITE;
/*!40000 ALTER TABLE `board_commits` DISABLE KEYS */;

INSERT INTO `board_commits` (`commit_index`, `board_index`, `merge_check`, `is_checked`, `depth`, `created_at`, `updated_at`)
VALUES
	(19,1,0,0,1,'2021-03-04 18:31:12','2021-03-04 18:31:12'),
	(20,1,0,0,1,'2021-03-04 18:31:37','2021-03-04 18:31:37'),
	(21,1,0,0,1,'2021-03-04 18:31:40','2021-03-04 18:31:40');

/*!40000 ALTER TABLE `board_commits` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table board_genres
# ------------------------------------------------------------

DROP TABLE IF EXISTS `board_genres`;

CREATE TABLE `board_genres` (
  `board_index` int NOT NULL,
  `genre_code` int NOT NULL,
  PRIMARY KEY (`board_index`,`genre_code`),
  KEY `genre_code` (`genre_code`),
  CONSTRAINT `board_genres_ibfk_3` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `board_genres` WRITE;
/*!40000 ALTER TABLE `board_genres` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_genres` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table boards
# ------------------------------------------------------------

DROP TABLE IF EXISTS `boards`;

CREATE TABLE `boards` (
  `board_index` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `up_count` int DEFAULT '0',
  `down_count` int DEFAULT '0',
  `visit_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`board_index`,`email`),
  KEY `email` (`email`),
  CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `boards` WRITE;
/*!40000 ALTER TABLE `boards` DISABLE KEYS */;


/*!40000 ALTER TABLE `boards` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table boards_up_down
# ------------------------------------------------------------

DROP TABLE IF EXISTS `boards_up_down`;

CREATE TABLE `boards_up_down` (
  `email` varchar(50) NOT NULL,
  `board_index` int NOT NULL,
  `check_up_down` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`,`board_index`,`check_up_down`),
  KEY `board_index` (`board_index`),
  CONSTRAINT `boards_up_down_ibfk_3` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `boards_up_down_ibfk_4` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `boards_up_down` WRITE;
/*!40000 ALTER TABLE `boards_up_down` DISABLE KEYS */;

/*!40000 ALTER TABLE `boards_up_down` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments`;

CREATE TABLE `comments` (
  `comment_index` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `content` text,
  `up_count` int DEFAULT '0',
  `down_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_index`,`email`),
  KEY `email` (`email`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;


/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table comments_up_down
# ------------------------------------------------------------

DROP TABLE IF EXISTS `comments_up_down`;

CREATE TABLE `comments_up_down` (
  `email` varchar(50) NOT NULL,
  `check_up_down` tinyint(1) NOT NULL,
  `comment_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`,`check_up_down`,`comment_index`),
  KEY `comment_index` (`comment_index`),
  CONSTRAINT `comments_up_down_ibfk_3` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_up_down_ibfk_4` FOREIGN KEY (`comment_index`) REFERENCES `comments` (`comment_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table commit_comments
# ------------------------------------------------------------

DROP TABLE IF EXISTS `commit_comments`;

CREATE TABLE `commit_comments` (
  `commit_index` int NOT NULL,
  `comment_index` int NOT NULL,
  `is_checked` tinyint DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commit_index`,`comment_index`),
  KEY `comment_index` (`comment_index`),
  CONSTRAINT `commit_comments_ibfk_3` FOREIGN KEY (`comment_index`) REFERENCES `comments` (`comment_index`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commit_comments_ibfk_4` FOREIGN KEY (`commit_index`) REFERENCES `commits` (`commit_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `commit_comments` WRITE;
/*!40000 ALTER TABLE `commit_comments` DISABLE KEYS */;

/*!40000 ALTER TABLE `commit_comments` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table commit_options
# ------------------------------------------------------------

DROP TABLE IF EXISTS `commit_options`;

CREATE TABLE `commit_options` (
  `board_index` int NOT NULL,
  `option_name` varchar(255) DEFAULT NULL,
  `min_length` int DEFAULT NULL,
  `max_length` int DEFAULT NULL,
  `etc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`board_index`),
  CONSTRAINT `commit_options_ibfk_2` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `commit_options` WRITE;
/*!40000 ALTER TABLE `commit_options` DISABLE KEYS */;

/*!40000 ALTER TABLE `commit_options` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table commits
# ------------------------------------------------------------

DROP TABLE IF EXISTS `commits`;

CREATE TABLE `commits` (
  `commit_index` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `up_count` int DEFAULT '0',
  `down_count` int DEFAULT '0',
  `visit_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commit_index`,`email`),
  KEY `email` (`email`),
  CONSTRAINT `commits_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `commits` WRITE;
/*!40000 ALTER TABLE `commits` DISABLE KEYS */;

/*!40000 ALTER TABLE `commits` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table commits_up_down
# ------------------------------------------------------------

DROP TABLE IF EXISTS `commits_up_down`;

CREATE TABLE `commits_up_down` (
  `commit_index` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `check_up_down` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commit_index`,`email`,`check_up_down`),
  KEY `email` (`email`),
  CONSTRAINT `commits_up_down_ibfk_3` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commits_up_down_ibfk_4` FOREIGN KEY (`commit_index`) REFERENCES `commits` (`commit_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table genres
# ------------------------------------------------------------

DROP TABLE IF EXISTS `genres`;

CREATE TABLE `genres` (
  `genre_code` int NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`genre_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;


/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table user_board_favorites
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_board_favorites`;

CREATE TABLE `user_board_favorites` (
  `email` varchar(50) NOT NULL,
  `board_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`,`board_index`),
  KEY `board_index` (`board_index`),
  CONSTRAINT `user_board_favorites_ibfk_3` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_board_favorites_ibfk_4` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `email` varchar(50) NOT NULL,
  `password` varchar(30) DEFAULT NULL,
  `user_name` varchar(10) DEFAULT NULL,
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
