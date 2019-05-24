import User from '../models/userModel';
import { hashPassword, comparePassword } from '../helpers/bcrypt';
import Jwt from '../helpers/auth';

export default class UsersController {
  static async signUp(req, res) {
    const user = new User(req.body);

    user.password = hashPassword(user.password);

    const userExists = await User.getUserByEmail(user.email);
    if (userExists) {
      return res.status(409).json({
        status: 409,
        error: 'This email address is already taken.',
      });
    }
    let newUser;
    try {
      newUser = await user.signUp();
    } catch (error) {
      return error.message;
    }

    const {
      id, firstname, lastname, email,
      type, isadmin,
    } = newUser;

    const token = await Jwt.generateToken({
      id, email, type, isadmin, firstname, lastname,
    });

    const response = {
      token, id, firstname, lastname, email,
    };
    return res.status(201).json({
      status: 201,
      data: response,
    });
  }

  static async createStaff(req, res) {
    const user = new User(req.body);

    user.password = hashPassword(user.password);

    const userExists = await User.getUserByEmail(user.email);
    if (userExists) {
      return res.status(409).json({
        status: 409,
        error: 'This email address is already taken.',
      });
    }

    let newUser;
    try {
      newUser = await user.createStaff();
    } catch (error) {
      return error.message;
    }

    const {
      id, firstname, lastname, email,
      type, isadmin,
    } = newUser;

    const token = await Jwt.generateToken({
      id, email, type, isadmin, firstname, lastname,
    });

    const response = {
      token, id, firstname, lastname, email,
    };

    return res.status(201).json({
      status: 201,
      data: response,
    });
  }

  static async createAdmin(req, res) {
    const user = new User(req.body);

    user.password = hashPassword(user.password);

    const userExists = await User.getUserByEmail(user.email);
    if (userExists) {
      return res.status(409).json({
        status: 409,
        error: 'This email address is already taken.',
      });
    }

    let newUser;
    try {
      newUser = await user.createAdmin();
    } catch (error) {
      return error.message;
    }
    const {
      id, firstname, lastname, email,
      type, isadmin,
    } = newUser;

    const token = await Jwt.generateToken({
      id, email, type, isadmin, firstname, lastname,
    });

    const response = {
      token, id, firstname, lastname, email,
    };

    return res.status(201).json({
      status: 201,
      data: response,
    });
  }

  static async signin(req, res) {
    const { email, password } = req.body;

    let result;
    try {
      result = await User.signin(email);
    } catch (error) {
      return error.message;
    }

    if (!result) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid username/password',
      });
    }

    const { password: userPassword } = result;
    if (!comparePassword(password, userPassword)) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid username/password',
      });
    }

    const {
      id, firstname, lastname,
      type, isadmin,
    } = result;

    const token = await Jwt.generateToken({
      id, email, type, isadmin, firstname, lastname,
    });

    const response = {
      token, id, firstname, lastname, email, type, isadmin,
    };

    return res.status(200).json({
      status: 200,
      data: response,
    });
  }

  static async allUserAccounts(req, res) {
    const { email } = req.params;

    const userExists = await User.getUserByEmail(email);
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        error: 'User not found.',
      });
    }
    let result;
    try {
      result = await User.allUserAccounts(email);
    } catch (error) {
      return error.message;
    }
    if (!result.length) {
      return res.status(404).json({
        status: 404,
        error: 'User has no account.',
      });
    }
    const results = result.map((rest) => {
      const {
        createdon, accountnumber, type, status, balance,
      } = rest;
      return {
        createdon, accountnumber, type, status, balance,
      };
    });
    return res.status(200).json({
      status: 200,
      accounts: results,
    });
  }

  static async changePassword(req, res) {
    const userId = req.user.id;
    const { password } = await User.getUserById(userId);
    const isValid = comparePassword(req.body.password, password);
    if (!isValid) {
      return res.status(401).json({
        status: res.statusCode,
        error: 'Invalid username/password',
      });
    }
    const newPassword = hashPassword(req.body.newPassword);
    await User.changePassword(userId, newPassword);
    return res.status(200).json({
      status: res.statusCode,
      message: 'Password Changed Successfully',
    });
  }

  static async getAllUsers(req, res) {
    const users = await User.getAllUsers();
    const { type } = req.user;
    if (type !== 'client') {
      if (!users.length) {
        return res.status(200).json({
          status: 200,
          data: {},
        });
      }
      const results = users.map((result) => {
        const {
          id,
          firstname,
          lastname,
          email,
        } = result;
        return {
          id,
          firstname,
          lastname,
          email,
        };
      });
      return res.status(200).json({
        status: 200,
        data: results,
      });
    }
    return res.status(401).json({
      status: 401,
      error: 'You are not authorized to view all users',
    });
  }

  static async deleteUser(req, res) {
    const { email } = req.params;
    const { deleteUser } = User;
    const userExists = await User.getUserByEmail(email);
    if (!userExists) {
      return res.status(404).json({
        status: 404,
        error: 'User not found',
      });
    }
    await deleteUser(email);
    return res.status(200).json({
      status: 200,
      message: 'Account successfuly deleted',
    });
  }
}
