/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './server/index';
import {
  wrongAcctNo,
  wrongAccountType,
  emptyAccountType,
  accountType,
  clientField,
  adminField,
  staffField,
} from './tests/testData';

const { expect } = chai;
chai.use(chaiHttp);

let clientToken;
let staffToken;
let adminToken;
let clientAcct;

describe('ACCOUNT TEST DATA', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(clientField);

    clientToken = response.body.data.token;

    const userResponse = await chai
      .request(app)
      .post('/api/v1/accounts')
      .set({ Authorization: `Bearer ${clientToken}` })
      .send(accountType);

    clientAcct = userResponse.body.data.accountNumber;

    const adminresponse = await chai
      .request(app)
      .post('/api/v1/admin')
      .send(adminField);

    adminToken = adminresponse.body.data.token;

    const staffResponse = await chai
      .request(app)
      .post('/api/v1/staff')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(staffField);

    staffToken = staffResponse.body.data.token;
  });
});

describe('ACCOUNT TEST', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(clientField);
    console.log('>>>>>>>>>>token_for_response:', response);
    clientToken = response.body.data.token;

    const userResponse = await chai
      .request(app)
      .post('/api/v1/accounts')
      .set({ Authorization: `Bearer ${clientToken}` })
      .send(accountType);

    clientAcct = userResponse.body.data.accountNumber;

    const adminresponse = await chai
      .request(app)
      .post('/api/v1/admin')
      .send(adminField);

    adminToken = adminresponse.body.data.token;

    const staffResponse = await chai
      .request(app)
      .post('/api/v1/staff')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(staffField);

    staffToken = staffResponse.body.data.token;
  });

  describe('CREATE A BANK ACCOUNT', () => {
    it('it should successfully create a bank account', async (done) => {
      const res = await chai.request(app)
        .post('/api/v1/accounts')
        .set({ Authorization: `Bearer ${clientToken}` })
        .send(accountType);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.be.a('number');
      expect(res.body.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.be.an('object');
      done();
    }).timeout(5000);

    // it('it should return 400 if account type is empty', async () => {
    //   const res = await chai.request(app)
    //     .post('/api/v1/accounts')
    //     .set({ Authorization: `Bearer ${clientToken}` })
    //     .send(emptyAccountType);
    //   expect(res).to.have.status(400);
    //   expect(res.body).to.have.property('error');
    // });

    // it('it should return 400 if account type is wrong', async () => {
    //   const res = await chai.request(app)
    //     .post('/api/v1/accounts')
    //     .set({ Authorization: `Bearer ${clientToken}` })
    //     .send(wrongAccountType);
    //   expect(res).to.have.status(400);
    //   expect(res.body).to.have.property('error');
    // });

    // it('it should return 403 if unauthorized', async () => {
    //   const res = await chai.request(app)
    //     .post('/api/v1/accounts')
    //     .set({ Authorization: 'Bearer wrong token' })
    //     .send(accountType);
    //   expect(res).to.have.status(403);
    //   expect(res.body).to.have.property('error');
    // });
  });

  //   describe('TEST ACTIVATE/DEACTIVATE ACCOUNT', () => {
  //     it('it should successfully change account status', async () => {
  //       const res = await chai.request(app)
  //         .patch(`/api/v1/accounts/${clientAcct}`)
  //         .set({ Authorization: `Bearer ${staffToken}` });
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.have.property('status');
  //       expect(res.body.status).to.be.a('number');
  //       expect(res.body.status).to.equal(200);
  //       expect(res.body).to.be.an('object');
  //       expect(res.body).to.have.property('data');
  //       expect(res.body.data).to.be.an('object');
  //     });

  //     it('it should return 400 if account number is wrong', async () => {
  //       const res = await chai.request(app)
  //         .patch(`/api/v1/accounts/${wrongAcctNo}`)
  //         .set({ Authorization: `Bearer ${staffToken}` });
  //       expect(res).to.have.status(400);
  //       expect(res.body).to.have.property('error');
  //     });

  //     it('it should return 403 if unauthorized', async () => {
  //       const res = await chai.request(app)
  //         .patch(`/api/v1/accounts/${clientAcct}`)
  //         .set({ Authorization: 'Bearer wrong token' });
  //       expect(res).to.have.status(403);
  //       expect(res.body).to.have.property('error');
  //     });
  //   });

  //   describe('TEST GET SPECIFIC ACCOUNT', () => {
  //     it('it should successfully get a specific account', async () => {
  //       const res = await chai.request(app)
  //         .get(`/api/v1/accounts/${clientAcct}`)
  //         .set({ Authorization: `Bearer ${staffToken}` });
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.have.property('status');
  //     });

  //     it('it should return 400 if account number is wrong', async () => {
  //       const res = await chai.request(app)
  //         .get(`/api/v1/accounts/${wrongAcctNo}`)
  //         .set({ Authorization: `Bearer ${staffToken}` });
  //       expect(res).to.have.status(400);
  //       expect(res.body).to.have.property('error');
  //     });

  //     it('it should return 403 if unauthorized', async () => {
  //       const res = await chai.request(app)
  //         .get(`/api/v1/accounts/${clientAcct}`)
  //         .set({ Authorization: 'Bearer wrong token' });
  //       expect(res).to.have.status(403);
  //       expect(res.body).to.have.property('error');
  //     });
  //   });

  //   describe('TEST DELETE ACCOUNT', () => {
  //     it('it should successfully delete an account', async () => {
  //       const res = await chai.request(app)
  //         .delete(`/api/v1/accounts/${clientAcct}`)
  //         .set({ Authorization: `Bearer ${staffToken}` });
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.have.property('message');
  //     });

  //     it('it should return 400 if account number is wrong', async () => {
  //       const res = await chai.request(app)
  //         .delete(`/api/v1/accounts/${wrongAcctNo}`)
  //         .set({ Authorization: `Bearer ${staffToken}` });
  //       expect(res).to.have.status(400);
  //       expect(res.body).to.have.property('error');
  //     });

  //     it('it should return 403 if unauthorized', async () => {
  //       const res = await chai.request(app)
  //         .delete(`/api/v1/accounts/${clientAcct}`)
  //         .set({ Authorization: 'Bearer wrong token' });
  //       expect(res).to.have.status(403);
  //       expect(res.body).to.have.property('error');
  //     });
  //   });


  //   describe('TEST GET ALL ACCOUNTS', () => {
  //     it('it should successfully get all bank accounts', async () => {
  //       const res = await chai.request(app)
  //         .get('/api/v1/accounts')
  //         .set({ Authorization: `Bearer ${staffToken}` });
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.have.property('status');
  //       expect(res.body).to.have.property('data');
  //     });

//     it('it should return 403 if unauthorized', async () => {
//       const res = await chai.request(app)
//         .get('/api/v1/accounts')
//         .set({ Authorization: 'Bearer wrong token' });
//       expect(res).to.have.status(403);
//       expect(res.body).to.have.property('error');
//     });
//   });
});
