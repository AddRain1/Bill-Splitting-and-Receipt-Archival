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
    constructor(payer_id, receiver_id, amount, description, pay_by=null, receipt_id=null, is_declined=false, paid_on=null, creation_date=new Date(), payment_request_id=null){
        this.payer_id = payer_id;
        this.receiver_id = receiver_id;
        this.amount = amount;
        this.description = description;
        this.pay_by = pay_by;
        this.receipt_id = receipt_id;
        this.is_declined = +is_declined;
        this.paid_on = paid_on;
        this.creation_date = creation_date;
        this.payment_request_id = payment_request_id;
    }
}

module.exports = PaymentRequest;