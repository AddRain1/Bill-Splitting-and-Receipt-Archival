class PaymentRequest {
    payment_request_id;
    payer_id;
    receiver_id;
    pay_by;
    paid_on;
    amount;
    is_declined;
    description;
    receipt_id;
    constructor(payment_request_id, payer_id, receiver_id, pay_by, paid_on, amount, is_declined, description, receipt_id=null){
        this.payment_request_id = payment_request_id;
        this.payer_id = payer_id;
        this.receiver_id = receiver_id;
        this.pay_by = pay_by;
        this.paid_on = paid_on;
        this.amount = amount;
        this.is_declined = is_declined;
        this.description = description;
        this.receipt_id = receipt_id;
    }
}

module.exports = PaymentRequest;