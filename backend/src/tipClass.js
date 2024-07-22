export class Tip {
    tip_id;
    receipt_id;
    amount;
    constructor(tip_id, receipt_id, amount) {
        this.tip_id = tip_id;
        this.receipt_id = receipt_id;
        this.amount = amount;
    }
}