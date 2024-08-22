let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

const friendsAPI = require('../../api/friendsAPI');

describe("User and auth routes", () => {
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
        await clearTable('`group`');
        await clearTable('user_group');
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

        
    }, 10000);

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("Get /friends when there is no friend", async () => {
        await request
        .get("/friends")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {                          
            expect(response.body.length).toBe(0)
        });

    }, 20000);
    
});