class ExpenseRate {
    receipt_id;
    name;
    percentage;
    expense_rate_id;
    constructor(receipt_id, name, percentage, expense_rate_id=null) {
        this.receipt_id = receipt_id;
        this.name = name;
        this.percentage = percentage;
        this.expense_rate_id = expense_rate_id;
    }
} 

module.exports = ExpenseRate;