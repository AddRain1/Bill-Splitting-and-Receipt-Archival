let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

describe("user route tests", () => {
    request = request(app);  
    
    beforeAll(async () => {
        await clearTable('users');
    })

    beforeEach(() => {
        jest.useRealTimers();
    })
  
    it("get /users when no users exists", async () => {
      await request
        .get("/users")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {                          
          expect(response.body.length).toBe(0)
        })
        .catch((err) => {
          expect(err).toBe(null);
        });
    });

    it("Send a valid user to create through /users/add", async () => {
        const payload = {
            username:'bob123', 
            first_name:'bob', 
            last_name: 'bobbyson', 
            email:'bobbobbyson@gmail.com', 
            password:'password',
            profile_description: 'hello'
        }
        await request
          .post("/users/add")
          .send(payload)
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

    it("Attempt to create a user with a taken username through /users/add", async () => {
        const payload = {
            username:'bob123', 
            first_name:'bob', 
            last_name: 'bobbyson', 
            email:'bobbobbyson@gmail.com', 
            password:'password',
            profile_description: 'hello'
        }
        await request
          .post("/users/add")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400)
    });

    it("Attempt to create a user with an email that is already in use through /users/add", async () => {
        const payload = {
            username:'bob123', 
            first_name:'bob', 
            last_name: 'bobbyson', 
            email:'bobbobbyson@gmail.com', 
            password:'password',
            profile_description: 'hello'
        }
        await request
          .post("/users/add")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400)
    });

    it("Attempt to create a user with a password that is too short", async () => {
        const payload = {
            username:'janeTheSane', 
            first_name:'jane', 
            last_name: 'doe', 
            email:'janedoe@gmail.com', 
            password:'pw',
            profile_description: 'Please stop breaking into my account'
        }
        await request
          .post("/users/add")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400)
    });

    let firstUserAdded;
    it("Check that only one user has been added to the database", async () => {
        await request
          .get("/users")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {                          
            expect(response.body.length).toBe(1)
            firstUserAdded = response.body[0];
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Get a user by ID", async () => {
        await request
          .get("/users/" + firstUserAdded.user_id)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {        
            const body = JSON.parse(response.body)[0];              
            expect(checkPayloadWithResponse(firstUserAdded, body)).toBeTruthy();
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });
});