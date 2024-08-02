const PaymentRequest = require("../class/paymentRequestClass.js");
const connection = require("../db.js");

// Export the abstract class paymentAPI
class paymentRequestAPI{
    constructor(){
        // Prevent instantiation from this abstract class
        if(this.constructor === paymentRequestAPI){
            throw new Error("Cannot instantiate from abstract class");
        }
    }

    // Abstract method to be overridden by subclasses
    static async getPaymentRequests(query){
        // Check if the subclass has defined this method
        if(!this.getGroups){
            throw new Error("getPaymentRequests method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async addPaymentRequest(paymentRequest){
        // Check if the subclass has defined this method
        if(!this.addPaymentRequest){
            throw new Error("addPaymentRequest method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changePaymentRequest_pay_by(paymentRequest_id, pay_by){
        // Check if the subclass has defined this method
        if(!this.changePaymentRequest_pay_by){
            throw new Error("changePaymentRequest_pay_by method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changePaymentRequest_paid_on(paymentRequest_id, paid_on){
        // Check if the subclass has defined this method
        if(!this.changePaymentRequest_paid_on){
            throw new Error("changePaymentRequest_paid_on method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changePaymentRequest_amount(paymentRequest_id, amount){
        // Check if the subclass has defined this method
        if(!this.changePaymentRequest_amount){
            throw new Error("changePaymentRequest_amount method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changePaymentRequest_is_declined(paymentRequest_id, is_declined){
        // Check if the subclass has defined this method
        if(!this.changePaymentRequest_is_declined){
            throw new Error("changePaymentRequest_is_declined method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async changePaymentRequest_decription(paymentRequest_id, description){
        // Check if the subclass has defined this method
        if(!this.addGroup_member){
            throw new Error("changePaymentRequest_decription method must be defined");
        }
    }

    // Abstract method to be overridden by subclasses
    static async deletePaymentRequest(paymentRequest_id){
        // Check if the subclass has defined this method
        if(!this.deletePaymentRequest){
            throw new Error("deletePaymentRequest method must be defined");
        }
    }
}

class paymentRequestTableAPI extends paymentRequestAPI{
    // Override the getPaymentRequests method
    // Static async function to get all payment requests from the database
    //TODO: Allow for dynamic queries
    static async getPaymentRequests(){
        // Execute the query to get all the payment requests from the database
        const [results] = await connection.execute('SELECT * FROM payment_request');
        
        // get group object from results
        const paymentRequestObj = results.map(result => new PaymentRequest(
            result.payment_request_id,
            result.payer_id,
            result.receiver_id,
            result.pay_by,
            result.paid_on,
            result.amount,
            result.is_declined,
            result.description,
            result.receipt_id
        ));
        // Return the payment requests object
        return paymentRequestObj;
    }

    // Override the addPaymentRequest method
    // Static async function to add a new payment requests to the database
    static async addPaymentRequest(payment_request){        
        // Execute the query to insert the new payment requests into the database
        const query = 'INSERT INTO payment_request (payer_id, receiver_id, pay_by, paid_on, amount, is_declined, description, receipt_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [payment_request.payer_id, 
            payment_request.receiver_id, 
            payment_request.pay_by,
            payment_request.paid_on,
            payment_request.amount,
            payment_request.is_declined,
            payment_request.description,
            payment_request.receipt_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the changePaymentRequest_pay_by method
    // Static async function to modify a property in the database.
    // TODO: For efficiency, looking into batching
    static async changePaymentRequest(payment_request_id, property_name, property_value){
        // Execute the query to update the description of the payment request in the database
        const query = 'UPDATE group SET ' + property_name +  ' = ? WHERE payment_request_id = ?';
        const params = [property_value, payment_request_id];
        const [results] = await connection.execute(query, params);
    }

    // Override the deletePaymentRequest method
    // Static async function to delete a payment request from the database
    static async deletePaymentRequest(payment_request_id){
        // Get all the payment requests
        const payment_requests = await paymentRequestTableAPI.getPaymentRequests();
        // Check if the payment request is already deleted
        const exist = payment_requests.find(p => p.payment_request_id === payment_request_id)
        if(!exist) throw new Error("Payment request doesn't exist");

        // Execute the query to delete payment request from the database
        const query = 'DELETE FROM payment_request WHERE payment_request_id = ?'
        const params = [payment_request_id];
        const [results] = await connection.execute(query, params);  
    }

};

module.exports = paymentRequestTableAPI;