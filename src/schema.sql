CREATE DATABASE  IF NOT EXISTS `story_hub` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `story_hub`;
-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: story_hub
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `boards`
--

DROP TABLE IF EXISTS `boards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boards` (
  `board_index` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `up_count` int DEFAULT NULL,
  `down_count` int DEFAULT NULL,
  `visit_count` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`board_index`,`email`),
  KEY `boards_ibfk_1` (`email`),
  CONSTRAINT `boards_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boards`
--

LOCK TABLES `boards` WRITE;
/*!40000 ALTER TABLE `boards` DISABLE KEYS */;
/*!40000 ALTER TABLE `boards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boards_comments`
--

DROP TABLE IF EXISTS `boards_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boards_comments` (
  `board_index` int NOT NULL,
  `comment_index` int NOT NULL,
  `is_checked` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`board_index`,`comment_index`),
  KEY `board_comments_ibfk_1` (`comment_index`),
  CONSTRAINT `boards_comments_ibfk_1` FOREIGN KEY (`comment_index`) REFERENCES `comments` (`comment_index`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `boards_comments_ibfk_2` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boards_comments`
--

LOCK TABLES `boards_comments` WRITE;
/*!40000 ALTER TABLE `boards_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `boards_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boards_commits`
--

DROP TABLE IF EXISTS `boards_commits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boards_commits` (
  `commit_index` int NOT NULL,
  `board_index` int NOT NULL,
  `merge_check` tinyint(1) NOT NULL,
  `is_checked` tinyint(1) DEFAULT NULL,
  `depth` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`commit_index`,`board_index`,`merge_check`),
  KEY `board_commits_ibfk_1` (`board_index`),
  CONSTRAINT `boards_commits_ibfk_1` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `boards_commits_ibfk_2` FOREIGN KEY (`commit_index`) REFERENCES `commits` (`commit_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boards_commits`
--

LOCK TABLES `boards_commits` WRITE;
/*!40000 ALTER TABLE `boards_commits` DISABLE KEYS */;
/*!40000 ALTER TABLE `boards_commits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boards_genres`
--

DROP TABLE IF EXISTS `boards_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boards_genres` (
  `board_index` int NOT NULL,
  `genre_code` int NOT NULL,
  PRIMARY KEY (`board_index`,`genre_code`),
  KEY `board_genre_ibfk_1` (`genre_code`),
  CONSTRAINT `boards_genres_ibfk_1` FOREIGN KEY (`genre_code`) REFERENCES `genres` (`genre_code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `boards_genres_ibfk_2` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boards_genres`
--

LOCK TABLES `boards_genres` WRITE;
/*!40000 ALTER TABLE `boards_genres` DISABLE KEYS */;
/*!40000 ALTER TABLE `boards_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boards_up_down`
--

DROP TABLE IF EXISTS `boards_up_down`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boards_up_down` (
  `email` varchar(50) NOT NULL,
  `board_index` int NOT NULL,
  `check_up_down` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`,`board_index`,`check_up_down`),
  KEY `board_up_down_ibfk_2` (`board_index`),
  CONSTRAINT `boards_up_down_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `boards_up_down_ibfk_2` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boards_up_down`
--

LOCK TABLES `boards_up_down` WRITE;
/*!40000 ALTER TABLE `boards_up_down` DISABLE KEYS */;
/*!40000 ALTER TABLE `boards_up_down` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_index` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `up_count` int DEFAULT NULL,
  `down_count` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`comment_index`,`email`),
  KEY `comment_ibfk_1` (`email`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments_up_down`
--

DROP TABLE IF EXISTS `comments_up_down`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments_up_down` (
  `email` varchar(50) NOT NULL,
  `check_up_down` tinyint(1) NOT NULL,
  `comment_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`,`check_up_down`,`comment_index`),
  KEY `comment_up_down_ibfk_2` (`comment_index`),
  CONSTRAINT `comments_up_down_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_up_down_ibfk_2` FOREIGN KEY (`comment_index`) REFERENCES `comments` (`comment_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

—
— Dumping data for table `comments_up_down`
—