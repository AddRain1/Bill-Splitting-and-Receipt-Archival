let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const tipAPI = require('../../api/tipAPI');

describe("tip route tests", () => {
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
        await clearTable('tips');

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
        tip_id: null,
        receipt_id: '20230816000000',
        amount: '16.02'
    };

    it("GET /tip when no tips exist", async () => {
        await agent
            .get("/tips")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.length).toBe(undefined);
            })
            .catch((err) => {
                expect(err).toBe([]);
            });
    });

    it("POST /tips/add - create a valid tip", async () => {

        await agent
            .post("/tips/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = response.body;
                expect(body.receipt_id).toBe(payload.receipt_id);
                expect(body.amount).toBe(payload.amount);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }, 10000);

    it("GET /tips/:id - get a tip by ID", async () => {

        const tips = await tipAPI.getTips();
        const tip_ids = tips.map(tip => tip.tip_id);

        // Attempt to retrieve tip by id
        await agent
            .get(`/tips/${tip_ids[0]}`)
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(body.receipt_id).toBe(payload.receipt_id);
                expect(body.amount).toBe(payload.amount);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }, 10000);

    it("PUT /tips/:id/update - update a tip", async () => {

        const tips = await tipAPI.getTips();
        const tip_ids = tips.map(tip => tip.tip_id);

        const updatedPayload = {
            tip_id: tip_ids[0],
            receipt_id: '20230816000000',
            amount: '16.02'
        }

        // Update the tip
        await agent
            .put(`/tips/${tip_ids[0]}/update`)
            .send(updatedPayload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(body.receipt_id).toBe(updatedPayload.receipt_id);
                expect(body.amount).toBe(updatedPayload.amount);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("DELETE /tips/:id/delete - delete a tip", async () => {
        
        const tips = await tipAPI.getTips();
        const tip_ids = tips.map(tip => tip.tip_id);

        // Delete the tip
        await agent
            .delete(`/tips/${tip_ids[0]}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body).toBe('Tip deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

    }); 

});