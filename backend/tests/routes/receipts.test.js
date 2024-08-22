let request = require('supertest');
let app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const userAPI = require('../../api/usersAPI');
const groupAPI = require('../../api/groupAPI');

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

    afterAll(async () => {
        await clearTable('receipts');
        await clearTable('`group`');
        await clearTable('users');
    });

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

    it("POST /receipts/add - create a valid receipt", async () => {
        const groups = await groupAPI.getGroups();
        const group_ids = groups.map(g => g.group_id);
        const payload = {
            group_id: group_ids[0],
            name: 'bobby',
            description: 'bobbys description',
            category: 'food',
            vendor: 'bobby inc',
        }
        await request
            .post("/receipts/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.body);
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }, 10000);

    /* it("GET /receipts/:id - get a receipt by ID", async () => {
        const payload = {
            receipt_id: '20240819055013',
            group_id: '1',
            images: 'image.jpg',
            name: 'bobby',
            description: 'bobbys description',
            category: 'food',
            vendor: 'bobby',
            tax: null,
            tip: null,
            expense_rate: null,
            items: null
        }

        let receipt_id;

        // Create receipts
        await request
            .post("/receipts/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                receipt_id = body.receipt_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Get receipt by id
        await request
            .get(`/receipts/${receipt_id}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(body.name).toBe(payload.name);
                expect(body.description).toBe(payload.description);
                expect(body.category).toBe(payload.category);
                expect(body.vendor).toBe(payload.vendor);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }); */

    /* it("PUT /receipts/:id/update - update a receipt", async () => {
        const payload = {
            receipt_id: '20240819055013',
            group_id: '1',
            images: 'image.jpg',
            name: 'bobby',
            description: 'bobbys description',
            category: 'food',
            vendor: 'bobby',
            tax: null,
            tip: null,
            expense_rate: null,
            items: null
        }

        const updatedPayload = {
            receipt_id: '20240819055013',
            group_id: '2',
            images: 'image2.jpg',
            name: 'bobbyson',
            description: 'bobbysons description',
            category: 'food',
            vendor: 'bobbyson',
            tax: null,
            tip: null,
            expense_rate: null,
            items: null
        }

        let receipt_id;

        //Create the receipt
        await request
            .post("/receipts/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                receipt_id = body.receipt_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Now update the receipt
        await request
            .put(`/receipts/${receipt_id}/update`)
            .send(updatedPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(body.name).toBe(payload.name);
                expect(body.description).toBe(payload.description);
                expect(body.category).toBe(payload.category);
                expect(body.vendor).toBe(payload.vendor);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }); */

    /* it("DELETE /receipts/:id/delete - delete a existing receipt", async () => {
        const payload = {
            receipt_id: '20240819055013',
            group_id: '1',
            images: 'image.jpg',
            name: 'bobby',
            description: 'bobbys description',
            category: 'food',
            vendor: 'bobby',
            tax: null,
            tip: null,
            expense_rate: null,
            items: null
        }

        let receipt_id;

        // Add a receipt to the table
        await request
            .post("/receipts/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                receipt_id = body.receipt_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Delete the tip
        await request
            .delete(`receipts/${receipt_id}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body.msg).toBe('Receipt deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // After receipt is deleted, get by id should not return anything
        await request
            .get(`/receipts/${receipt_id}`)
            .expect(404)
            .catch((err) => {
                expect(err).toBe(null);
            });
    }); */
}); 