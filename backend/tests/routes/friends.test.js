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
        const payload = {
            requester_id: user_ids[0],
            receiver_id: user_ids[1],
            is_confirmed: false
        };
        await request
            .post("/friends/add")
            .send(payload)
            .expect(200)
            .then((response) => {
                const body = response.body;
                expect(Number(body.requester_id)).toBe(payload.requester_id);
                expect(Number(body.receiver_id)).toBe(payload.receiver_id);
                expect(Boolean(body.is_confirmed)).toEqual(payload.is_confirmed);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
            

    }, 10000);

    it("Update friend request's status by id to true /friends/:id/update", async () => {
        const users = await usersAPI.getUsers();
        const user_ids = users.map(u => u.user_id);
        
        await request
            .post('/friends/' + user_ids[1] + '/update')
            .expect(200)
            .then((response) => {
                const body = response.body;
                expect(Boolean(body.is_confirmed)).toBe(true);
                expect(Number(body.requester_id)).toBe(user_ids[0]);
                expect(Number(body.receiver_id)).toBe(user_ids[1]);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

    }, 10000);
    
    it("Get friend by id when after accepting friend request /friends/:id", async () => {
        const users = await usersAPI.getUsers();
        const user_ids = users.map(u => u.user_id);

        await request
            .get('/friends/' + user_ids[1])
            .expect(200)
            .then((response) => {
                const body = response.body;
                expect(Boolean(body.is_confirmed)).toBe(true);
                expect(Number(body.requester_id)).toBe(user_ids[0]);
                expect(Number(body.receiver_id)).toBe(user_ids[1]);
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    }, 10000);

    it("Delete friend by id /friends/:id/delete", async () => {
        const users = await usersAPI.getUsers();
        const user_ids = users.map(u => u.user_id);

        await request
            .get('/friends/' + user_ids[1] + '/delete')
            .expect(200)
            .expect("Content-Type", /json/)
            .then((response) => {
                expect(response.body).toBe("Friend deleted");
            })
            .catch((err) => {
                expect(err).toBe(null);
            });

        
    }, 10000);
});