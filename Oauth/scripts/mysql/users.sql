CREATE DATABASE  IF NOT EXISTS `phoenixOauth` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `phoenixOauth`;

CREATE TABLE `users` (
  `client_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `user_name` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `photo_id` bigint(20) DEFAULT NULL,
  `password` char(30) NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`),
  KEY `idx_updated_at` (`updated_at`),
  KEY `mobile` (`mobile`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
