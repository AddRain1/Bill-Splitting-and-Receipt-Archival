CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `first_name` varchar(64) NOT NULL,
  `last_name` varchar(64) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(124) NOT NULL,
  `profile_description` varchar(124) NOT NULL,
  `creation_date` DATE NOT NULL,
  PRIMARY KEY (`user_id`)
); 