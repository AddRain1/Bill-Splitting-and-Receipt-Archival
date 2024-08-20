let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const groupAPI = require('../../api/groupAPI');
const userAPI = require('../../api/usersAPI');

describe("Group routes", () => {
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

        
    }, 20000)

    /* afterAll(async () => {
        await clearTable('users');
        await clearTable('`group`');
        await clearTable('user_group');
    }) */

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("GET groups when none in the database", async () => {
        await request
          .get("/groups")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {                    
            expect(response.body.length).toBe(0);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Create a group with a single member", async () => {
        const payload = {
            name: 'self',
            description: 'just me',
            members: []
        }

        await request
          .post("/groups/add")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            const body = response.body;
            expect(payload.name).toBe(body.name);
            expect(payload.description).toBe(body.description);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Create a group with multiple members", async () => {
        const users = await userAPI.getUsers();
        const user_ids = users.map(u => u.user_id);
        const payload = {
            name: 'party',
            description: 'woo',
            members: user_ids
        }

        await request
          .post("/groups/add")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then(response => {
            const body = response.body;
            expect(payload.name).toBe(body.name);
            expect(payload.description).toBe(body.description);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Remove a member from a group as admin", async () => {
        const users = await userAPI.getUsers();
        const user_id = users[users.length - 1].user_id;

        const groups = await groupAPI.getGroups();
        const group_id = groups[groups.length - 1].group_id;

        const payload = {
            member: user_id
        }

        await request
          .post("/groups/" + group_id + '/members/remove')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then(async () => {
            const members = await groupAPI.getGroup_members(group_id);
            expect(members.length).toBe(2);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Add a member to a group as admin", async () => {
        const users = await userAPI.getUsers();
        const user_id = users[1].user_id;

        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        const payload = {
            member: user_id
        }

        await request
          .post("/groups/" + group_id + '/members/add')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then(async () => {
            const members = await groupAPI.getGroup_members(group_id);
            expect(members.length).toBe(2);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Update name and description of a group as admin", async () => {
        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        const payload = {
            name: 'other',
            description: 'no longer self'
        }

        await request
          .post("/groups/" + group_id + '/update')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then(async () => {
            const group = await groupAPI.getGroupByID(group_id);
            expect(group.name).toBe(payload.name);
            expect(group.description).toBe(payload.description);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Delete a group as admin", async () => {
        const groups = await groupAPI.getGroups();
        const initial_group_num = groups.length;
        const group_id = groups[0].group_id;

        await request
          .post("/groups/" + group_id + '/delete')
          .expect(200)
          .then(async () => {
            const group_list = await groupAPI.getGroups();
            expect(group_list.length).toBe(initial_group_num - 1);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("Update admin of a group as the admin", async () => {
        const users = await userAPI.getUsers();
        const user_id = users[1].user_id;

        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        const payload = {
            admin_id: user_id
        }

        await request
          .post("/groups/" + group_id + '/update')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
          .then(async () => {
            const group = await groupAPI.getGroupByID(group_id);
            expect(group.admin_id).toBe(payload.admin_id);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    //ACCESS
    it("Remove a member from a group without admin status", async () => {
        const users = await userAPI.getUsers();
        const user_id = users[1].user_id;

        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        const payload = {
            member: user_id
        }

        await request
          .post("/groups/" + group_id + '/members/remove')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(401)
    });

    it("Add a member to a group without admin status", async () => {
        const users = await userAPI.getUsers();
        const user_id = users[2].user_id;

        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        const payload = {
            member: user_id
        }

        await request
          .post("/groups/" + group_id + '/members/add')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(401)
    });

    it("Update name and description of a group without admin status", async () => {
        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        const payload = {
            name: 'new',
            description: 'entirely different group'
        }

        await request
          .post("/groups/" + group_id + '/update')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(401)
    });

    it("Delete a group without admin status", async () => {
        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        await request
          .post("/groups/" + group_id + '/delete')
          .expect(401)
    });

    it("Update admin of a group without admin status", async () => {
        const users = await userAPI.getUsers();
        const user_id = users[0].user_id;

        const groups = await groupAPI.getGroups();
        const group_id = groups[0].group_id;

        const payload = {
            admin_id: user_id
        }

        await request
          .post("/groups/" + group_id + '/update')
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(401)
    });
});   