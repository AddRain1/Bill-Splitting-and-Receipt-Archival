let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

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

    it("GET /tips when no tips exist", async () => {
        await agent
        .get("/tips")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {                          
            expect(response.body.length).toBe([])
        })
        .catch((err) => {
            expect(err).toBe(null);
        });
    });

    it("POST /tips/add - create a valid tip", async () => {
        const payload = {
            name: 'bobby',
            amount: '7.36',
            receipt_id: '20240715000000'
        }
        await agent
            .post("/tips/add")
            .query(payload)
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
    });

    it("GET /tips/:id - get a tip by ID", async () => {
        const payload = {
            name: 'bobby',
            amount: '7.36',
            receipt_id: '20240715000000'
        };

        let tip_id;

        // Create the tip
        await agent
            .post("/tips/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                tip_id = body.tip_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Retrive tip by id
        await agent
            .get(`/tips/${tip_id}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(response => {
                const body = JSON.parse(response.text);
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("PUT /tips/:id/update - update a tip", async () => {
        const payload = {
            name: 'bobby',
            amount: '7.36',
            receipt_id: '20240715000000'
        };

        const updatedPayload = {
            name: 'updatedname',
            amount: '10.36',
            receipt_id: '20240715000000'
        };

        let tip_id;

        //Create tip
        await agent
            .post("/tips/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                tip_id = body.tip_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Update the tip
        await agent
            .put(`/tips/${tip_id}/update`)
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

    it("DELETE /tips/:id/delete - delete a tip", async () => {
        const payload = {
            name: 'bobby',
            amount: '7.36',
            receipt_id: '20240715000000'
        };

        let tip_id;

        // Create a tip
        await agent
            .post("/tips/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                tip_id = body.tip_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Delete the tip
        await agent
            .delete(`tips/${tip_id}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body.msg).toBe('Tip deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Verify the deletion
        await agent
            .get(`/tips/${tip_id}`)
            .expect(404)
            .catch((err) => {
                expect(err).toBe(null);
            });
    });
});