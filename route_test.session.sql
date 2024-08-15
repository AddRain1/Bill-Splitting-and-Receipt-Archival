-- @block   
CREATE TABLE users (
  user_id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(20) NOT NULL,
  first_name varchar(64) NOT NULL,
  last_name varchar(64) NOT NULL,
  email varchar(254) NOT NULL,
  password varchar(124) NOT NULL,
  profile_description varchar(124) NOT NULL,
  creation_date DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`user_id`)
); 

-- @block   
INSERT INTO users(username, first_name, last_name, email, password, profile_description)
VALUES('user1', 'bob', 'bobbyson', 'bob.bobbyson@gmail.com', 'password', 'wassup');

-- @block   
SELECT * from users 

-- @block   
delete from users

-- @block
DROP TABLE users