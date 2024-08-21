class Receipts{
    receipt_id;
    group_id;
    images;
    name;
    description;
    category;
    created_at;
    vendor;
    tax;
    tip;
    expense_rate;
    items;
    constructor(receipt_id, group_id, images, name, description, category, created_at=null, vendor, options = {
        tax: null,
        tip: null,
        expense_rate: null,
        items: null
    }){
        this.receipt_id = receipt_id;
        this.group_id = group_id;
        this.images = images;
        this.name = name;
        this.description = description;
        this.category = category;
        this.created_at = created_at;
        this.vendor = vendor;
        this.tax = options.tax;
        this.tip = options.tip;
        this.expense_rate = options.expense_rate;
        this.items = options.items;
    }
    nameOfReceipt(){
        return this.name;
    }
}

module.exports = Receipts;
