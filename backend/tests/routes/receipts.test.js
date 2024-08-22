let request = require('supertest');
let app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const userAPI = require('../../api/usersAPI');
const groupAPI = require('../../api/groupAPI');
const receiptAPI = require('../../api/receiptsAPI');
const e = require('express');

describe("Receipt routes", () => {
    request = request.agent(app);  

    const user1_payload = {
        username:'user1', 
        first_name:'test', 
        last_name: 'person', 
        email:'testuser1@gmail.com', 
        password:'password',
        profile_description: 'certified tester'
    }

    const user2_payload = {
        username:'user2', 
        first_name:'test', 
        last_name: 'person', 
        email:'testuser2@gmail.com', 
        password:'password',
        profile_description: 'certified tester'
    }

    const user3_payload = {
        username:'user3', 
        first_name:'test', 
        last_name: 'person', 
        email:'testuser3@gmail.com', 
        password:'password',
        profile_description: 'certified tester'
    }
    
    beforeAll(async () => {
        await clearTable('receipts');
        await clearTable('`group`');
        await clearTable('users');

        //Create users
        await request
          .post("/auth/signup")
          .send(user1_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await request
          .post("/auth/signup")
          .send(user2_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await request
          .post("/auth/signup")
          .send(user3_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        //Login as the first created user
        const payload = {
            username: user1_payload.username,
            password: user1_payload.password
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect("Content-Type", /json/)
          .expect(200)

        const group1_payload = {
            name: 'self',
            description: 'just me',
            members: []
        }
        const users = await userAPI.getUsers();
        const user_ids = users.map(u => u.user_id);
        const group2_payload = {
            name: 'party',
            description: 'woo',
            members: user_ids
        }

        await request
          .post("/groups/add")
          .send(group1_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await request
          .post("/groups/add")
          .send(group2_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        
    }, 20000)

    beforeEach(() => {
        jest.useRealTimers();
    })

    /* afterAll(async () => {
        await clearTable('receipts');
        await clearTable('`group`');
        await clearTable('users');
    }); */

    it("GET /receipts when no receipts exist", async () => {
        await request
        .get("/receipts")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {                          
            expect(response.body.length).toBe(0)
        })
        .catch((err) => {
            expect(err).toBe(null);
        });
    });

    it("POST /receipts/add - create a valid receipt as admin", async () => {
        const groups = await groupAPI.getGroups();
        const group_ids = groups.map(g => g.group_id);
        const payload = {
            group_id: group_ids[0],
            name: 'bobby',
            description: 'bobbys description',
            category: 'food',
            vendor: 'bobby inc'
        }
        await request
            .post("/receipts/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("GET /receipts/:id - get a receipt by ID", async () => {
        const receipts = await receiptAPI.getReceipts();
        const receipt_ids = receipts.map(r => r.receipt_id);

        // Get receipt by id
        await request
            .get(`/receipts/${receipt_ids[0]}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(checkPayloadWithResponse(receipts[0], body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("POST /receipts/:id/update - update a receipt as admin", async () => {
        const receipts = await receiptAPI.getReceipts();
        const receipt_ids = receipts.map(r => r.receipt_id);

        const payload = {
            name: 'bob',
            description: 'bobs description',
            vendor: 'bob inc'
        }

        // Now update the receipt
        await request
            .post(`/receipts/${receipt_ids[0]}/update`)
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(async () => {
                const receipt = await receiptAPI.getReceiptByID(receipt_ids[0]);
                expect(checkPayloadWithResponse(payload, receipt)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("DELETE /receipts/:id/delete - delete a existing receipt", async () => {
        const receipts = await receiptAPI.getReceipts();
        const initial_length = receipts.length;
        const receipt_ids = receipts.map(r => r.receipt_id);

        // Add a receipt to the table
        await request
            .post("/receipts/" + receipt_ids[0] + "/delete")
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(async() => {
                const receipt_list = await receiptAPI.getReceipts();
                expect(receipt_list.length).toBe(initial_length - 1);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });
}); 