let request = require('supertest');
let app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const itemAPI = require('../../api/itemAPI');

describe("item route tests", () => {
    const agent = request.agent(app);  
    
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
        await clearTable('users');
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
        const payload = {
            username: user1_payload.username,
            password: user1_payload.password
        }
        await agent
          .post("/auth/login")
          .send(payload)
          .expect("Content-Type", /json/)
          .expect(200)

    }, 20000)

    beforeEach(() => {
        jest.useRealTimers();
    })

    const payload = {
        item_id: null,
        receipt_id: '20230816000000',
        name: 'orange',
        price: '23.46',
        payee: 'john',
        created_at: null,
    };

    it("GET /items when no items exist", async () => {
        await agent
            .get("/items")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual([]);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }, 10000); 

    it("POST /items/add - create a valid item", async () => {

        await agent
            .post("/items/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = response.body;
                expect(body.receipt_id).toBe(payload.receipt_id);
                expect(body.name).toBe(payload.name);
                expect(body.price).toBe(payload.price);
                expect(body.payee).toBe(payload.payee);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

    }, 10000); 

    it("GET /items/:id - get a item by ID", async () => {

        const items = await itemAPI.getItems();
        const item_ids = items.map(item => item.item_id);

        // Attempt to retrieve item by id
        await agent
            .get('/items/' + item_ids[0])
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(body.receipt_id).toBe(payload.receipt_id);
                expect(body.name).toBe(payload.name);
                expect(body.price).toBe(payload.price);
                expect(body.payee).toBe(payload.payee);
            })
            .catch((err) => {
                console.error(err);
            });
        
    }, 10000); 

    it("PUT /items/:id/update - update a item", async () => {
        
        const items = await itemAPI.getItems();
        const item_ids = items.map(item => item.item_id);

        const updatedPayload = {
            item_id: item_ids[0],
            receipt_id: '20230816000000',
            name: 'apple', 
            price: '46.23',
            payee: 'david',
            created_at: null,
        }

        // Update the item
        await agent
            .put(`/items/${item_ids[0]}/update`)
            .send(updatedPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(body.receipt_id).toBe(updatedPayload.receipt_id);
                expect(body.name).toBe(updatedPayload.name);
                expect(body.price).toBe(updatedPayload.price);
                expect(body.payee).toBe(updatedPayload.payee);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }, 10000); 

    it("DELETE /items/:id/delete - delete a item", async () => {

        const items = await itemAPI.getItems();
        const item_ids = items.map(item => item.item_id);

        // Delete the item
        await agent
            .delete(`/items/${item_ids[0]}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body).toBe('Item deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

    }, 10000);
    
});