let request = require("supertest");
let app = require("../../app");
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

describe("testing friends routes", () => {
    const agent = request.agent(app);

    beforeAll(async () => {
        await clearTable('friends');
    })

    beforeEach(async () => {
        jest.useRealTimers();
    })

    it("Get /friends when there is no friend", async () => {
        await agent
        .get("/friends")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {                          
            expect(response.body.length).toBe(0)
        });

    })
    
});