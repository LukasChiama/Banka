/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  wrongLogin,
  clientField3,
  clientField4,
  adminField3,
  staffField3,
  missingAdmin,
  missingClient,
  missingLogin,
  missingStaff,
  emptyAdmin,
  emptyClient,
  emptyLogin,
  emptyStaff,
  login,
  staffField4,
  staffField2,
  adminField4,
  adminField5,
} from './testData';

const { expect } = chai;
chai.use(chaiHttp);

let adminToken;
let staffToken;

describe('USER TEST DATA', () => {
  before(async () => {
    const response = await chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send(clientField3);

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
      .send(adminField3);

    adminToken = adminresponse.body.data.token;

    const staffResponse = await chai
      .request(app)
      .post('/api/v1/staff')
      .set({ Authorization: `Bearer ${adminToken}` })
      .send(staffField2);

    staffToken = staffResponse.body.data.token;
  });
});

describe('USER TEST', () => {
  describe('USER SIGNUP', () => {
    it('it should return 400 if there are missing fields', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(missingClient);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if the fields are empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(emptyClient);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('USER LOGIN', () => {
    it('it should return 400 if the login fields are empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(emptyLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if there is a missing field in login', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(missingLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if there inputs in fields are invalid', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(wrongLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('ADMIN CAN CREATE STAFF/ADMIN', () => {
    it('it should return 403 if unauthorized', async () => {
      const res = await chai.request(app)
        .post('/api/v1/staff')
        .set({ Authorization: 'Bearer wrongtoken' })
        .send(adminField4);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if there is a missing field in the create staff form', async () => {
      const res = await chai.request(app)
        .post('/api/v1/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(missingStaff);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if the create admin fields are empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(emptyAdmin);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if there is a missing field in the create admin form', async () => {
      const res = await chai.request(app)
        .post('/api/v1/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(missingAdmin);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if the create staff fields are empty', async () => {
      const res = await chai.request(app)
        .post('/api/v1/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(emptyStaff);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });
  });

  describe('TEST GET ALL USERS', () => {
    it('it should return 401 if you are not authorized', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/users')
        .set({ Authorization: 'Bearer wrong token' });
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('error');
    });
  });
});
