class Item {
    item_id;
    receipt_id;
    name;
    price;
    payee;
    created_at;
    constructor(item_id = null, receipt_id, name, price, payee, created_at = null){
        this.item_id = item_id;
        this.receipt_id = receipt_id;
        this.name = name;
        this.price = price;
        this.payee = payee;
        this.created_at = created_at;
    }
}

module.exports = Item;