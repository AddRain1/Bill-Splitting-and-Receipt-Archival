class Receipts{
    receipt_id;
    group_id;
    images;
    name;
    description;
    category;
    creation_date;
    vendor;
    constructor(group_id, name, description, images=null, category=null, creation_date=new Date(), vendor=null, receipt_id=null){
        this.group_id = group_id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.category = category;
        this.creation_date = creation_date;
        this.vendor = vendor;
        this.receipt_id = receipt_id;
    }
}

module.exports = Receipts;
