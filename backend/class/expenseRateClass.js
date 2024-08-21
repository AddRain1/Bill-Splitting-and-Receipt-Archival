class ExpenseRate {
    expenseRate_id;
    receipt_id;
    name;
    percentage;
    constructor(expenseRate_id, receipt_id, name, percentage) {
        this.expenseRate_id = expenseRate_id;
        this.receipt_id = receipt_id;
        this.name = name;
        this.percentage = percentage;
    }
} 

module.exports = ExpenseRate;