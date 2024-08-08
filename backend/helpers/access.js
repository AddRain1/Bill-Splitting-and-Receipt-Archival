const paymentRequestAPI = require('../api/paymentRequestAPI');
const receiptAPI = require('../api/receiptsAPI');
const groupAPI = require('../api/groupAPI');
const expenseRateAPI = require('../api/expenseRateAPI');
const taxAPI = require('../api/taxAPI');
const tipAPI = require('../api/tipAPI');
const friendsAPI = require('../api/friendsAPI');

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

const get_accessible_taxes = user_id => {
    const receipts = get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    //Get taxes assigned to each receipt
    const tax_receipt_query = `SELECT * FROM taxes WHERE receipt_id IN (${receiptIds})`;
    return taxAPI.getTax(tax_receipt_query);
}

const check_tax_accesible = (user_id, tax_id) => {
    const receipts = get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    const tax = taxAPI.getTaxById(tax_id);
    if(tax.receipt_id in receiptIds) return true;
    else return false;
}

const get_accessible_tips = user_id => {
    const receipts = get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    //Get tips assigned to each receipt
    const tip_receipt_query = `SELECT * FROM tips WHERE receipt_id IN (${receiptIds})`;
    return tipAPI.getTip(tip_receipt_query);
}

const check_tip_accesible = (user_id, tip_id) => {
    const receipts = get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    const tip = tipAPI.getTipByID(tip_id);
    if(tip.receipt_id in receiptIds) return true;
    else return false;
}

const get_accepted_friends = (user_id) => {
    const accepted_friends_query = `
        (SELECT receiver_id AS friend FROM friends WHERE requester_id = ${user_id} AND is_confirmed = TRUE) 
        UNION 
        (SELECT requester_id AS friend FROM friends WHERE receiver_id = ${user_id} AND is_confirmed = TRUE);`;
    const accepted_friends = friendsAPI.getFriendByQuery(accepted_friends_query);
    return accepted_friends;
}

const get_not_accepted_friends = (user_id) => {
    const not_accepted_friends_query = `
        (SELECT receiver_id AS friend FROM friends WHERE requester_id = ${user_id} AND is_confirmed = FALSE) 
        UNION 
        (SELECT requester_id AS friend FROM friends WHERE receiver_id = ${user_id} AND is_confirmed = FALSE);`;
    const not_accepted_friends = friendsAPI.getFriendByQuery(not_accepted_friends_query);
    return not_accepted_friends;
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
    check_group_accessible,
    get_accessible_taxes,
    check_tax_accesible,
    get_accessible_tips,
    check_tip_accesible,
    get_accepted_friends,
    get_not_accepted_friends
}
