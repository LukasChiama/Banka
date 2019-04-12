import UserModel from '../models/userModel';
import data from '../mock/mockData';
import { hashPassword, comparePassword, generateToken } from '../helpers/auth';

const { users } = data;

class Users {
  static async createUser(req, res) {
    const id = users.length + 1;
    const {
      firstName, lastName, email, password,
    } = req.body;
    const userExists = users.filter(user => user.email === email);
    if (userExists[0]) {
      res.status(409).json({
        status: 409,
        message: `The email address ${email} is already taken.`,
      });
    }
    const type = 'client';
    const isAdmin = false;
    const passwordHash = hashPassword(password);
    const token = generateToken({
      id, email, type, isAdmin,
    });
    const user = await new UserModel(id, email, firstName, lastName, passwordHash, type, isAdmin);
    users.push(user);
    const response = {
      token,
      id,
      firstname: firstName,
      lastname: lastName,
      email,
    };
    res.status(201).json({
      status: 201,
      data: response,
    });
  }

  static async signin(req, res) {
    const { email, password } = req.body;
    const user = users.filter(u => u.email === email);
    const result = user[0];
    if (!result) {
      res.status(404).json({
        status: 404,
        message: `We couldn't find an account for email: ${email}.`,
      });
    }
    const passwordHash = hashPassword(password);
    if (!comparePassword(result.password, passwordHash)) {
      res.status(401).json({
        status: 401,
        message: 'Incorrect password!',
      });
    }
    const {
      id, firstName, lastName, type, isAdmin,
    } = result;
    const token = generateToken({
      id, email, type, isAdmin,
    });
    const response = {
      token,
      id,
      firstname: firstName,
      lastname: lastName,
      email,
    };
    res.status(200).json({
      status: 200,
      data: response,
    });
  }

  static async createStaff(req, res) {
    const id = users.length + 1;
    const {
      firstName, lastName, email, password, isAdmin,
    } = req.body;
    const userExists = users.filter(user => user.email === email);
    if (userExists[0]) {
      res.status(409).json({
        status: 409,
        message: `The email address ${email} is already taken.`,
      });
    }
    const type = 'staff';
    const passwordHash = hashPassword(password);
    const token = generateToken({
      id, email, type, isAdmin,
    });

    const user = await new UserModel(id, email, firstName, lastName, passwordHash, type, isAdmin);
    users.push(user);
    const response = {
      token,
      id,
      firstname: firstName,
      lastname: lastName,
      email,
      isAdmin,
    };
    res.status(201).json({
      status: 201,
      data: response,
    });
  }
}
export default Users;
