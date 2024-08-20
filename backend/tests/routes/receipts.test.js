let request = require('supertest');
let app = require('../../app');
const {clearnTable, checkPayloadWithResponse} = require('../../helpers/database');

describe("receipts route tests", () => {
    const agent = request(app);
    
    beforeAll(async () => {
        await clearTable('receipts');
    })

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("GET /receipts when no receipts exist", async () => {
        await agent
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
        await agent
            .post("/receipts/add")
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

    it("GET /receipts/:id - get a receipt by ID", async () => {
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
        await agent
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
        await agent
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
    });

    it("PUT /receipts/:id/update - update a receipt", async () => {
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
        await agent
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
        await agent
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
    });

    it("DELETE /receipts/:id/delete - delete a existing receipt", async () => {
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
        await agent
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
        await agent
            .delete(`receipts/${receipt_id}/delete`)
            .expect(200)
            .then(response => {
                expect(response.body.msg).toBe('Receipt deleted successfully.');
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
        
        // After receipt is deleted, get by id should not return anything
        await agent
            .get(`/receipts/${receipt_id}`)
            .expect(404)
            .catch((err) => {
                expect(err).toBe(null);
            });
    });
});