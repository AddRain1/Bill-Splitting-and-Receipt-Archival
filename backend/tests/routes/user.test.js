let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');

describe("User and auth routes", () => {
    request = request(app);  
    
    beforeAll(async () => {
        await clearTable('users');
    })

    beforeEach(() => {
        jest.useRealTimers();
    })

    //Stores user objects with hashed password.
    const createdUsers = [];
    //Stores the unhashed password of createdUser at the corresponding index
    const passwords = [];
  
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

    it("Send a valid user to create", async () => {
        const payload = {
            username:'bob123', 
            first_name:'bob', 
            last_name: 'bobbyson', 
            email:'bobbobbyson@gmail.com', 
            password:'password',
            profile_description: 'hello'
        }
        passwords.push(payload.password);

        await request
          .post("/auth/signup")
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

    /* it("Attempt to create a user with a taken username", async () => {
        const payload = {
            username:'bob123', 
            first_name:'bob', 
            last_name: 'bobbyson', 
            email:'bobbobbyson@gmail.com', 
            password:'password',
            profile_description: 'hello'
        }
        await request
          .post("/auth/signup")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400)
    });

    it("Attempt to create a user with an email that is already in use", async () => {
        const payload = {
            username:'bob123', 
            first_name:'bob', 
            last_name: 'bobbyson', 
            email:'bobbobbyson@gmail.com', 
            password:'password',
            profile_description: 'hello'
        }
        await request
          .post("/auth/signup")
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
          .post("/auth/signup")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400)
    }); */

    it("Check that only one user has been added to the database", async () => {
        await request
          .get("/users")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {                          
            expect(response.body.length).toBe(1);
            createdUsers.push(response.body[0]);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Get a user by ID", async () => {
        await request
          .get("/users/" + createdUsers[0].user_id)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {        
            const body = JSON.parse(response.body)[0];              
            expect(checkPayloadWithResponse(createdUsers[0], body)).toBeTruthy();
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    /* it("incorrect username", async () => {
        const payload = {
            username: 'incorrect',
            password: passwords[0]
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect(302)
    });

    it("incorrect password", async () => {
        const payload = {
            username: createdUsers[0].username,
            password: 'incorrect'
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect(302)
    }); */

    it("Correct user login", async () => {
        const payload = {
            username: createdUsers[0].username,
            password: passwords[0]
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {     
            const body = response.body;      
            expect(checkPayloadWithResponse(createdUsers[0], body)).toBeTruthy();
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Create a second valid user", async () => {
        const payload = {
            username:'user2', 
            first_name:'mable', 
            last_name: 'madison', 
            email:'mablemadison@gmail.com', 
            password:'securepassword',
            profile_description: 'goodbye'
        }
        passwords.push(payload.password);

        await request
          .post("/auth/signup")
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

    it("Check that two users are in the database", async () => {
        await request
          .get("/users")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {                          
            expect(response.body.length).toBe(2);
            createdUsers.push(response.body[1]);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Log out", async () => {
        await request
          .post("/auth/logout")
          .expect(200)
          .catch((err) => {
            expect(err).toBe(null);
          });
    });
});