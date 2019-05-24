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
  clientField,
  realAdmin,
} from './testData';
import Jwt from '../helpers/auth';

const { expect } = chai;
chai.use(chaiHttp);

let adminToken;
let staffToken;

describe('GET BASE ROUTE', () => {
  it('should get the /api/v1 route', async () => {
    const response = await chai.request(app).get('/api/v1');
    expect(response).to.have.status(200);
    expect(response.body.message).to.equal('Welcome to Banka');
  });
});

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
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(missingClient);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if the fields are empty', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(emptyClient);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should signup user if all fields are given', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(clientField);
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('data');
    });

    it('it should not signup user if email already exists', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(clientField);
      expect(res).to.have.status(409);
      expect(res.body).to.have.property('error');
    });
  });

  describe('USER LOGIN', () => {
    it('it should return 400 if the login fields are empty', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(emptyLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if there is a missing field in login', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(missingLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should return 400 if there inputs in fields are invalid', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send(wrongLogin);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });

    it('it should sign in user if all fields are given', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({ email: clientField.email, password: clientField.password });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('data');
    });
  });

  describe('ADMIN CAN CREATE STAFF/ADMIN', () => {
    it('it should return 403 if unauthorized', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/staff')
        .set({ Authorization: 'Bearer wrongtoken' })
        .send(adminField4);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if there is a missing field in the create staff form', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(missingStaff);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if the create admin fields are empty', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(emptyAdmin);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if there is a missing field in the create admin form', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(missingAdmin);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if the create staff fields are empty', async () => {
      const res = await chai
        .request(app)
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
        .set({ Authorization: 'Bearer wrong token' })
        .send({ email: 'adebade@gmail.com' });
      expect(res).to.have.status(403);
      expect(res.body).to.have.property('error');
    });
  });

  describe('TEST DELETE A USER', () => {
    let token;
    before(async () => {
      token = await Jwt.generateToken(realAdmin);
    });
    it('It should return user does not exist with status of 200 if user is not found', async () => {
      const res = await chai
        .request(app)
        .get('/api/v1/users/email@mail.com')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'not found' });
      expect(res).to.have.status(404);
      expect(res).to.have.property('error');
    });
    it('It should return 200 if user is successfully deleted', async () => {
      const res = await chai
        .request(app)
        .delete('/api/v1/users/adebade@gmail.com')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'adebade@gmail.com' });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message');
    });
  });
});
