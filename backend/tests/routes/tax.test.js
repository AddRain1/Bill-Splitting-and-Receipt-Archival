let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

describe("tax route tests", () => {
    const agent = request(app);  
    
    beforeAll(async () => {
        await clearTable('taxes');
    })

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("GET /tax when no taxes exist", async () => {
        await agent
            .get("/taxes")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.length).toBe(0)
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("POST /taxes/add - create a valid tax", async () => {
        const payload = {
            receipt_id: '20240715000000',
            name: 'bobby',
            percentage: '0.08'
        }

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
        const payload = {
            receipt_id: '20240715000000',
            name: 'bobby',
            percentage: '0.08'
        }

        let tax_id;

        // Create tax
        await agent
            .post("/taxes/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                tax_id = body.tax_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Attempt to retrieve tax by id
        await agent
            .get(`/taxes/${tax_id}`)
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
        const payload = {
            receipt_id: '20240715000000',
            name: 'bobby',
            percentage: '0.08'
        };

        const updatedPayload = {
            receipt_id: '20240715000000',
            name: 'updatedname',
            percentage: '8.00'
        };

        let tax_id;

        // Create a tax
        await agent
            .post("/taxes/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                tax_id = body.tax_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Update the tax
        await agent
            .put(`/taxes/${tax_id}/update`)
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
        const payload = {
            receipt_id: '20240715000000',
            name: 'bobby',
            percentage: '0.08'
        };

        let tax_id;

        // Create a tax
        await agent
            .post("/taxes/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(201)
            .then(response => {
                const body = JSON.parse(response.text);
                tax_id = body.tax_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Delete the tax
        await agent
            .delete(`taxes/${tax_id}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body.msg).toBe('Tax deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // Verify the deletion
        await agent
            .get(`/taxes/${tax_id}`)
            .expect(404)
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

});