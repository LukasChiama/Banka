import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/index';

import {
  wrongAcctNo,
  wrongTransactionId,
  wrongTransactionAmount,
  clientField2,
  staffField2,
  accountType,
  transaction,
  emptytransaction,
  adminField2,
  clientTransfer,
  newAccount,
  newTrans,
} from './testData';
import Jwt from '../server/helpers/auth';
import Account from '../server/models/accountModel';
import Transaction from '../server/models/transactionModel';

const { expect } = chai;
chai.use(chaiHttp);

/* global it, describe, before */

let clientToken;
let staffToken;
let adminToken;
let clientAcct;

describe('TRANSACTION TEST DATA', () => {
  before(async () => {
    const respons = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(clientField2);

    clientToken = respons.body.data.token;

    const userRespons = await chai
      .request(app)
      .post('/api/v1/accounts')
      .set({ Authorization: `Bearer ${clientToken}` })
      .send(accountType);

    clientAcct = userRespons.body.data.accountNumber;

    const adminrespons = await chai
      .request(app)
      .post('/api/v1/admin')
      .send(adminField2);

    adminToken = adminrespons.body.data.token;

    const staffRespons = await chai
      .request(app)
      .post('/api/v1/staff')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(staffField2);

    staffToken = staffRespons.body.data.token;
  });
});

describe('TRANSACTION TEST', () => {
  it('it should return 403 if account number is wrong', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${wrongAcctNo}/debit`)
      .set({ Authorization: `Bearer ${staffToken}` })
      .send(transaction);
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if amount is not a positive number', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${clientAcct}/debit`)
      .set({ Authorization: `Bearer ${staffToken}` })
      .send(wrongTransactionAmount);
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if amount is empty', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${clientAcct}/debit`)
      .set({ Authorization: `Bearer ${staffToken}` })
      .send(emptytransaction);
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if if user is not authorized', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${clientAcct}/debit`)
      .set({ Authorization: 'Bearer wrongtoken' })
      .send(transaction);
    expect(res).to.have.status(403);
    expect(res).to.have.property('error');
  });
});

describe('CASHIER CAN CREDIT ACCOUNT', () => {
  it('it should return 403 if account number is wrong', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${wrongAcctNo}/credit`)
      .set({ Authorization: `Bearer ${staffToken}` })
      .send(transaction);
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if amount is not a positive number', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${clientAcct}/credit`)
      .set({ Authorization: `Bearer ${staffToken}` })
      .send(wrongTransactionAmount);
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if amount is empty', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${clientAcct}/credit`)
      .set({ Authorization: `Bearer ${staffToken}` })
      .send(emptytransaction);
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if if user is not authorized', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/transactions/${clientAcct}/credit`)
      .set({ Authorization: 'Bearer wrongtoken' })
      .send(transaction);
    expect(res).to.have.status(403);
    expect(res).to.have.property('error');
  });
});

describe('TEST GET TRANSACTION HISTORY', () => {
  it('it should return 403 if account number is wrong', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/transactions/${wrongAcctNo}`)
      .set({ Authorization: `Bearer ${staffToken}` });
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if unauthorized', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/transactions/${clientAcct}`)
      .set({ Authorization: 'Bearer wrong token' });
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });
});

describe('TEST GET SPECIFIC ACCOUNT TRANSACTION', () => {
  it('it should return 403 if transaction Id is wrong', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/transactions/${wrongTransactionId}`)
      .set({ Authorization: `Bearer ${staffToken}` });
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });

  it('it should return 403 if unauthorized', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/transactions/1')
      .set({ Authorization: 'Bearer wrong token' });
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('error');
  });
});

describe('TRANSACTIONS', () => {
  let userAccountNumber;
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'edefade@gmail.com', password: 'edepassword' });
    clientToken = response.body.data.token;

    const staffResponse = await chai
      .request(app)
      .post('/api/v1/auth/signin')
      .send({ email: 'cadedade@gmail.com', password: 'cadepassword' });
    staffToken = staffResponse.body.data.token;

    const userAccount = await chai
      .request(app)
      .post('/api/v1/accounts')
      .send({ type: 'savings' })
      .set({ Authorization: `Bearer ${clientToken}` });
    userAccountNumber = userAccount.body.data.accountNumber;
  });

  it('Should not let a user credit an account', async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/transactions/${userAccountNumber}/credit`)
        .set({ Authorization: `Bearer ${clientToken}` });
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('error');
    } catch (err) {
      throw new Error(err.message);
    }
  });

  it('Should not let a user debit an account', async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/transactions/${userAccountNumber}/debit`)
        .set({ Authorization: `Bearer ${clientToken}` });
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('error');
    } catch (err) {
      throw new Error(err.message);
    }
  });

  it('Should let a staff credit an account', async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/transactions/${userAccountNumber}/credit`)
        .send({ amount: 1200 })
        .set({ Authorization: `Bearer ${staffToken}` });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    } catch (err) {
      throw new Error(err.message);
    }
  });

  it('Should let a staff debit an account', async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/transactions/${userAccountNumber}/debit`)
        .send({ amount: 500 })
        .set({ Authorization: `Bearer ${staffToken}` });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    } catch (err) {
      throw new Error(err.message);
    }
  });

  it('Should not debit an account if the amount is greater than the balance', async () => {
    try {
      const res = await chai
        .request(app)
        .post(`/api/v1/transactions/${userAccountNumber}/debit`)
        .send({ amount: 10200 })
        .set({ Authorization: `Bearer ${staffToken}` });
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    } catch (err) {
      throw new Error(err.message);
    }
  });
});
describe('TEST TRANSFERS', () => {
  let token;
  let accNumber1;
  let accNumber2;

  before(async () => {
    token = await Jwt.generateToken(clientTransfer);
    const account = new Account(newAccount);
    const account1 = await account.createAccount();
    const account2 = await account.createAccount();
    accNumber1 = account1.accountnumber;
    accNumber2 = account2.accountnumber;
    const trans = new Transaction({
      ...newTrans,
      accountnumber: accNumber1,
    });
    await trans.credit(trans);
  });

  it('should fail for a wrong route', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/transactions/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sender: accNumber1,
        receiver: accNumber2,
        amount: 1000,
      });
    expect(response).to.have.status(404);
    expect(response.body.message).to.equal('Endpoint not found! Go to the homepage using: /api/v1');
  });

  it('should return an error for wrong account number', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/transactions/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sender: 999888,
        receiver: accNumber2,
        amount: 1000,
      });
    expect(response).to.have.status(404);
    expect(response.body.error).to.equal('Account does not exist.');
  });

  it('should return an error when debit amount is greater than balance', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/transactions/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sender: accNumber1,
        receiver: accNumber2,
        amount: 1000000,
      });
    expect(response).to.have.status(400);
    expect(response.body.error).to.equal('Insufficient funds');
  });

  it('should return an error when no token is provided', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/transactions/transfer')
      .set('Authorization', 'Bearer')
      .send({
        sender: accNumber1,
        receiver: accNumber2,
        amount: 10000,
      });
    expect(response).to.have.status(401);
    expect(response.body.error).to.equal('Access denied! Invalid token.');
  });

  it('should transfer funds between client accounts', async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/transactions/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sender: accNumber1,
        receiver: accNumber2,
        amount: 1000,
      });
    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Transfer of N1000 successful');
  });
});
