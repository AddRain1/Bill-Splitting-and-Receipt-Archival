let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

describe("tax route tests", () => {
    let request = require('supertest');

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
        await clearTable('taxes');

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
        tax_id: null,
        receipt_id: '20230816000000',
        name: 'orange',
        percentage: '0.08'
    };
    
    const updatedPayload = {
        tax_id: null,
        receipt_id: '20230816000000',
        name: 'apple',
        percentage: '0.22'
    }

    it("GET /tax when no taxes exist", async () => {
        await agent
            .get("/taxes")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.length).toBe([])
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("POST /taxes/add - create a valid tax", async () => {

        await agent
            .post("/taxes/add")
            .query(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("GET /taxes/:id - get a tax by ID", async () => {

        // Attempt to retrieve tax by id
        await agent
            .get(`/taxes/${payload.receipt_id}`)
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("PUT /taxes/:id/update - update a tax", async () => {

        // Update the tax
        await agent
            .put(`/taxes/${payload.receipt_id}/update`)
            .send(updatedPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("DELETE /taxes/:id/delete - delete a tax", async () => {
        
        // Delete the tax
        await agent
            .delete(`/taxes/${payload.receipt_id}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body.msg).toBe('Tax deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

    });

});