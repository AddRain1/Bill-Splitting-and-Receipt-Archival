let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const usersAPI = require('../../api/usersAPI');
const bcrypt = require('bcrypt');

describe("User and auth routes", () => {
    request = request.agent(app);  
    
    beforeAll(async () => {
        await clearTable('users');
    })

    beforeEach(() => {
        jest.useRealTimers();
    })

    //Stores payload of created users
    const createdUsers = [];
  
    it("Check initial users table is empty", async () => {
        const users = await usersAPI.getUsers();
        expect(users.length).toBe(0);
    });

    it("POST a valid user to create", async () => {
        const payload = {
            username:'bob123', 
            first_name:'bob', 
            last_name: 'bobbyson', 
            email:'bobbobbyson@gmail.com', 
            password:'password',
            profile_description: 'hello'
        }
        createdUsers.push(payload);

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

    it("Attempt to create a user with a taken username", async () => {
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
    }); 

    it("GET users before logging in", async () => {
        await request
          .get("/users")
          .expect(401)
    });

    it("GET user by ID before logging in", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[0].user_id;
        await request
          .get("/users/" + userID)
          .expect(401)
    });

    it("Login with incorrect username", async () => {
        const payload = {
            username: 'incorrect',
            password: createdUsers[0].password
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect(302)
    });

    it("Login with incorrect password", async () => {
        const payload = {
            username: createdUsers[0].username,
            password: 'incorrect'
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect(302)
    });

    it("Login with correct username/password", async () => {
        const payload = {
            username: createdUsers[0].username,
            password: createdUsers[0].password
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {     
            const body = response.body;      
            expect(createdUsers[0].username).toBe(body.username);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("GET users when only one is in database", async () => {
        await request
          .get("/users")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {                          
            expect(response.body.length).toBe(1);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("GET a user by ID", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[0].user_id;
        await request
          .get("/users/" + userID)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {        
            const body = JSON.parse(response.body);    
            expect(createdUsers[0].username).toBe(body.username);
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
        createdUsers.push(payload);

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

    it("GET when two users are in the database", async () => {
        await request
          .get("/users")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {                          
            expect(response.body.length).toBe(2);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Attempt to update a user that we are not logged in as", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[1].user_id;

        const payload = {
            profile_description: 'entirely new'
        }

        await request
          .post("/users/" + userID + '/update')
          .send(payload)
          .expect(401)
    });

    it("Update the profile description of a user we are logged in as", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[0].user_id;

        const payload = {
            profile_description: 'entirely new'
        }

        await request
          .post("/users/" + userID + '/update')
          .send(payload)
          .expect(200)
          .then(() => {           
            usersAPI.getUserByID(userID)
                .then(user => expect(user.profile_description).toBe(payload.profile_description));
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Update the password of a user we are logged in as with an incorrect old password", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[0].user_id;

        const payload = {
            old_password: 'incorrect',
            new_password: 'newvalidpassword'
        }

        await request
          .post("/users/" + userID + '/update')
          .send(payload)
          .expect(400)
    }, 8000);

    it("Update the password of a user we are logged in as with a correct old password", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[0].user_id;

        const payload = {
            old_password: createdUsers[0].password,
            new_password: 'newvalidpassword'
        }

        createdUsers[0].password = payload.new_password;

        await request
          .post("/users/" + userID + '/update')
          .send(payload)
          .expect(200)
    }, 8000);

    it("Log out", async () => {
        await request
          .post("/auth/logout")
          .expect(200)
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Login using new password", async () => {
        const payload = {
            username: createdUsers[0].username,
            password: createdUsers[0].password
        }
        await request
          .post("/auth/login")
          .send(payload)
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {     
            const body = response.body;      
            expect(createdUsers[0].username).toBe(body.username);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Attempt to delete a user that we are not logged in as", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[1].user_id;

        await request
          .post("/users/" + userID + '/delete')
          .expect(401)
    });

    it("Delete a user that we are logged in as", async () => {
        const users = await usersAPI.getUsers();
        const userID = users[0].user_id;

        await request
          .post("/users/" + userID + '/delete')
          .expect(200)
          .then(() => {
            usersAPI.getUsers()
                .then(users => expect(users.length).toBe(1));
          })
    });
});