-- @block   
CREATE TABLE receipts (
    receipt_id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT NOT NULL,
    images TEXT,
    receipt_name TEXT,
    receipt_description TEXT,
    receipt_category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    vendor_name TEXT
);
-- @block
INSERT INTO receipts (
        group_id,
        images,
        receipt_name,
        receipt_description,
        receipt_category,
        vendor_name
    )
VALUES (
        1,
        'image1.jpg',
        'Receipt 1',
        'Description for receipt 1',
        'food',
        'applebees'
    ),
    (
        1,
        'image2.jpg',
        'Receipt 2',
        'Description for receipt 2',
        'food',
        'innout'
    );
-- @block
CREATE TABLE taxes(
    tax_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id INT NOT NULL,
    tax_name TEXT,
    tax_percentage DECIMAL(4, 2) DEFAULT 0,
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id)
);
-- @block
INSERT INTO taxes(receipt_id, tax_name)
VALUES(1, 'GST');
-- @block
INSERT INTO taxes(
        receipt_id,
        tax_name,
        tax_percentage
    )
VALUES(2, 'GST', 5.0);
-- @block
CREATE TABLE tips (
    tip_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id INT NOT NULL,
    tip_amount DECIMAL(65, 2) DEFAULT 0,
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id)
);
-- @block
INSERT INTO tips(receipt_id, tip_amount)
VALUES(1, 10.0),
    (2, 20.0);
-- @block
SELECT *
FROM receipts;
-- @block
DROP TABLE receipts;
-- @block
DELETE FROM receipts
WHERE receipt_id = 3;
-- @block
SELECT *
FROM taxes;
-- @block
SELECT *
FROM tips;
-- @block
SHOW TABLES;