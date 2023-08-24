CREATE TABLE `Account` (
  `public_key` varchar(56) NOT NULL,
  `balance` decimal(19,7) DEFAULT NULL,
  `Role` text,
  `Username` text,
  `lock` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`public_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `asset` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `public_key` varchar(56) NOT NULL,
  `asset_code` varchar(12) NOT NULL,
  `asset_issuer` varchar(56) NOT NULL,
  `balance` decimal(19,7) DEFAULT '0.0000000',
  `created_at` datetime NOT NULL,
  `removed` tinyint DEFAULT '0',
  `removed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `block` (
  `id` int NOT NULL,
  `success` int NOT NULL,
  `fail` int NOT NULL,
  `operation` int NOT NULL,
  `total` decimal(19,7) NOT NULL,
  `fee_pool` decimal(19,7) NOT NULL,
  `created_at` datetime NOT NULL,
  `spend` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `claimant` (
  `id` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `amount` decimal(19,7) DEFAULT NULL,
  `account` varchar(56) DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '0',
  `lock_time` int DEFAULT NULL,
  `unlock_time` datetime DEFAULT NULL,
  `claimed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `fee` (
  `id` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `account` varchar(56) DEFAULT NULL,
  `amount` decimal(19,7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `operation` (
  `id` varchar(50) NOT NULL,
  `type_i` tinyint NOT NULL,
  `account` varchar(56) DEFAULT NULL,
  `amount` decimal(19,7) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
