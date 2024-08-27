class Tax {
    tax_id;
    receipt_id;
    name;
    percentage;
    constructor(tax_id = null, receipt_id, name, percentage) {
        this.tax_id = tax_id;
        this.receipt_id = receipt_id;
        this.name = name;
        this.percentage = percentage;
    }
}

module.exports = Tax;