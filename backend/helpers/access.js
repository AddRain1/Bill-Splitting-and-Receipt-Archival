const paymentRequestAPI = require('../api/paymentRequestAPI');
const receiptAPI = require('../api/receiptsAPI');
const groupAPI = require('../api/groupAPI');
const expenseRateAPI = require('../api/expenseRateAPI');

//Retrieve all payment requests where user is the payer or receiver
const get_payment_requests_payer_or_receiver = (user_id) => {
    const payer_or_receiver_query = `SELECT * FROM payment_request WHERE payer_id = ${user_id} OR receiver_id = ${user_id}`;
    return paymentRequestAPI.getPaymentRequests(payer_or_receiver_query);
}

//Retrieve all payment requests where user has access to the receipt
const get_payment_requests_with_receipt_access = user_id => {
    const groups = get_accessible_groups(user_id)

    //Retrieve all receipts linked to a group that the user is a member of
    const groupIds = groups.map(group => group.group_id).join(',');
    const receipt_group_query = `SELECT * FROM receipts WHERE group_id IN (${groupIds})`;
    return receiptAPI.getReceipts(receipt_group_query);
}

//TODO: Cache results
const get_accessible_payment_requests = (user_id) => {
    const payer_receiver = get_payment_requests_payer_or_receiver(user_id);
    const receipts = get_payment_requests_with_receipt_access(user_id);

    return new Set(...payer_receiver, ...receipts);
}

const check_payment_request_accessible = (user_id, paymentRequest_id) => {
    return get_accessible_payment_requests(user_id).has(paymentRequest_id);
}

const get_accessible_receipts = (user_id) => {
    //Retrieve all groups that the user is a member of
    const groups = get_accessible_groups(user_id)

    //Get all receipts assigned to any of the groups
    const groupIds = groups.map(group => group.group_id).join(',');
    const receipt_group_query = `SELECT * FROM receipts WHERE group_id IN (${groupIds})`;
    return receiptAPI.getReceipts(receipt_group_query);
}

const check_receipt_accessible = (user_id, receipt_id) => {
    const receipt = receiptAPI.getReceiptByID(receipt_id);

    //Retrieve all groups that the user is a member of
    const groups = get_accessible_groups(user_id)

    //Check if the user is a member of the group that the receipt is assigned to
    if(receipt.receipt_id in groups) return true;
    else return false;
}

const get_accessible_expense_rates = (user_id) => {
    //Get receipts the user has access to 
    const receipts = get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    //Get expense rates assigned to each receipt
    const expense_rate_receipt_query = `SELECT * FROM expense_rate WHERE receipt_id IN (${receiptIds})`;
    return expenseRateAPI.getExpRt(expense_rate_receipt_query);
} 

const get_accessible_groups = user_id => {
    return groupAPI.getUser_groups(user_id);
}

const check_group_accessible = (user_id, group_id) => {
    const members = groupAPI.getGroup_members(group_id);
    //Check if the user is a member of the group 
    if(user_id in members) return true;
    else return false;
}

module.exports = {
    get_payment_requests_payer_or_receiver, 
    get_payment_requests_with_receipt_access, 
    get_accessible_payment_requests, 
    check_payment_request_accessible, 
    get_accessible_receipts, 
    check_receipt_accessible, 
    get_accessible_expense_rates, 
    get_accessible_groups, 
    check_group_accessible
}
