let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const expenseRateAPI = require('../../api/expenseRateAPI');
const userAPI = require('../../api/usersAPI');
const groupAPI = require('../../api/groupAPI');
const receiptAPI = require('../../api/receiptsAPI');

describe("Expense rate routes", () => {
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
        await clearTable('expense_rate');
        await clearTable('`group`')
        await clearTable('receipts')
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

        const group1_payload = {
          name: 'self',
          description: 'just me',
          members: []
        }
        const users = await userAPI.getUsers();
        const user_ids = users.map(u => u.user_id);
        const group2_payload = {
            name: 'party',
            description: 'woo',
            members: user_ids
        }

        await request
          .post("/groups/add")
          .send(group1_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await request
          .post("/groups/add")
          .send(group2_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)

        const groups = await groupAPI.getGroups();
        const group_ids = groups.map(g => g.group_id);
        const receipt1_payload = {
          group_id: group_ids[0],
          name: 'bobby',
          description: 'bobbys description',
          category: 'food',
          vendor: 'bobby inc'
        }
        const receipt2_payload = {
          group_id: group_ids[1],
          name: 'groceries',
          description: 'for the baking competition',
          category: 'food',
          vendor: 'walmart'
        }
        await request
          .post("/receipts/add")
          .send(receipt1_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        await request
          .post("/receipts/add")
          .send(receipt2_payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(200)
        
    }, 20000)

    /* afterAll(async () => {
      await clearTable('users');
      await clearTable('expense_rate');
      await clearTable('`group`')
      await clearTable('receipts')
    }) */

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("GET expense rates when none in database", async () => {
        await request
          .get("/expenserates")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((response) => {      
            const body = response.body;    
            expect(body.length).toBe(0);
          })
          .catch((err) => {
            expect(err).toBe(null);
          });
    });

    it("POST /expenserates/add - Create expense rate as receipt admin", async () => {
        const receipts = await receiptAPI.getReceipts();
        const receipt_ids = receipts.map(r => r.receipt_id);

        const payload = {
            receipt_id: receipt_ids[0],
            name: "Service charge",
            percentage: 2.5
        }
        await request
            .post("/expenserates/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("POST /expenserates/add - Create another expense rate as receipt admin", async () => {
        const receipts = await receiptAPI.getReceipts();
        const receipt_ids = receipts.map(r => r.receipt_id);

        const payload = {
            receipt_id: receipt_ids[1],
            name: "Service charge",
            percentage: 10.99
        }
        await request
            .post("/expenserates/add")
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .then(response => {
                const body = response.body;
                expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
            })
            .catch((err) => {
                expect(err).toBe(null);
            });
    });

    it("POST /expenserates/update - Update expense rate as receipt admin" , async () => {
    const expense_rates = await expenseRateAPI.getExpenseRates();
    const expense_rate_ids = expense_rates.map(e => e.expense_rate_id);

    const payload = {
        percentage: 0.5
    }
    await request
        .post("/expenserates/" + expense_rate_ids[0] + "/update")
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(async() => {
            const expense_rates = await expenseRateAPI.getExpenseRates();
            expect(parseFloat(expense_rates[0].percentage)).toBe(0.5)
        })
        .catch((err) => {
            expect(err).toBe(null);
        });
    });

  it("POST /expenserates/delete - Delete expense rate as the receipt admin" , async () => {
    const expense_rates = await expenseRateAPI.getExpenseRates();
    const expense_rate_ids = expense_rates.map(e => e.expense_rate_id);
    const initialLength = expense_rates.length;
    
    await request
        .post("/expenserates/" + expense_rate_ids[0] + "/delete")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(async() => {
          const expense_rate_list = await expenseRateAPI.getExpenseRates();
            expect(expense_rate_list.length).toBe(initialLength - 1);
        })
        .catch((err) => {
            expect(err).toBe(null);
        });
  });

  it("POST /expenserates/add - Create another expense rate as receipt admin", async () => {
    const receipts = await receiptAPI.getReceipts();
    const receipt_ids = receipts.map(r => r.receipt_id);

    const payload = {
        receipt_id: receipt_ids[0],
        name: "Service charge",
        percentage: 1
    }
    await request
        .post("/expenserates/add")
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
            const body = response.body;
            expect(checkPayloadWithResponse(payload, body)).toBeTruthy();
        })
        .catch((err) => {
            expect(err).toBe(null);
        });
});

  it("Logout and login as another user", async () => {
    //Login as the third created user
    const payload = {
        username: user3_payload.username,
        password: user3_payload.password
    }
    await request
      .post("/auth/logout")
      .expect(200)
    await request
      .post("/auth/login")
      .send(payload)
      .expect("Content-Type", /json/)
      .expect(200)
  });

  it("GET expense rates that they have access to but did not create", async () => {
    await request
      .get("/expenserates")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {      
        const body = response.body;      
        expect(body.length).toBe(1);
      })
      .catch((err) => {
        expect(err).toBe(null);
      });
  });

  it("POST /expenserates/add - Attempt to add expense rate without being admin to the receipt", async () => {
    const receipts = await receiptAPI.getReceipts();
    const receipt_ids = receipts.map(r => r.receipt_id);

    const payload = {
        receipt_id: receipt_ids[1],
        name: "Another service charge",
        percentage: 100
    }
    
    await request
        .post("/expenserates/add")
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401)
  });

  it("POST /expenserates/update - Attempt to update expense rate without being admin to the receipt", async () => {
    const expense_rates = await expenseRateAPI.getExpenseRates();
    const expense_rate_ids = expense_rates.map(e => e.expense_rate_id);

    const payload = {
      name: 'Ultra service charge'
    }
    
    await request
        .post("/expenserates/" + expense_rate_ids[1] + "/update")
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401)
  });

  it("POST /expenserates/delete - Attempt to delete expense rate without being admin to the receipt", async () => {
    const expense_rates = await expenseRateAPI.getExpenseRates();
    const expense_rate_ids = expense_rates.map(e => e.expense_rate_id);
    
    await request
        .post("/expenserates/" + expense_rate_ids[1] + "/delete")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401)
  });
});