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
    creation_date;
    constructor(payer_id, receiver_id, pay_by, paid_on, amount, is_declined, description, creation_date=Date.now(), receipt_id=null, payment_request_id=null){
        this.payer_id = payer_id;
        this.receiver_id = receiver_id;
        this.pay_by = pay_by;
        this.paid_on = paid_on;
        this.amount = amount;
        this.is_declined = is_declined;
        this.description = description;
        this.creation_date = creation_date;
        this.receipt_id = receipt_id;
        this.payment_request_id = payment_request_id;
    }
}

module.exports = PaymentRequest;