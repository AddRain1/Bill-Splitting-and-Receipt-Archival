-- @block
SELECT *
FROM users;
-- @block
DROP TABLE users;
-- @block
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username CHAR(100) NOT NULL,
    firstname CHAR(100) NOT NULL,
    lastname CHAR(100) NOT NULL,
    email CHAR(100) NOT NULL,
    profile_description CHAR(250),
    hashed_password CHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- @block
INSERT INTO users (
        username,
        firstname,
        lastname,
        email,
        profile_description,
        hashed_password
    )
VALUES (
        'billy',
        'billy',
        'billy',
        'billy@gmail.com',
        'billy is a cool guy',
        'billy1234'
    );