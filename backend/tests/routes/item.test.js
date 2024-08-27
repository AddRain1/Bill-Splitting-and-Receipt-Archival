let request = require('supertest');
let app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const itemAPI = require('../../api/itemAPI.js');
const Item = require('../../class/itemClass.js')

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
        user: 'user1'
    };
    
    const updatedPricePayload = {
        item_id: null,
        receipt_id: '20230816000000',
        name: 'apple', 
        price: '46.23',
        payee: 'david',
        created_at: null,
        user: 'user2'
    }

    it("GET /items when no items exist", async () => {
        await agent
            .get("/items")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.length).toBe(0);
            })
            .catch((err) => {
                console.error(err);
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
                /*expect(payload.receipt_id).toBe(body.receipt_id);
                expect(payload.name).toBe(body.name);
                expect(payload.price).toBe(body.price);
                expect(payload.payee).toBe(body.payee);
                expect(payload.user).toBe(body.user);*/
            })
            .catch((err) => {
                console.error(err);
            });

    }, 10000); 

    it("GET /items/:id - get a item by ID", async () => {

        // same as payload but without user
        /* const item = new Item(
            null,
            '20230816000000',
            'orange',
            '23.46',
            'john',
            null
        );

        await itemAPI.addItem(item); */

        // Attempt to retrieve item by id
        await agent
            .get('/items/' + payload.receipt_id)
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                /*expect(item.receipt_id).toBe(body.receipt_id);
                expect(item.name).toBe(body.name);
                expect(item.price).toBe(body.price);
                expect(item.payee).toBe(body.payee);*/
            })
            .catch((err) => {
                console.error(err);
            });
        
    }, 10000); 

    it("PUT /items/:id/update - update a item", async () => {
        
        // Update the item
        await agent
            .put(`/items/${payload.receipt_id}/update`)
            .send(updatedPricePayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                /* expect(updatedPricePayload.name).toBe(body.name);
                expect(updatedPricePayload.receipt_id).toBe(body.receipt_id);
                expect(updatedPricePayload.price).toBe(body.price);
                expect(updatedPricePayload.payee).toBe(body.payee);*/
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }, 10000); 

    it("DELETE /items/:id/delete - delete a item", async () => {

        // Delete the item
        await agent
            .delete(`/items/${payload.receipt_id}/delete`)
            .expect(200)
            .catch((err) => {
                console.error(err);
            });

    }, 10000);
    
});