let request = require("supertest");
let app = require("../../app");
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

const friendsAPI = require('../../api/friendsAPI');
const usersAPI = require('../../api/usersAPI');

describe("friends route", () => {
    request = request.agent(app);  

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
        await clearTable('friends');
        //Create users
        await request
          .post("/auth/signup")
          .send(user1_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await request
          .post("/auth/signup")
          .send(user2_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await request
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
        await request
          .post("/auth/login")
          .send(payload)
          .expect("Content-Type", /json/)
          .expect(200)

        
    }, 20000);

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("Get /friends when there is no friend", async () => {
        await request
            .get("/friends")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {       
                const empty = JSON.stringify([]);                  
                expect(response.body).toBe(empty);
            });

    }, 10000);

    it("Add friends /friends/add", async () => {
        const users = await usersAPI.getUsers();
        const user_ids = users.map(u => u.user_id);
        console.log(user_ids);
        const payload = {
            requestor_id: user_ids[0],
            receiver_id: user_ids[1],
            is_confirmed: false
        };
        console.log(payload);
        await request
            .post("/friends/add")
            .send(payload)
            .expect(200)
            .then((response) => {
                const body = response.body;
                console.log(payload.requestor_id);
                console.log(body.requestor_id);
                expect(payload.requestor_id).toBe(body.requestor_id);
                expect(payload.receiver_id).toBe(body.receiver_id);
                expect(payload.is_confirmed).toBe(body.is_confirmed);
            })
            // .catch((err) => {
            //     expect(err).toBe(null);
            // });

    }, 10000);
    
});