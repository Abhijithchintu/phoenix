CREATE DATABASE  IF NOT EXISTS `phoenixOauth` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `phoenixOauth`;

CREATE TABLE `clients` (
  `client_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `status` tinyint(2) NOT NULL DEFAULT 1,
  `client_name` varchar(32) NOT NULL,
  `description` varchar(32) NOT NULL,
  `key` char(64) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`client_id`),
  KEY `idx_updated_at` (`updated_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
