let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

const payload = {
    receipt_id: '20240715000000',
    price: '23.46',
    payee: 'john'
};

const updatedPayload = {
    receipt_id: '20240715000000',
    price: '7.24',
    payee: 'john'
};

describe("item route tests", () => {
    const agent = request(app);  
    
    beforeAll(async () => {
        await clearTable('items');
    })

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
                const body = JSON.parse(response.text);
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
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
                const body = JSON.parse(response.text);
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
                const body = JSON.parse(response.text);
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
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
                const body = JSON.parse(response.text);
                item_id = body.item_id;
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        // Update the item
        await agent
            .put(`/items/${item_id}/update`)
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
                const body = JSON.parse(response.text);
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