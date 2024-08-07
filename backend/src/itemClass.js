export class Item {
    item_id;
    receipt_id;
    user_id;
    name;
    price;
    created_at;
    constructor(item_id, receipt_id, user_id, name, price, created_at){
        this.item_id = item_id;
        this.receipt_id = receipt_id;
        this.user_id = user_id;
        this.name = name;
        this.price = price;
        this.created_at = created_at;
    }
}
