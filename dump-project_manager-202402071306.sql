  -- MySQL dump 10.13  Distrib 8.2.0, for macos12.6 (x86_64)
--
-- Host: localhost    Database: project_manager
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assigned`
--

DROP TABLE IF EXISTS `assigned`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned` (
  `assigned_id` int NOT NULL AUTO_INCREMENT,
  `subtask_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`assigned_id`),
  KEY `subtask_id` (`subtask_id`),
  KEY `employee_id` (`employee_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `assigned_ibfk_1` FOREIGN KEY (`subtask_id`) REFERENCES `subtask` (`subtask_id`),
  CONSTRAINT `assigned_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `assigned_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned`
--

LOCK TABLES `assigned` WRITE;
/*!40000 ALTER TABLE `assigned` DISABLE KEYS */;
/*!40000 ALTER TABLE `assigned` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_partner`
--

DROP TABLE IF EXISTS `client_partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_partner` (
  `client_partner_id` int NOT NULL AUTO_INCREMENT,
  `cp_name` varchar(255) DEFAULT NULL,
  `cp_address` varchar(255) DEFAULT NULL,
  `cp_details` text,
  PRIMARY KEY (`client_partner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_partner`
--

LOCK TABLES `client_partner` WRITE;
/*!40000 ALTER TABLE `client_partner` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(128) DEFAULT NULL,
  `employee_name` varchar(128) DEFAULT NULL,
  `user_account_id` int NOT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `user_account_id` (`user_account_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`user_account_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `on_project`
--

DROP TABLE IF EXISTS `on_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `on_project` (
  `on_project_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `client_partner_id` int DEFAULT NULL,
  `date_start` datetime DEFAULT NULL,
  `date_end` datetime NOT NULL,
  `is_client` tinyint(1) DEFAULT NULL,
  `is_partner` tinyint(1) DEFAULT NULL,
  `on_project_description` text,
  PRIMARY KEY (`on_project_id`),
  KEY `project_id` (`project_id`),
  KEY `client_partner_id` (`client_partner_id`),
  CONSTRAINT `on_project_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `on_project_ibfk_2` FOREIGN KEY (`client_partner_id`) REFERENCES `client_partner` (`client_partner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `on_project`
--

LOCK TABLES `on_project` WRITE;
/*!40000 ALTER TABLE `on_project` DISABLE KEYS */;
/*!40000 ALTER TABLE `on_project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(128) DEFAULT NULL,
  `project_start_date` datetime DEFAULT NULL,
  `project_end_date` datetime DEFAULT NULL,
  `actual_start_date` datetime NOT NULL,
  `actual_end_date` datetime NOT NULL,
  `project_description` text,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'Sample Project 1','2024-02-01 00:00:00','2024-02-28 00:00:00','2024-02-05 00:00:00','2024-02-25 00:00:00','This is a sample project description.'),(2,'Sample Project 2','2024-03-01 00:00:00','2024-03-31 00:00:00','2024-03-05 00:00:00','2024-03-30 00:00:00','Another sample project with a description.'),(3,'Sample Project 3','2024-04-01 00:00:00','2024-04-30 00:00:00','2024-04-10 00:00:00','2024-04-25 00:00:00','A third sample project description.');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_manager`
--

DROP TABLE IF EXISTS `project_manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_manager` (
  `project_manager_id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `user_account_id` int DEFAULT NULL,
  PRIMARY KEY (`project_manager_id`),
  KEY `project_id` (`project_id`),
  KEY `user_account_id` (`user_account_id`),
  CONSTRAINT `project_manager_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `project_manager_ibfk_2` FOREIGN KEY (`user_account_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_manager`
--

LOCK TABLES `project_manager` WRITE;
/*!40000 ALTER TABLE `project_manager` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subtask`
--

DROP TABLE IF EXISTS `subtask`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subtask` (
  `subtask_id` int NOT NULL AUTO_INCREMENT,
  `subtask_name` varchar(255) DEFAULT NULL,
  `task_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `Priority` enum('High','Medium','Low') DEFAULT NULL,
  `subtask_description` text,
  `planned_start_date` datetime DEFAULT NULL,
  `planned_end_date` datetime DEFAULT NULL,
  `planned_budget` decimal(8,2) DEFAULT NULL,
  `actual_start_time` datetime NOT NULL,
  `actual_end_time` datetime NOT NULL,
  `actual_budget` decimal(8,2) NOT NULL,
  `status` enum('Pending','On Hold','Completed','Work In Progress') DEFAULT 'Pending',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`subtask_id`),
  KEY `task_id` (`task_id`),
  KEY `FK_subtask_project` (`project_id`),
  CONSTRAINT `FK_subtask_project` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `subtask_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subtask`
--

LOCK TABLES `subtask` WRITE;
/*!40000 ALTER TABLE `subtask` DISABLE KEYS */;
INSERT INTO `subtask` VALUES (2,'Sample Subtask 1',4,1,'High','This is a sample subtask 1 description.','2024-02-05 00:00:00','2024-02-10 00:00:00',100.00,'2024-02-05 10:00:00','2024-02-05 15:00:00',800.00,'Completed',0),(3,'Sample Subtask 2',5,1,'High','This is a sample subtask 2 description.','2024-02-05 00:00:00','2024-02-10 00:00:00',1000.00,'2024-02-05 10:00:00','2024-02-05 15:00:00',800.00,'Completed',0);
/*!40000 ALTER TABLE `subtask` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `task_name` varchar(255) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `Priority` enum('High','Medium','Low') DEFAULT NULL,
  `task_description` text NOT NULL,
  `planned_start_date` datetime DEFAULT NULL,
  `planned_end_date` datetime DEFAULT NULL,
  `planned_budget` decimal(8,2) DEFAULT NULL,
  `actual_start_time` datetime NOT NULL,
  `actual_end_time` datetime NOT NULL,
  `actual_budget` decimal(8,2) NOT NULL,
  `status` enum('Pending','Work In Progress','On Hold','Completed') NOT NULL DEFAULT 'Pending',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`task_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `task_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (4,'Sample Task',1,'Low','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 08:00:00','2024-02-20 17:00:00',950.00,'Pending',0),(5,'Sample Task 2',1,'Low','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Pending',0),(6,'Sample Task 3',1,'High','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'On Hold',0),(7,'Sample Task 4',1,'Medium','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Work In Progress',0),(8,'Sample Task 5',1,'Low','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Work In Progress',0),(9,'Sample Task 6',1,'High','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Pending',0),(10,'Sample Task 7',1,'High','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Completed',0),(11,'Sample Task 8',1,'Medium','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Pending',0),(12,'Sample Task 8',1,'Medium','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Pending',0),(13,'Sample Task 9',1,'Medium','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Completed',0),(14,'Sample Task 20',2,'Low','This is a sample task description.','2024-02-10 00:00:00','2024-02-20 00:00:00',1000.00,'2024-02-10 00:00:00','2024-02-20 00:00:00',950.00,'Pending',0);
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `team_name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_member`
--

DROP TABLE IF EXISTS `team_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_member` (
  `team_member_id` int NOT NULL AUTO_INCREMENT,
  `team_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `role_id` int DEFAULT NULL,
  PRIMARY KEY (`team_member_id`),
  KEY `team_id` (`team_id`),
  KEY `employee_id` (`employee_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `team_member_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`),
  CONSTRAINT `team_member_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `team_member_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_member`
--

LOCK TABLES `team_member` WRITE;
/*!40000 ALTER TABLE `team_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `team_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(64) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `first_name` varchar(64) DEFAULT NULL,
  `last_name` varchar(64) DEFAULT NULL,
  `is_project_manager` tinyint(1) DEFAULT '0',
  `registration_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_type` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'prince','prince@gmail.com','$2a$10$YuQu0iCHY6NQKt2ICjbGPeZEBTUY.F6/raJuk4jmE26F2jaRIbA.K','prince','jain',0,'2024-01-31 17:16:10','Users'),(4,'adithya','adithya@gmail.com','$2a$10$x7bmdmQq32E4z9JZX5Vkgui3qK3pAfhC.3Qm7Q9jg66iU1A2pLPkS','adithya','nair',0,'2024-01-31 18:16:48','Admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'project_manager'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-07 13:06:01
