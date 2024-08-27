let request = require('supertest');
const app = require('../../app');
const {clearTable, checkPayloadWithResponse} = require('../../helpers/database');
const paymentRequestAPI = require('../../api/paymentRequestAPI');
const userAPI = require('../../api/usersAPI');
const groupAPI = require('../../api/groupAPI');
const receiptAPI = require('../../api/receiptsAPI');

describe("Payment request routes", () => {
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
        await clearTable('payment_request');
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
      await clearTable('payment_request');
      await clearTable('`group`')
      await clearTable('receipts')
    }) */

    beforeEach(() => {
        jest.useRealTimers();
    })

    it("GET payment requests when none in database", async () => {
        await request
          .get("/paymentrequests")
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

    it("POST /paymentrequests/add - Offer payment with no receipt attached", async () => {
      const users = await userAPI.getUsers();
      const user_ids = users.map(u => u.user_id);
      const payload = {
          payer_id: user_ids[0], 
          receiver_id: user_ids[1],
          amount: 100,
          description: "hot cheetos"
      }
      await request
          .post("/paymentrequests/add")
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

    it("POST /paymentrequests/add - Ask for payment with no receipt attached", async () => {
      const users = await userAPI.getUsers();
      const user_ids = users.map(u => u.user_id);
      const payload = {
          payer_id: user_ids[1], 
          receiver_id: user_ids[0],
          amount: 100,
          description: "takis"
      }
      await request
          .post("/paymentrequests/add")
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

    it("POST /paymentrequests/add - Create payment request with valid receipt attached", async () => {
      const users = await userAPI.getUsers();
      const user_ids = users.map(u => u.user_id);

      const receipts = await receiptAPI.getReceipts();
      const receipt_ids = receipts.map(r => r.receipt_id);
      const payload = {
          payer_id: user_ids[0], 
          receiver_id: user_ids[1],
          amount: 250,
          description: "couch",
          receipt_id: receipt_ids[1]
      }
      await request
          .post("/paymentrequests/add")
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

    it("POST /paymentrequests/add - Attempt to create payment request when one user does not have access to the linked receipt", async () => {
      const users = await userAPI.getUsers();
      const user_ids = users.map(u => u.user_id);

      const receipts = await receiptAPI.getReceipts();
      const receipt_ids = receipts.map(r => r.receipt_id);
      const payload = {
          payer_id: user_ids[0], 
          receiver_id: user_ids[1],
          amount: 250,
          description: "couch",
          receipt_id: receipt_ids[0]
      }
      await request
          .post("/paymentrequests/add")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(401)
    });

    it("POST /paymentrequests/add - Attempt to create a payment request that does not involve signed in user", async () => {
      const users = await userAPI.getUsers();
      const user_ids = users.map(u => u.user_id);

      const payload = {
          payer_id: user_ids[1], 
          receiver_id: user_ids[2],
          amount: 1000,
          description: "just trust me",
      }
      await request
          .post("/paymentrequests/add")
          .send(payload)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .expect(400)
    });

it("POST /paymentrequests/update - As the payer, decline payment request" , async () => {
  const payment_requests = await paymentRequestAPI.getPaymentRequests();
  const payment_request_ids = payment_requests.map(p => p.payment_request_id);

  const payload = {
      is_declined: true,
  }
  await request
      .post("/paymentrequests/" + payment_request_ids[0] + "/update")
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

it("POST /paymentrequests/update - As the receiver, update information" , async () => {
  const payment_requests = await paymentRequestAPI.getPaymentRequests();
  const payment_request_ids = payment_requests.map(p => p.payment_request_id);
  
  const payload = {
      amount: 500,
      description: 'hot cheetos and takis'
  }
  await request
      .post("/paymentrequests/" + payment_request_ids[1] + "/update")
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

  it("POST /paymentrequests/delete - As the receiver, delete the payment request before it is completed" , async () => {
    const payment_requests = await paymentRequestAPI.getPaymentRequests();
    const payment_request_ids = payment_requests.map(p => p.payment_request_id);
    const initialLength = payment_requests.length;
    
    await request
        .post("/paymentrequests/" + payment_request_ids[1] + "/delete")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .then(async() => {
          const payment_requests = await paymentRequestAPI.getPaymentRequests();
            expect(payment_requests.length).toBe(initialLength - 1);
        })
        .catch((err) => {
            expect(err).toBe(null);
        });
  });

  it("POST /paymentrequests/delete - As the payer, attempt to delete the payment request before it is completed" , async () => {
    const payment_requests = await paymentRequestAPI.getPaymentRequests();
    const payment_request_ids = payment_requests.map(p => p.payment_request_id);
    
    await request
        .post("/paymentrequests/" + payment_request_ids[1] + "/delete")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401)
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

  it("GET payment requests when the user only has access through the group", async () => {
    await request
      .get("/paymentrequests")
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

  it("POST /paymentrequests/update - Attempt to update payment request in a viewable receipt but is unrelated to the user", async () => {
    const payment_requests = await paymentRequestAPI.getPaymentRequests();
    const payment_request_ids = payment_requests.map(p => p.payment_request_id);

    const payload = {
      description: 'lawn mowing'
    }
    
    await request
        .post("/paymentrequests/" + payment_request_ids[1] + "/update")
        .send(payload)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401)
  });

  it("POST /paymentrequests/delete - Attempt to delete payment request in a viewable receipt but is unrelated to the user", async () => {
    const payment_requests = await paymentRequestAPI.getPaymentRequests();
    const payment_request_ids = payment_requests.map(p => p.payment_request_id);
    
    await request
        .post("/paymentrequests/" + payment_request_ids[1] + "/delete")
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(401)
  });
});