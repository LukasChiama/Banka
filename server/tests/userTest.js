import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import {
  wrongLogin,
  clientField3,
  adminField3,
  missingAdmin,
  missingClient,
  missingLogin,
  missingStaff,
  emptyAdmin,
  emptyClient,
  emptyLogin,
  emptyStaff,
  staffField2,
  adminField4,
  accountType,
  clientField,
  realAdmin,
  clientTransfer,
  clientField2,
  existingEmail,
  seededAdmin,
} from './testData';
import Jwt from '../helpers/auth';

const { expect } = chai;
chai.use(chaiHttp);

/* global it, describe, before */

let adminToken;
let staffToken;
let clientToken;
let clientAcct;

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
    let token;
    before(async () => {
      token = await Jwt.generateToken(seededAdmin);
    });

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

    it('should sign users up if correct details are provided', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(clientField);
      expect(response).to.have.status(201);
      expect(response.body.data).to.have.property('token');
    });

    it('should not signup if email already exists', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(existingEmail);
      expect(response).to.have.status(409);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.equal('This email address is already taken.');
    });

    it('should sign up staff when admin makes request', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup/staff')
        .set('Authorization', `Bearer ${token}`)
        .send(clientField2);
      expect(response).to.have.status(201);
      expect(response.body.data).to.have.property('token');
    });

    it('should sign up admin when admin makes request', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/signup/admin')
        .set('Authorization', `Bearer ${token}`)
        .send(clientField3);
      expect(response).to.have.status(201);
      expect(response.body.data).to.have.property('token');
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
  });

  describe('ADMIN CAN CREATE STAFF/ADMIN', () => {
    it('it should return 403 if unauthorized', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup/staff')
        .set({ Authorization: 'Bearer wrongtoken' })
        .send(adminField4);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if there is a missing field in the create staff form', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(missingStaff);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if the create admin fields are empty', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(emptyAdmin);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if there is a missing field in the create admin form', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup/staff')
        .set({ Authorization: `Bearer ${adminToken}` })
        .send(missingAdmin);
      expect(res).to.have.status(403);
      expect(res).to.have.property('error');
    });

    it('it should return 403 if the create staff fields are empty', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/auth/signup/staff')
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
