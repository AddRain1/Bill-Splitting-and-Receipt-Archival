-- @block
CREATE TABLE friends (
    friend_id INT NOT NULL AUTO_INCREMENT,
    requester_id CHAR(15) NOT NULL,
    receiver_id CHAR(15) NOT NULL,
    is_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- FOREIGN KEY (requester_id) REFERENCES users(user_id),
    -- FOREIGN KEY (recipient_id) REFERENCES users(user_id),
    PRIMARY KEY (friend_id)
);
-- @block
INSERT INTO friends (requester_id, receiver_id, is_confirmed)
VALUES ('20240730000000', '20240729000000', FALSE);