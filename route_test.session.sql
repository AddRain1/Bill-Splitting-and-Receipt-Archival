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

-- @block   
CREATE TABLE `group` (
  group_id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  name VARCHAR(64) NOT NULL,
  description VARCHAR(124) NOT NULL,
  creation_date DATE DEFAULT (CURRENT_DATE)
);

-- @block   
INSERT INTO `group`(admin_id, name, description)
VALUES('','','');

-- @block   
SELECT * from `group` 

-- @block   
delete from `group`

-- @block
DROP TABLE `group`

-- @block   
CREATE TABLE user_group (
  user_id INT NOT NULL,
  group_id INT NOT NULL,
  creation_date DATE DEFAULT (CURRENT_DATE)
);

-- @block   
INSERT INTO user_group(user_id, group_id)
VALUES('','');

-- @block   
SELECT * from user_group 

-- @block   
delete from user_group

-- @block
DROP TABLE user_group

-- @block   
CREATE TABLE payment_request (
  payment_request_id int(11) NOT NULL AUTO_INCREMENT,
  payer_id INT NOT NULL,
  receiver_id INT NOT NULL,
  pay_by DATE,
  paid_on DATE,
  amount INT NOT NULL,
  is_declined BOOLEAN NOT NULL, 
  description varchar(124) NOT NULL,
  receipt_id INT NOT NULL,
  creation_date DATE DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`payment_request_id`)
);

-- @block   
INSERT INTO payment_request(payer_id, receiver_id, pay_by, paid_on, amount, is_declined, description, receipt_id, payment_request_id)
VALUES('','', '','', '','', '','', '');

-- @block   
SELECT * FROM payment_request WHERE payer_id = 143 OR receiver_id = 143

-- @block   
delete from payment_request

-- @block
DROP TABLE payment_request