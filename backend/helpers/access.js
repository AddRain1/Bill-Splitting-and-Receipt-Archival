const paymentRequestAPI = require('../api/paymentRequestAPI');
const receiptAPI = require('../api/receiptsAPI');
const groupAPI = require('../api/groupAPI');
const expenseRateAPI = require('../api/expenseRateAPI');
const taxAPI = require('../api/taxAPI');
const tipAPI = require('../api/tipAPI');
const friendsAPI = require('../api/friendsAPI');

//Retrieve all payment requests where user is the payer or receiver
const get_payment_requests_payer_or_receiver = async (user_id) => {
    const payer_or_receiver_query = `SELECT * FROM payment_request WHERE payer_id = ${user_id} OR receiver_id = ${user_id}`;
    return await paymentRequestAPI.getPaymentRequests(payer_or_receiver_query);
}

//Retrieve all payment requests where user has access to the receipt
const get_payment_requests_with_receipt_access = async user_id => {
    const groups = await get_accessible_groups(user_id)

    //Retrieve all receipts linked to a group that the user is a member of
    const groupIds = groups.map(group => group.group_id).join(',');
    const receipt_group_query = `SELECT * FROM receipts WHERE group_id IN (${groupIds})`;
    return await receiptAPI.getReceipts(receipt_group_query);
}

//TODO: Cache results
const get_accessible_payment_requests = async (user_id) => {
    const payer_receiver = await get_payment_requests_payer_or_receiver(user_id);
    const receipts = await get_payment_requests_with_receipt_access(user_id);

    return new Set(...payer_receiver, ...receipts);
}

const check_payment_request_accessible = async (user_id, paymentRequest_id) => {
    return await get_accessible_payment_requests(user_id).has(paymentRequest_id);
}

const get_accessible_receipts = async (user_id) => {
    //Retrieve all groups that the user is a member of
    const groups = await get_accessible_groups(user_id)

    //Get all receipts assigned to any of the groups
    const groupIds = groups.map(group => group.group_id).join(',');
    const receipt_group_query = `SELECT * FROM receipts WHERE group_id IN (${groupIds})`;
    return await receiptAPI.getReceipts(receipt_group_query);
}

const check_receipt_accessible = async (user_id, receipt_id) => {
    const receipt = await receiptAPI.getReceiptByID(receipt_id);

    //Retrieve all groups that the user is a member of
    const groups = await get_accessible_groups(user_id)

    //Check if the user is a member of the group that the receipt is assigned to
    if(receipt.receipt_id in groups) return true;
    else return false;
}

const get_accessible_expense_rates = async (user_id) => {
    //Get receipts the user has access to 
    const receipts = await get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    //Get expense rates assigned to each receipt
    const expense_rate_receipt_query = `SELECT * FROM expense_rate WHERE receipt_id IN (${receiptIds})`;
    return await expenseRateAPI.getExpRt(expense_rate_receipt_query);
} 

const get_accessible_groups = async user_id => {
    return await groupAPI.getUser_groups(user_id);
}

const check_group_accessible = async (user_id, group_id) => {
    const members = await groupAPI.getGroup_members(group_id);
    //Check if the user is a member of the group 
    if(user_id in members) return true;
    else return false;
}

const get_accessible_taxes = async user_id => {
    const receipts = await get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    //Get taxes assigned to each receipt
    const tax_receipt_query = `SELECT * FROM taxes WHERE receipt_id IN (${receiptIds})`;
    return await taxAPI.getTax(tax_receipt_query);
}

const check_tax_accesible = async (user_id, tax_id) => {
    const receipts = await get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    const tax = await taxAPI.getTaxById(tax_id);
    if(tax.receipt_id in receiptIds) return true;
    else return false;
}

const get_accessible_tips = async user_id => {
    const receipts = await get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    //Get tips assigned to each receipt
    const tip_receipt_query = `SELECT * FROM tips WHERE receipt_id IN (${receiptIds})`;
    return await tipAPI.getTip(tip_receipt_query);
}

const check_tip_accesible = async (user_id, tip_id) => {
    const receipts = await get_accessible_receipts(user_id);
    const receiptIds = receipts.map(receipt => receipt.receipt_id).join(',');

    const tip = await tipAPI.getTipByID(tip_id);
    if(tip.receipt_id in receiptIds) return true;
    else return false;
}

const get_accepted_friends = async (user_id) => {
    const accepted_friends_query = `
        (SELECT receiver_id AS friend FROM friends WHERE requester_id = ${user_id} AND is_confirmed = TRUE) 
        UNION 
        (SELECT requester_id AS friend FROM friends WHERE receiver_id = ${user_id} AND is_confirmed = TRUE);`;
    const accepted_friends = await friendsAPI.getFriendByQuery(accepted_friends_query);
    return accepted_friends;
}

const get_not_accepted_friends = async (user_id) => {
    const not_accepted_friends_query = `
        (SELECT receiver_id AS friend FROM friends WHERE requester_id = ${user_id} AND is_confirmed = FALSE) 
        UNION 
        (SELECT requester_id AS friend FROM friends WHERE receiver_id = ${user_id} AND is_confirmed = FALSE);`;
    const not_accepted_friends = await friendsAPI.getFriendByQuery(not_accepted_friends_query);
    return not_accepted_friends;
}

const check_friend_accesible_for_request = async (user_id, friend_id) => {
    const friendsById = await friendsAPI.getFriendById(user_id, friend_id);
    const req_id = friendsById.requestor_id;
    const rec_id = friendsById.receiver_id;
    if(user_id === req_id || user_id === rec_id){
        if(friendsById.is_confirmed === true) return true;
    };
    return false;
}

const check_friend_accesible_for_delete = async (user_id, friend_id) => {
    const friendsById = await friendsAPI.getFriendById(user_id, friend_id);
    const req_id = friendsById.requestor_id;
    const rec_id = friendsById.receiver_id;
    if(user_id === req_id || user_id === rec_id){
        return true;
    };
    return false;
}

const check_user_is_receiver = async (user_id, friend_id) => {
    const friendQuery = `SELECT * FROM friends WHERE requestor_id = ${friend_id} AND receiver_id = ${user_id}`;
    const friend = await friendsAPI.getFriendByQuery(friendQuery);
    if(friend.length > 0) return true;
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
    check_group_accessible,
    get_accessible_taxes,
    check_tax_accesible,
    get_accessible_tips,
    check_tip_accesible,
    get_accepted_friends,
    get_not_accepted_friends,
    check_friend_accesible_for_request,
    check_friend_accesible_for_delete,
    check_user_is_receiver
}
