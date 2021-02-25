LOCK TABLES `comments_up_down` WRITE;
/*!40000 ALTER TABLE `comments_up_down` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments_up_down` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commits`
--

DROP TABLE IF EXISTS `commits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commits` (
  `commit_index` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `content` text,
  `up_count` int DEFAULT NULL,
  `down_count` int DEFAULT NULL,
  `visit_count` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`commit_index`,`email`),
  KEY `commits_ibfk_1` (`email`),
  CONSTRAINT `commits_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commits`
--

LOCK TABLES `commits` WRITE;
/*!40000 ALTER TABLE `commits` DISABLE KEYS */;
/*!40000 ALTER TABLE `commits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commits_comments`
--

DROP TABLE IF EXISTS `commits_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commits_comments` (
  `commit_index` int NOT NULL,
  `comment_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`commit_index`,`comment_index`),
  KEY `commit_comments_ibfk_2` (`comment_index`),
  CONSTRAINT `commits_comments_ibfk_1` FOREIGN KEY (`commit_index`) REFERENCES `commits` (`commit_index`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commits_comments_ibfk_2` FOREIGN KEY (`comment_index`) REFERENCES `comments` (`comment_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commits_comments`
--

LOCK TABLES `commits_comments` WRITE;
/*!40000 ALTER TABLE `commits_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `commits_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commits_options`
--

DROP TABLE IF EXISTS `commits_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commits_options` (
  `board_index` int NOT NULL,
  `option_name` varchar(255) DEFAULT NULL,
  `min_length` int DEFAULT NULL,
  `max_length` int DEFAULT NULL,
  `etc` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`board_index`),
  CONSTRAINT `commits_options_ibfk_1` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commits_options`
--

LOCK TABLES `commits_options` WRITE;
/*!40000 ALTER TABLE `commits_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `commits_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commits_up_down`
--

DROP TABLE IF EXISTS `commits_up_down`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commits_up_down` (
  `commit_index` int NOT NULL,
  `email` varchar(50) NOT NULL,
  `check_up_down` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`commit_index`,`email`,`check_up_down`),
  KEY `commit_up_down_ibfk_1` (`email`),
  CONSTRAINT `commits_up_down_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commits_up_down_ibfk_2` FOREIGN KEY (`commit_index`) REFERENCES `commits` (`commit_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commits_up_down`
--

LOCK TABLES `commits_up_down` WRITE;
/*!40000 ALTER TABLE `commits_up_down` DISABLE KEYS */;
/*!40000 ALTER TABLE `commits_up_down` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `genre_code` int NOT NULL AUTO_INCREMENT,
  `genre_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`genre_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `email` varchar(50) NOT NULL,
  `password` varchar(30) DEFAULT NULL,
  `user_name` varchar(10) DEFAULT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_boards_favorites`
--

DROP TABLE IF EXISTS `users_boards_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_boards_favorites` (
  `email` varchar(50) NOT NULL,
  `board_index` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`,`board_index`),
  KEY `user_board_favorite_ibfk_2` (`board_index`),
  CONSTRAINT `users_boards_favorites_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_boards_favorites_ibfk_2` FOREIGN KEY (`board_index`) REFERENCES `boards` (`board_index`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_boards_favorites`
--

LOCK TABLES `users_boards_favorites` WRITE;
/*!40000 ALTER TABLE `users_boards_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_boards_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'story_hub'
--

--
-- Dumping routines for database 'story_hub'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-24 18:21:55
