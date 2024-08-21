let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

const payload = {
    receipt_id: '20240715000000',
    price: '23.46',
    payee: 'john',
    name: 'orange'
};

const updatedPricePayload = {
    receipt_id: '20240715000000',
    price: '7.24',
    payee: 'john',
    name: 'orange'
};

describe("item route tests", () => {
    const agent = request(app);  
    
    /* const user1_payload = {
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
        await clearTable('users');
        await clearTable('`group`');
        await clearTable('user_group');
        await clearTable('items');
        //Create users
        await agent
          .post("/auth/signup")
          .send(user1_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await agent
          .post("/auth/signup")
          .send(user2_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await agent
          .post("/auth/signup")
          .send(user3_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        //Login as the first created user
        const loginpayload = {
            username: user1_payload.username,
            password: user1_payload.password
        }
        await agent
          .post("/auth/login")
          .send(loginpayload)
          .expect("Content-Type", /json/)
          .expect(200)

    }, 20000) */

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("GET /items when no items exist", async () => {
        await agent
            .get("/items")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.length).toBe(0)
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("POST /items/add - create a valid item", async () => {

        await agent
            .post("/items/add")
            .query(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = response.body;
                expect(payload.receipt_id).toBe(body.receipt_id);
                expect(payload.name).toBe(body.name);
                expect(payload.price).toBe(body.price);
                expect(payload.payee).toBe(body.payee);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("GET /items/:id - get a item by ID", async () => {
        let item_id;

        // Create item
        await agent
            .post("/items/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = response.body;
                item_id = body.item_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Attempt to retrieve item by id
        await agent
            .get(`/items/${item_id}`)
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(payload.receipt_id).toBe(body.receipt_id);
                expect(payload.name).toBe(body.name);
                expect(payload.price).toBe(body.price);
                expect(payload.payee).toBe(body.payee);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("PUT /items/:id/update - update a item", async () => {

        let item_id;

        // Create a item
        await agent
            .post("/items/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = response.body;
                item_id = body.item_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Update the item
        await agent
            .put(`/items/${item_id}/update`)
            .send(updatedPricePayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(updatedPricePayload.receipt_id).toBe(body.receipt_id);
                expect(updatedPricePayload.name).toBe(body.name);
                expect(updatedPricePayload.price).toBe(body.price);
                expect(updatedPricePayload.payee).toBe(body.payee);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("DELETE /items/:id/delete - delete a item", async () => {

        let item_id;

        // Create a item
        await agent
            .post("/items/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = response.body;
                item_id = body.item_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Delete the item
        await agent
            .delete(`items/${item_id}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body.msg).toBe('Item deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Verify the deletion
        await agent
            .get(`/items/${item_id}`)
            .expect(404)
            .catch((err) => {
                expect(err).toBe(null);
            });
    });
    
});