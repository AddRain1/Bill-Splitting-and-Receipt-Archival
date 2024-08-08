-- @block
CREATE TABLE users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULl,
    hashed_password VARCHAR(100) NOT NULL,
    profile_description TEXT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- @block
SELECT *
FROM users;
-- @block
DROP TABLE users;
-- @block