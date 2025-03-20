-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: basebraindb
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `correction_models`
--

DROP TABLE IF EXISTS `correction_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `correction_models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `correction_id` int(11) NOT NULL,
  `file_url` text NOT NULL,
  `model_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `configuration` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `correction_id` (`correction_id`),
  CONSTRAINT `correction_models_ibfk_1` FOREIGN KEY (`correction_id`) REFERENCES `corrections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `correction_models`
--

LOCK TABLES `correction_models` WRITE;
/*!40000 ALTER TABLE `correction_models` DISABLE KEYS */;
INSERT INTO `correction_models` VALUES (1,15,'http://localhost:9000/base-brain-bucket/corrections/1742175140015-871175921.pdf','default-model',NULL,'{}','2025-03-17 01:32:20'),(2,16,'http://localhost:9000/base-brain-bucket/corrections/1742379724674-69817780.pdf','default-model',NULL,'{}','2025-03-19 10:22:04');
/*!40000 ALTER TABLE `correction_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `corrections`
--

DROP TABLE IF EXISTS `corrections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `corrections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exercise_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `file_path` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `correction_model` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `corrections_ibfk_1` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corrections`
--

LOCK TABLES `corrections` WRITE;
/*!40000 ALTER TABLE `corrections` DISABLE KEYS */;
INSERT INTO `corrections` VALUES (1,1,'Exo','correctionexo1','uploads\\1741887250005-263063753.pdf','2025-03-13 17:34:10','2025-03-13 17:34:10',NULL),(2,1,'Exo','correctionexo1','uploads\\1741887281554-6390733.pdf','2025-03-13 17:34:41','2025-03-13 17:34:41',NULL),(3,1,'Exo','correctionexo1','uploads\\1741887637431-688991652.pdf','2025-03-13 17:40:37','2025-03-13 17:40:37',NULL),(4,1,'Exo','correctionexo1','uploads\\1741887996054-798917898.pdf','2025-03-13 17:46:36','2025-03-13 17:46:36','1. Trouver les livres empruntés mais non encore retournés\nSELECT * FROM EMPRUNTS WHERE date_retour IS NULL;\n2. Lister les utilisateurs ayant emprunté un livre spécifique\nSELECT DISTINCT id_utilisateur\nFROM EMPRUNTS\nWHERE id_livre = (SELECT id FROM LIVRES WHERE titre = \'Titre_Livre\');\n3. Trouver le nombre d’emprunts effectués par chaque utilisateur\nSELECT id_utilisateur, COUNT(*) AS nombre_emprunts\nFROM EMPRUNTS\nGROUP BY id_utilisateur;\n4. Sélectionner les livres publiés après l’année 2000 et jamais empruntés\nSELECT * FROM LIVRES\nWHERE annee_publication > 2000\nAND id NOT IN (SELECT id_livre FROM EMPRUNTS);'),(5,1,'Exo','correction2exo1','uploads\\1741888038106-329990684.pdf','2025-03-13 17:47:18','2025-03-13 17:47:18','1. Trouver les livres empruntés mais non encore retournés\nSELECT e.*\nFROM EMPRUNTS e\nLEFT JOIN LIVRES l ON e.id_livre = l.id\nWHERE e.date_retour IS NULL;\n2. Lister les utilisateurs ayant emprunté un livre spécifique\nSELECT DISTINCT u.id\nFROM UTILISATEURS u\nJOIN EMPRUNTS e ON u.id = e.id_utilisateur\nWHERE e.id_livre = (SELECT id FROM LIVRES WHERE titre = \'Titre_Livre\');\n3. Trouver le nombre d’emprunts effectués par chaque utilisateur\nSELECT id_utilisateur, COUNT(id_livre) AS total_emprunts\nFROM EMPRUNTS\nGROUP BY id_utilisateur;\n4. Sélectionner les livres publiés après l’année 2000 et jamais empruntés\nSELECT * FROM LIVRES\nWHERE annee_publication > 2000'),(6,1,'Exo','correction2exo1','uploads\\1741950838320-795037829.pdf','2025-03-14 11:13:58','2025-03-14 11:13:58','1. Trouver les livres empruntés mais non encore retournés\nSELECT e.*\nFROM EMPRUNTS e\nLEFT JOIN LIVRES l ON e.id_livre = l.id\nWHERE e.date_retour IS NULL;\n2. Lister les utilisateurs ayant emprunté un livre spécifique\nSELECT DISTINCT u.id\nFROM UTILISATEURS u\nJOIN EMPRUNTS e ON u.id = e.id_utilisateur\nWHERE e.id_livre = (SELECT id FROM LIVRES WHERE titre = \'Titre_Livre\');\n3. Trouver le nombre d’emprunts effectués par chaque utilisateur\nSELECT id_utilisateur, COUNT(id_livre) AS total_emprunts\nFROM EMPRUNTS\nGROUP BY id_utilisateur;\n4. Sélectionner les livres publiés après l’année 2000 et jamais empruntés\nSELECT * FROM LIVRES\nWHERE annee_publication > 2000'),(7,3,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742137182645-186898002.pdf\"]','2025-03-16 14:59:42','2025-03-16 14:59:42',NULL),(8,3,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742137761436-85955275.pdf\"]','2025-03-16 15:09:21','2025-03-16 15:09:21',NULL),(9,3,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742137824825-487312473.pdf\"]','2025-03-16 15:10:24','2025-03-16 15:10:24',NULL),(10,3,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742138313840-432345737.pdf\"]','2025-03-16 15:18:33','2025-03-16 15:18:33',NULL),(11,3,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742138382434-65043619.pdf\"]','2025-03-16 15:19:42','2025-03-16 15:19:42',NULL),(12,3,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742138394442-454238751.pdf\"]','2025-03-16 15:19:54','2025-03-16 15:19:54',NULL),(13,3,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742138613273-996058959.pdf\"]','2025-03-16 15:23:33','2025-03-16 15:23:33','1. Trouver les livres empruntés mais non encore retournés\nSELECT * FROM EMPRUNTS WHERE date_retour IS NULL;\n2. Lister les utilisateurs ayant emprunté un livre spécifique\nSELECT DISTINCT id_utilisateur\nFROM EMPRUNTS\nWHERE id_livre = (SELECT id FROM LIVRES WHERE titre = \'Titre_Livre\');\n3. Trouver le nombre d’emprunts effectués par chaque utilisateur\nSELECT id_utilisateur, COUNT(*) AS nombre_emprunts\nFROM EMPRUNTS\nGROUP BY id_utilisateur;\n4. Sélectionner les livres publiés après l’année 2000 et jamais empruntés\nSELECT * FROM LIVRES\nWHERE annee_publication > 2000\nAND id NOT IN (SELECT id_livre FROM EMPRUNTS);'),(14,5,'Exercice2','description2','[\"http://localhost:9000/base-brain-bucket/corrections/1742139038992-628312645.pdf\"]','2025-03-16 15:30:39','2025-03-16 15:30:39','1. Trouver les livres empruntés mais non encore retournés\nSELECT * FROM EMPRUNTS WHERE date_retour IS NULL;\n2. Lister les utilisateurs ayant emprunté un livre spécifique\nSELECT DISTINCT id_utilisateur\nFROM EMPRUNTS\nWHERE id_livre = (SELECT id FROM LIVRES WHERE titre = \'Titre_Livre\');\n3. Trouver le nombre d’emprunts effectués par chaque utilisateur\nSELECT id_utilisateur, COUNT(*) AS nombre_emprunts\nFROM EMPRUNTS\nGROUP BY id_utilisateur;\n4. Sélectionner les livres publiés après l’année 2000 et jamais empruntés\nSELECT * FROM LIVRES\nWHERE annee_publication > 2000\nAND id NOT IN (SELECT id_livre FROM EMPRUNTS);'),(15,6,'correctionExercice3','correctionexo3','[\"http://localhost:9000/base-brain-bucket/corrections/1742175140015-871175921.pdf\"]','2025-03-17 01:32:20','2025-03-17 01:32:20','1. Trouver les livres empruntés mais non encore retournés\nSELECT e.*\nFROM EMPRUNTS e\nLEFT JOIN LIVRES l ON e.id_livre = l.id\nWHERE e.date_retour IS NULL;\n2. Lister les utilisateurs ayant emprunté un livre spécifique\nSELECT DISTINCT u.id\nFROM UTILISATEURS u\nJOIN EMPRUNTS e ON u.id = e.id_utilisateur\nWHERE e.id_livre = (SELECT id FROM LIVRES WHERE titre = \'Titre_Livre\');\n3. Trouver le nombre d’emprunts effectués par chaque utilisateur\nSELECT id_utilisateur, COUNT(id_livre) AS total_emprunts\nFROM EMPRUNTS\nGROUP BY id_utilisateur;\n4. Sélectionner les livres publiés après l’année 2000 et jamais empruntés\nSELECT * FROM LIVRES\nWHERE annee_publication > 2000'),(16,6,'Test 19','Test 19','[\"http://localhost:9000/base-brain-bucket/corrections/1742379724674-69817780.pdf\"]','2025-03-19 10:22:04','2025-03-19 10:22:05','1. Trouver les livres empruntés mais non encore retournés\nSELECT * FROM EMPRUNTS WHERE date_retour IS NULL;\n2. Lister les utilisateurs ayant emprunté un livre spécifique\nSELECT DISTINCT id_utilisateur\nFROM EMPRUNTS\nWHERE id_livre = (SELECT id FROM LIVRES WHERE titre = \'Titre_Livre\');\n3. Trouver le nombre d’emprunts effectués par chaque utilisateur\nSELECT id_utilisateur, COUNT(*) AS nombre_emprunts\nFROM EMPRUNTS\nGROUP BY id_utilisateur;\n4. Sélectionner les livres publiés après l’année 2000 et jamais empruntés\nSELECT * FROM LIVRES\nWHERE annee_publication > 2000\nAND id NOT IN (SELECT id_livre FROM EMPRUNTS);');
/*!40000 ALTER TABLE `corrections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exercises` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `professor_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_exercises_professor` (`professor_id`),
  CONSTRAINT `fk_exercises_professor` FOREIGN KEY (`professor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (1,1,'Exercice1','uploads\\1741735292475-230014214.pdf','Descriotion exercice1','2025-03-11 23:21:32'),(3,1,'Exercice2','http://localhost:9000/base-brain-bucket/exercises/1742134107693-493191988.pdf','description2','2025-03-16 14:08:27'),(4,1,'Exercice2','http://localhost:9000/base-brain-bucket/exercises/1742135262740-965034143.pdf','description2','2025-03-16 14:27:42'),(5,1,'Exercice2','http://localhost:9000/base-brain-bucket/exercises/1742135925520-70521158.pdf','description2','2025-03-16 14:38:45'),(6,1,'Exercice3','http://localhost:9000/base-brain-bucket/exercises/1742174462382-613632833.pdf','exo3','2025-03-17 01:21:02');
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `exercise_id` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `note` float DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','evaluated','adjusted') NOT NULL DEFAULT 'pending',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `encryption_key` varchar(255) DEFAULT NULL,
  `encryption_iv` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `idx_submissions_submitted_at` (`submitted_at`),
  KEY `idx_submissions_id` (`id`),
  KEY `idx_submissions_exercise_student` (`exercise_id`,`student_id`),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (1,2,1,'uploads\\1741889542420-170130093.pdf',NULL,NULL,'2025-03-13 18:12:22','pending','2025-03-13 18:12:22',NULL,NULL),(2,2,1,'uploads\\1741889743103-344392549.pdf',8.13,'\"{\\\"question1\\\":{\\\"grade\\\":15,\\\"feedback\\\":\\\"La requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres, ce qui peut être inefficace. Ajoutez \'WHERE auteur = \\\\\\\"\'Nom_Auteur\\\\\\\"\\\"},\\\"question2\\\":{\\\"grade\\\":10,\\\"feedback\\\":\\\"La requête semble fonctionner correctement. Toutefois elle manque une clause WHERE qui filtre le resultat selon l\'auteur de livre spécifique et ne retourne pas tous les emprunts d\'un auteur donné.\\\"},\\\"question3\\\":{\\\"grade\\\":3.5091467822,\\\"feedback\\\":\\\"La requête nécessite une clause WHERE pouvant filtrer le nombre d\'emprunts par utilisateur\\\"},\\\"question4\\\":{\\\"grade\\\":4,\\\"feedback\\\":\\\"\'SELECT id_utilisateur, COUNT(id_livre) FROM EMPRUNTS;\' nécessite une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres.\\\"}}\"','2025-03-13 18:15:43','pending','2025-03-13 18:17:30',NULL,NULL),(3,2,1,'uploads\\1741890549595-180354160.pdf',15,'\"{\\\"question1\\\":{\\\"grade\\\":15,\\\"feedback\\\":\\\"La requête n’a pas résultat spécifiquement pour ce filtre. Envoyez une nouvelle demande avec des paramètres supplémentaires ou élargissez la question.\\\"},\\\"question2\\\":{\\\"grade\\\":15,\\\"feedback\\\":\\\"La requête nécessite une clause WHERE pour limiter le résultat. Il ne fournit pas de livres spécifiques données dans la question.\\\"},\\\"question3\\\":{\\\"grade\\\":15,\\\"feedback\\\":\\\"La requête nécessite une clause WHERE pour filtrer le résultat. Sans cela elle retourne tous les livres de l\'auteur spécifiée.\\\"},\\\"question4\\\":{\\\"grade\\\":15,\\\"feedback\\\":\\\"\\\\nLa requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres publiées après l\'année 2000 et jamais empruntés.\\\\nexemple: SELECT * FROM LIVRES WHERE annee_publication > 2000 AND id NOT IN (SELECT id_livre from EMPRUNTS) \\\\nAjoutez \'WHERE auteur = \'\'Nom_Auteur\'\'\' pour filtrer les livres d\'un certain auteur.\\\"}}\"','2025-03-13 18:29:09','pending','2025-03-13 18:31:19',NULL,NULL),(4,2,1,'http://localhost:9000/base-brain-bucket/1742147150787-823544399.pdf.enc',0,'Erreur lors de la correction automatique : ENOENT: no such file or directory, open \'C:\\Users\\USER\\Documents\\M1-GLSI\\Semestre1\\SGBD AVANCE\\Projet_SGBD\\BaseBrain-Backend\\http:\\localhost:9000\\base-brain-bucket\\1742147150787-823544399.pdf.enc\'. Veuillez réessayer ou contacter l’administrateur.','2025-03-16 17:45:51','','2025-03-16 17:45:51',NULL,NULL),(8,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742154480964-937138228.pdf.enc',0,'{\"error\":\"Erreur lors de la correction : The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received null\"}','2025-03-16 19:48:01','','2025-03-16 19:48:01',NULL,NULL),(9,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742154568750-838879898.pdf.enc',15,'{\"question1\":{\"grade\":15,\"feedback\":\"La requête manque une clause WHERE pour filtrer le résultat des livres emprunté. Sans cela elle retourne tous les livres.\"},\"question2\":{\"grade\":15,\"feedback\":\"\'Titre du livre\', la clause WHERE n\'est pas utilisée correctement. Vous devez ajouter \'WHERE id_livre = (SELECT id FROM LIVRES WHERE titre=\\\"titre\\\")\'\"},\"question3\":{\"grade\":15,\"feedback\":\"La requête manque une clause WHERE pour filtrer les résultats de l’utilisateur. Sans cela, elle retourne tous les livres d\'un auteur spécifique.\"},\"question4\":{\"grade\":15,\"feedback\":\"La requête nécessite une clause WHERE pour filtrer le résultat. Sans cela, elle retourne tous les livres publics après l\'année 2000 et qui ne sont jamais empruntés.\"}}','2025-03-16 19:49:29','','2025-03-16 19:50:57','c3cd2f60b54fca002b8a18106ea15cca32ffb936f2406ab37db84aa17102d0d1','75859644d9f7ce6bed19f34dae22d2dc'),(10,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742161441232-551702626.pdf.enc',13.75,'Question 1: La requête nécessite une clause WHERE pour filtrer le résultat. Sans cela, elle retourne tous les livres de l\'auteur spécifié. Question 2: La requête manque une clause WHERE pour filtrer les résultats spécifiquement sur l’auteur. Par exemple : SELECT DISTINCT id_utilisateur FROM EMPRUNTS WHERE date_retour != NULL AND auteur = \'Nom Auteur\'. Question 3: Aucune évaluation détaillée fournie par l’IA. Question 4: La requête nécessite une clause WHERE pour filtrer les résultats. Ajoutez \'WHERE auteur = \'\'Nom_Auteur\'\'\'.','2025-03-16 21:44:01','','2025-03-16 21:45:57','17ad387e2281470c77c2c787f69546006d24ee4f327486fe5c227c28b71d724d','2d7343f945996ea3e781e12cc5769d06'),(11,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742163591427-912899735.pdf.enc',0,'Erreur lors de la correction automatique : Réponse incomplète de l’IA. Vérifiez Ollama.. Veuillez réessayer ou contacter l’administrateur.','2025-03-16 22:19:51','','2025-03-16 22:20:37','dbf565390e979d3b1e710c2907f6fa3e2251d81a11d33fb522cc9c59da9b18ac','437ed77dcd07cbcebad8e431de176b4a'),(12,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742164207002-560321667.pdf.enc',13,'Question 1: La requête nécessite une clause WHERE pour filtrer les résultats. Sans cela elle retourne tous livres d\'un auteur spécifique. Question 2: Aucune évaluation détaillée fournie par l’IA. Question 3: La requête semble fonctionner correctement mais nécessite une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres. Question 4: La requête n\'affiche pas de résultats car elle ne contient aucune clause WHERE pour filtrer les livres publiées après l’année 2000 et jamais empruntés.','2025-03-16 22:30:07','','2025-03-16 22:31:59','d133aa32c7a5401e159d6562d7fa594303a8e13affc184d5bfe7ecaea18d62d7','523d1db656365787ec06942ee90e5f63'),(13,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742167752032-690188987.pdf.enc',15,'Question 1: La requête nécessite une clause WHERE pour filtrer les résultats. Sans cela elle renvoie tous les livres d\'un auteur spécifique. Question 2: La requête manque une clause WHERE pour filtrer les résultats de l’étudiant. Sans cela, elle retourne tous les livres d’un utilisateur spécifique. Question 3: La requête manque une clause WHERE pour filtrer le résultat. Sans cela elle retourne tous les livres qui ont ‘Nom_Auteur’ comme auteur. Question 4: Aucune évaluation détaillée fournie par l’IA.','2025-03-16 23:29:12','','2025-03-16 23:30:51','92090c5383e8ce9de292a5ee603336bf4054348429a3159d5d456d49f66032b3','2a84be34fc72fe16fd7f4855bbd8edde'),(14,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742168328416-508865415.pdf.enc',13.75,'Question 1: Aucune évaluation détaillée fournie par l’IA. Question 2: Aucune évaluation détaillée fournie par l’IA. Question 3: Aucune évaluation détaillée fournie par l’IA. Question 4: Aucune évaluation détaillée fournie par l’IA.','2025-03-16 23:38:48','','2025-03-16 23:40:03','0ed7430f602444587b884743134ebd1083463b1fc2b7c1313e048f09edf4faeb','9cd7dd76a9a182f76d849bf610bcde0f'),(15,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742168674582-165888326.pdf.enc',14.5,'Question 1: La requête nécessite une clause WHERE pour filtrer les résultats. Lorsque cela ne se fait pas ou l\'on aura des livres empruntes mais non encore retournés (SELECT * FROM EMPRUNTS WHERE date_retour IS NULL), elle renvoie tous nos documents, ce qui n’est pas précis. Question 2: Aucune évaluation détaillée fournie par l’IA. Question 3: Aucune évaluation détaillée fournie par l’IA. Question 4: \'annee_publication >2000 AND id NOT IN (SELECT id_livre FROM EMPRUNTS)\' est mal orthographiée. La requête doit contenir une clause WHERE pour filtrer les résultats et sans cela, elle retourne tous les livres publiées après l\'année 2000.','2025-03-16 23:44:34','','2025-03-16 23:45:56','827217442486e36b13071f010327f4c6189f7e6ba1546e21d9dc327f459e926e','65d64026cd0aca5dc1af3ea9cf26b69f'),(16,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742168929267-748394090.pdf.enc',13.75,'Question 1: La requête semble avoir des problèmes de syntaxe ou d’écriture. Lorsqu\'elle n\'est pas précisée \'Nom_Auteur\', elle retourne tous les livres. Question 2: La requête nécessite une clause WHERE pour filtrer les résultats. Sans cela elle retourne tous les livres de l\'auteur spécifié. Question 3: Aucune évaluation détaillée fournie par l’IA. Question 4: La requête nécessite une clause WHERE pour filtrer les résultats. Sans cela elle retourne tous les livres et jamais empruntes.','2025-03-16 23:48:49','','2025-03-16 23:50:01','bda15ea080c219677e38ac85cb2f29f1dc4baf8e08765e7f7654e31ae97ad8c1','58fcbb157afac7b1c0c5036b34f7d660'),(17,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742169603205-386262915.pdf.enc',15,'Question 1: La requête semble avoir une erreur car elle ne contient pas la clause WHERE pour filtrer les résultats. Sans cela, il retourne tous les livres dont l\'auteur est \'Nom_Auteur\'. Ajoutez ‘WHERE auteur = \'\'Nom_Auteur\'\'’. Question 2: \'SELECT DISTINCT id_utilisateur FROM EMPRUNTS WHERE date_retour != NULL;\', cette requête n\'a pas de filtre spécifique. Question 3: Aucune évaluation détaillée fournie par l’IA. Question 4: La requête manque une clause WHERE pour filtrer le résultat des livres publié après l’année 2000 et qui n\'ont pas encore été empruntés. Ajoutez \'WHERE publication_annee > 2000 AND id NOT IN (SELECT id FROM EMPRUNTS)\'','2025-03-17 00:00:03','','2025-03-17 00:01:37','0a899bb19e41e0d94069e528b805b15c673444dd7bb210e31baba130c212de9e','dbd269b8d044db61a4c4dfae55082ecb'),(18,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742170268413-745890222.pdf.enc',17.5,'Question 1: La requête est correcte et respecte la condition fournie pour récupérer tous les livres d\'un auteur. Aucune erreurs spécifiques n’ont été évités, cela semble être le cas. Question 2: Aucune évaluation détaillée fournie par l’IA. Question 3: La requête semble échouer car elle nécessite une clause WHERE pour filtrer les résultats. L’id utilisateur doit être unique. Question 4: La requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres publiées après l\'année 2000 et jamais empruntés.','2025-03-17 00:11:08','','2025-03-17 00:12:32','70fe49033ec50422898549f2c4c71c5600023a107a6cf63dfb577d7df1cc2796','415ca4b02f6c0aa7bb19bb45b4ab54a3'),(19,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742170669307-871079807.pdf.enc',13.75,'Question 1: Aucune évaluation détaillée fournie par l’IA. Question 2: La requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres qui ont le même auteur comme \'Nom_Auteur\'. Question 3: La requête nécessite une clause WHERE pour filtrer les résultats. Il reste à utiliser \'GROUP BY\' afin d’obtenir le nombre de livres empruntés par chaque utilisateur. Question 4: La requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres publiées après l\'année 2000 et jamais empruntés.','2025-03-17 00:17:49','','2025-03-17 00:19:22','d4b227032b7dda8934bf732e889020ec853a5ff3e0406e27adb3be8e04d92203','70c0762fdf93b7dd7a3dcaee1519957f'),(20,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742171605079-379089071.pdf.enc',15,'Question 1: La requête nécessite une clause WHERE pour filtrer le résultat selon les critères spécifiés. C\'est-à-dire que la requête doit retourner uniquement les livres de l’auteur mentionné.\nQuestion 2: La requête nécessite une clause WHERE pour filtrer le résultat de la table LIVRES. Il est également possible qu\'il ne trouve pas d\'autres livre avec l\'id_livre spécifique.\nQuestion 3: La requête manque une clause WHERE pour filtrer les résultats de l’utilisateur. Sans cela elle retourne tous les livres d\'un auteur spécifique.\nQuestion 4: La requête n’a pas correctement utilisé la clause WHERE pour filtrer les résultats. Sans cela elle retourne tous les livres publiés après l\'année de 2000 et qui ne sont jamais empruntés.','2025-03-17 00:33:25','','2025-03-17 00:34:50','e8d5a631f2ee529ab493830010beefa65b15f309caff0de915f618388906c3b5','e6439f78dee921882f2bc6bd52563877'),(21,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742215150095-31695484.pdf.enc',0,'Erreur lors de la correction : Erreur lors de la récupération de la soumission : Bind parameters must not contain undefined. To pass SQL NULL specify JS null','2025-03-17 12:39:10','pending','2025-03-17 12:39:10','dfa7890179d1d5e1a7912060c010a2787f52227b2e414778973fc3aa58ea116e','0e26e4c6185ce0bd6d4b492747941e1d'),(22,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742215199553-175712714.pdf.enc',0,'Erreur lors de la correction : Erreur lors de la récupération de la soumission : Bind parameters must not contain undefined. To pass SQL NULL specify JS null','2025-03-17 12:39:59','pending','2025-03-17 12:39:59','c0f46004f8de35babf16320e1fdb349a83b84ee934fbc5770d99a8a1efea9ff4','d213eb20d10d33e74e00e466282b0a06'),(23,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742215861345-925452621.pdf.enc',0,'Erreur : Le traitement a pris trop de temps (timeout dépassé). Essayez de soumettre à nouveau ou utilisez un modèle plus rapide.','2025-03-17 12:51:01','evaluated','2025-03-17 12:54:19','f32c3f30fb2250bcbaaa51b2c709cf12077b3d1998e81fc2f9b62619624dfdb4','732de10897967723c5819f28223cb062'),(24,2,1,'http://localhost:9000/base-brain-bucket/submissions/1742218354321-259441615.pdf.enc',6,'null','2025-03-17 13:32:34','adjusted','2025-03-18 15:46:08','789be636fdfcd07a133347d117120912e6124305c4bf679393b56600042fa1ca','7dc58d7306835de8d6bf472d47c4c50b'),(25,4,1,'http://localhost:9000/base-brain-bucket/submissions/1742239336278-929910304.pdf.enc',13.75,'Question 1: La requête nécessite une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres de l\'auteur choisi.\nQuestion 2: La requête utilise une clause incorrecte pour filtrer des résultats. L’utilisateur doit inclure la condition WHERE auteur = \'Nom_Auteur\' dans sa requête.\nQuestion 3: La requête a une clause WHERE manquée pour filtrer le résultat de l’écran. Sans cela, elle retourne tous les livres en utilisant \'auteur\' comme critère.\nQuestion 4: \'SELECT id FROM EMPRUNTS;\', \'La clause WHERE est requise pour filtrer les résultats. Sans cela, elle retourne tous les livres.\'','2025-03-17 19:22:16','evaluated','2025-03-17 19:23:55','8b1441463ae7b58972888fe7b3ba8ddc97513c4a2892eb812b7cd1c51a1f14f7','3ca777e805d7a92b3cf792c7348a9404'),(26,4,6,'http://localhost:9000/base-brain-bucket/submissions/1742272023774-707167465.pdf.enc',13.75,'Question 1: \'auteur\', est obligatoire pour filtrer le résultat de la requête SQL. Ajoutez \'WHERE auteur =\'Nom_Auteur\'\' dans votre requête.\nQuestion 2: La requête manque une clause WHERE pour filtrer les résultats spécifiquement. Sans cela elle retourne tous les utilisateurs ayant emprunté un livre.\nQuestion 3: La requête manque une clause WHERE pour filtrer les résultats par utilisateur. Sans cela, elle retourne tous les livres d\'un auteur spécifique.\nQuestion 4: La requête nécessite une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres publiés après 2000 et jamais empruntés.','2025-03-18 04:27:03','evaluated','2025-03-18 04:29:27','dd63afda4c52a87b4507763348a2a50a33d18e7b0d2998465c7e1f73cab676c3','7ba0ffb9fb42e75878cca3c802c52e55'),(27,4,1,'http://localhost:9000/base-brain-bucket/submissions/1742272197165-416881770.pdf.enc',15,'Question 1: \'auteur\', \'autre champ(s) où la clause WHERE nécessite une valeur sont présents dans les résultats de la requête. Ajoutez-vous le fait que cela doit être déjà fait.\nQuestion 2: La requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres d\'un auteur spécifique.\nQuestion 3: La requête manque une clause WHERE pour filtrer les résultats effectués par chaque utilisateur. Sans cela elle retourne tous les livres de l\'auteur spécifiée.\nQuestion 4: La requête manque une clause WHERE pour filtrer le résultat. Sans cela, elle retourne tous les livres avec la condition \'annee_publication > 2000\'.','2025-03-18 04:29:57','evaluated','2025-03-18 04:31:43','aba58db39dc3d938e4f03a1aefde2ea70e7b2886a7089d2e0f23b5f1ac2eb218','5bbea090fb9448ce12b558912625ad04'),(28,4,6,'http://localhost:9000/base-brain-bucket/submissions/1742287267572-364335884.pdf.enc',15,'Question 1: La requête nécessite une clause WHERE pour filtrer résultats. L’autre point est quelle que soit la valeur de \'Nom_Auteur\', le livres empruntes sont uniquement ceux qui ne sont pas encore retournés.\nQuestion 2: La requête manque une clause WHERE pour filtrer les résultats de la table EMPRUNTS. Cela ne sélectionne pas tous les livres ayant été empruntés par l\'utilisateur spécifiée.\nQuestion 3: La requête manque une clause WHERE pour filtrer la sélection des résultats. Sans cela elle retourne tous les livres enregistrements de l\'utilisateur avec le titre \'Titre_Livre\'. Ajoutez ‘WHERE auteur = \'\'Nom_Auteur\'\'’.\nQuestion 4: La requête ne fait pas assez d’attention à l\'écran des livres publiés après 2000. Lorsqu\'on considère que tous les livres sont écrits avant le début de la série ou une année spécifique, cela ne serait pas juste un nombre insuffisant d’utilisations.','2025-03-18 08:41:07','evaluated','2025-03-18 08:43:42','771bf56070d6794ed3621a81ba17b60be439ff6625ce7a01ef01628aaa6c494b','e4eb3b8bcbb795cb72a9abbe0f7b22bb'),(29,2,5,'http://localhost:9000/base-brain-bucket/submissions/1742308496321-743726396.pdf.enc',15,'Question 1: La requête nécessite une clause WHERE pour filtrer le résultat. Sans cela, elle retourne tous les livres de l\'auteur \'Nom_Auteur\'. Ajoutez ‘WHERE auteur = \'\'Nom_Auteur\'\'’.\nQuestion 2: La requête nécessite une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les emprunts liés à ce livre.\nQuestion 3: La requête manque une clause WHERE pour filtrer les résultats en fonction de l’auteur. Ajoutez \'WHERE auteur =\'Nom_Auteur\'\'.\nQuestion 4: \'SELECT id_utilisateur, COUNT(id_livre) FROM EMPRUNTS; \'La requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres empruntées.','2025-03-18 14:34:56','evaluated','2025-03-18 14:37:01','533bcdbe4504d4a2c44321e164703e46acf5848c4fc6fa8aab20fa157bd0f902','e277fcb1e70b100249ca9915332171a9'),(30,2,5,'http://localhost:9000/base-brain-bucket/submissions/1742394490575-369983970.pdf.enc',10.75,'Question 1: La requête a une erreur de syntaxe, elle fait référence à la table \'EMPRUNTS\' mais celle-ci ne contient pas les colonnes nécessaires (dans notre cas le champ date_retour). Ajoutez ‘WHERE auteur = \'\'Nom Auteur\'\'’ pour filtrer votre résultat.\nQuestion 2: La requête manque une clause WHERE pour filtrer les résultats spécifiquement. Sans cela elle retourne tous livres de l\'auteur indiquée.\nQuestion 3: La requête semble avoir une erreur de syntaxe dans la clause WHERE utilisée pour filtrer les résultats. Sans cela, elle retourne tous les livres.\nQuestion 4: \'SELECT id FROM EMPRUNTS\'','2025-03-19 14:28:10','evaluated','2025-03-19 14:29:33','f248329fcb702bce6d4f9476b80857d5aa734ffd0d6c5df0c29138d8d08450f9','95064c0c10d2201cb545cf2a6880927f'),(31,2,3,'http://localhost:9000/base-brain-bucket/submissions/1742397682788-82628261.pdf.enc',13.75,'Question 1: Aucune évaluation détaillée fournie par l’IA.\nQuestion 2: La requête semble avoir un problème de syntaxe car elle n’utilise pas le mot clé WHERE pour filtrer les résultats. Il doit être écrit comme suit : SELECT DISTINCT id_user FROM EMPRUNTS INNER JOIN LIVRES ON ID = ISBN; Sans cela, tous les utilisateurs ayant emprunté un livre spécifique seront récupérés.\nQuestion 3: La requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres du Livre ‘Titre_Livre’ de l\'auteur \'Nom_Auteur\'. Ajoutez \'WHERE id = 1234567890 AND auteur = Nom_Auteur\'\nQuestion 4: \'SELECT id_utilisateur FROM EMPRUNTS;\', la clause WHERE n’existe pas. Doit être ajoutée pour filtrer les résultats.','2025-03-19 15:21:22','evaluated','2025-03-19 15:23:30','7dc4b3b6e6d671a9eff8b5f72ab6dc005dfc1914f516a26cf5221c049083187f','0aef0c1ffe79d99978ff60b6002aa0cd'),(32,2,6,'http://localhost:9000/base-brain-bucket/submissions/1742405324758-414832674.pdf.enc',8,'null','2025-03-19 17:28:44','adjusted','2025-03-19 18:01:30','aa5b47674917151cc788a07c819280903b332b6c11498979acb085ec51baeb87','a0cf65f119f6e661e9a7db3eae76f6ad'),(33,2,5,'http://localhost:9000/base-brain-bucket/submissions/1742417594335-249136406.pdf.enc',0,'Erreur lors de la correction automatique : Réponse incomplète de l’IA. Vérifiez Ollama.. Veuillez réessayer ou contacter l’administrateur.','2025-03-19 20:53:14','evaluated','2025-03-19 20:53:59','5d6f7045a7fdd23a862b1795c96094402e19f9c10fa5a3e27aaf59a2c08bf9c6','9407f4b7e3a7522811e05a70933ea510'),(34,2,6,'http://localhost:9000/base-brain-bucket/submissions/1742421616815-848179434.pdf.enc',16.25,'Question 1: La requête nécessite une clause WHERE pour filtrer sur l’auteur. Cependant la question demande des livres empruntés mais non encore retournés.\nQuestion 2: Aucune évaluation détaillée fournie par l’IA.\nQuestion 3: La requête semble correcte et répond aux besoins de l’étudiant. Le code SQL est structuré précisement pour la question posée.\nQuestion 4: \nLa requête manque une clause WHERE pour filtrer les résultats. Sans cela, elle retourne tous les livres publiées après l’année 2000.','2025-03-19 22:00:16','evaluated','2025-03-19 22:02:54','fd751529d81cbcff1d821d445749de64eac979a8868a15267bea36aaf0aebcc4','28facb17de60711e8625abd36fd52566');
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('professor','student','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `provider` varchar(50) DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `sexe` enum('M','F') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'professor@example.com','$2b$10$ZqoXhdoV53VkeeOy4QgKhuxgf4vCt0Vp7EzN.vJHK4zz4FAldNF8W','professor','2025-03-11 19:36:55',NULL,NULL,NULL,NULL,NULL,NULL),(2,'yacine@esp.sn','$2b$10$sedD3.LIq.EQLO7reKNMy.U62BNkqmiorfR6lOWSxnC1bZGkG5bv6','student','2025-03-11 23:41:02',NULL,NULL,NULL,NULL,NULL,NULL),(3,'mariama@esp.sn','$2b$10$vGn1EIqY8gFqcEna7RHlb.K5Dp27dkGOmgpZedmi.LbsASi1zYQ76','professor','2025-03-17 19:18:01',NULL,NULL,'DIOUM','Mariama','+33612345678','F'),(4,'kabyr@esp.sn','$2b$10$b151O9s1.Kwl129i0tTGveb4NkcMTv4ovqy2Z51bE.GG51H1JJIGa','student','2025-03-17 19:21:44',NULL,NULL,'NDIAYE','Kabyr','+33698765432','F'),(5,'admin@esp.sn','$2b$10$HYto/ocsViFriYTNkkYUBOPUVj00UixhZfVXhqniKmcE5sVHvc6Qm','admin','2025-03-17 19:48:58',NULL,NULL,'SUPER','Admin','+33612345678','F'),(6,'admin@gmail.sn','$2b$10$W0mj84SDo95MGdTWXbcczuQvCq41l5Ro6FvjXadScD5n/QhEPiQ0u','admin','2025-03-17 20:13:23',NULL,NULL,'SUPER','Admin','+33612345678','F'),(7,'fatima@esp.sn','$2b$10$HsCPfkQ19FvdH/K/wbE4.eiLiRNBu1KxmLFOdoqeQW9afsM9FFNcy','student','2025-03-18 03:11:33',NULL,NULL,'GUEYE','Fatima','123','F');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-20  2:39:31
