-- @block   
CREATE TABLE receipts (
    receipt_id CHAR(15) NOT NULL PRIMARY KEY,
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
        receipt_id,
        group_id,INSERT INTO items(receipt_id, item_name, item_price, item_payee)
VALUES('20240715000000', 'Item 1', 10.0, 'John'),
    ('20240715000000', 'Item 2', 20.0, 'Jane'),
    ('20240716021644', 'Item 1', 10.0, 'Jason');

INSERT INTO expense_rate(
        receipt_id,
        expenseRate_name,
        expenseRate_percentage
    )
VALUES('20240715000000', 'ER 1', 6.0),
    ('20240716021723', 'ER 2', 5.0);
        images,
        receipt_name,
        receipt_description,
        receipt_category,
        vendor_name
    )
VALUES (
        '20240715000000',
        1,
        'image1.jpg',
        'Receipt 1',
        'Description for receipt 1',
        'food',
        'applebees'
    ),
    (
        '20230816000000',
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
    receipt_id CHAR(15) NOT NULL,
    tax_name TEXT,
    tax_percentage DECIMAL(4, 2) DEFAULT 0,
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id)
);
-- @block
INSERT INTO taxes(receipt_id, tax_name, tax_percentage)
VALUES('20240715000000', 'GST', 6.0);
-- @block
INSERT INTO taxes(
        receipt_id,
        tax_name,
        tax_percentage
    )
VALUES('20230816000000', 'GST', 5.0);
-- @block
CREATE TABLE tips (
    tip_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id CHAR(15) NOT NULL,
    tip_amount DECIMAL(65, 2) DEFAULT 0,
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id)
);
-- @block
INSERT INTO tips(receipt_id, tip_amount)
VALUES('20240715000000', 10.0),
    ('20230816000000', 20.0);
-- @block
CREATE TABLE expense_rate(
    expenseRate_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id CHAR(15) NOT NULL,
    expenseRate_name TEXT,
    expenseRate_percentage DECIMAL(4, 2) DEFAULT 0,
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id)
);
-- @block
INSERT INTO expense_rate(
        receipt_id,
        expenseRate_name,
        expenseRate_percentage
    )
VALUES('20240715000000', 'ER 1', 6.0),
    ('20240716021723', 'ER 2', 5.0);
-- @block
CREATE TABLE items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    receipt_id CHAR(15) NOT NULL,
    item_name TEXT,
    item_price DECIMAL(65, 2) DEFAULT 0,
    item_payee TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (receipt_id) REFERENCES receipts(receipt_id)
);
-- @block
INSERT INTO items(receipt_id, item_name, item_price, item_payee)
VALUES('20240715000000', 'Item 1', 10.0, 'John'),
    ('20240715000000', 'Item 2', 20.0, 'Jane'),
    ('20240716021644', 'Item 1', 10.0, 'Jason');
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
SELECT *
FROM expense_rate;
-- @block
SELECT *
FROM items;
-- @block
SHOW TABLES;