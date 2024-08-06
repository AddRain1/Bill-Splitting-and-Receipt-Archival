const paymentRequestAPI = require('../api/paymentRequestAPI');
const receiptAPI = require('../api/receiptsAPI');
const groupAPI = require('../api/groupAPI');

//Retrieve all payment requests where user is the payer or receiver
const get_payment_requests_payer_or_receiver = user_id => {
    const payer_or_receiver_query = '';
    return paymentRequestAPI.getPaymentRequests(payer_or_receiver_query);
}

//Retrieve all payment requests where user has access to the receipt
const get_payment_requests_with_receipt_access = user_id => {
    //Retrieve all groups that the user is a member of
    const user_group_query = '';
    const groups = groupAPI.getGroups(user_group_query);

    //Retrieve all receipts linked to a group that the user is a member of
    const receipt_group_query = '';
    return receiptAPI.getReceipts(receipt_group_query);
}

//TODO: Cache results
const get_accessible_payment_requests = user_id => {
    const payer_receiver = get_payment_requests_payer_or_receiver(user_id);
    const receipts = get_payment_requests_with_receipt_access(user_id);

    return Set(...payer_receiver, ...receipts);
}

const check_payment_request_accessible = (user_id, paymentRequest_id) => {
    return get_accessible_payment_requests(user_id).has(paymentRequest_id);
}

const get_accessible_receipts = user_id => {
    const receipt = receiptAPI.getReceiptByID(receipt_id);

    //Retrieve all groups that the user is a member of
    const user_group_query = '';
    const groups = groupAPI.getGroups(user_group_query);

    //Get all receipts assigned to any of the groups
    const receipt_group_query = '';
    return receiptAPI.getReceipts(receipt_group_query);
}

const check_receipt_accessible = (user_id, receipt_id) => {
    const receipt = receiptAPI.getReceiptByID(receipt_id);

    //Retrieve all groups that the user is a member of
    const user_group_query = '';
    const groups = groupAPI.getGroups(user_group_query);

    //Check if the user is a member of the group that the receipt is assigned to
    if(receipt.receipt_id in groups) return true;
    else return false;
}

module.exports = {get_payment_requests_payer_or_receiver, get_payment_requests_with_receipt_access, get_accessible_payment_requests, check_payment_request_accessible, get_accessible_receipts, check_receipt_accessible}