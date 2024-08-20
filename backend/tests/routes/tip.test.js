let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

describe("tip route tests", () => {
    const agent = request(app);  
    
    beforeAll(async () => {
        await clearTable('tips');
    })

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("GET /tips when no tips exist", async () => {
        await agent
        .get("/tips")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {                          
            expect(response.body.length).toBe(0)
        })
        .catch((err) => {
            expect(err).toBe(null);
        });
    });

    it("POST /tips/add - create a valid tip", async () => {
        const payload = {
            name: 'bobby',
            amount: '7.36',
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
                expect(body.name).toBe(payload.name);
                expect(body.amount).toBe(payload.amount)
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("PUT /tips/:id/update - update a tip", async () => {
        const payload = {
            name: 'bobby',
            amount: '7.36',
        };

        const updatedPayload = {
            name: 'updatedname',
            amount: '10.36',
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
                expect(body.name).toBe(updatedPayload.name);
                expect(body.amount).toBe(updatedPayload.amount);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("DELETE /tips/:id/delete - delete a tip", async () => {
        const payload = {
            name: 'bobby',
            amount: '7.36',
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