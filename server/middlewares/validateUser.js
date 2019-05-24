import Validator from 'validatorjs';
import customErrorMsgs from '../helpers/customErrorMsgs';

export default class userValidate {
  static login(req, res, next) {
    const user = req.body;

    const userProperties = {
      email: 'required|email|max:50',
      password: 'required|alpha_dash|min:6|max:16',
    };

    const validator = new Validator(user,
      userProperties,
      customErrorMsgs);

    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return res.status(400).json({
        status: 400,
        error: errors,
      });
    });
  }

  static client(req, res, next) {
    const client = req.body;

    const clientProperties = {
      firstname: 'required|alpha|min:2|max:50',
      lastname: 'required|alpha|min:2|max:50',
      email: 'required|email|max:50',
      password: 'required|alpha_dash|min:6|max:16',
    };

    const validator = new Validator(client, clientProperties, customErrorMsgs);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return res.status(400).json({
        status: 400,
        error: errors,
      });
    });
  }

  static staff(req, res, next) {
    const staff = req.body;

    const staffProperties = {
      firstname: 'required|alpha|min:2|max:50',
      lastname: 'required|alpha|min:2|max:50',
      email: 'required|email|max:50',
      password: 'required|alpha_dash|min:6|max:16',
      isAdmin: 'required|boolean',
    };

    const validator = new Validator(staff, staffProperties, customErrorMsgs);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return res.status(400).json({
        status: 400,
        error: errors,
      });
    });
  }

  static changePassword(req, res, next) {
    const user = req.body;

    const userProperties = {
      password: 'required|alpha_dash|min:6|max:16',
      newPassword: 'required|alpha_dash|min:6|max:16',
    };

    const validator = new Validator(user,
      userProperties,
      customErrorMsgs);

    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return res.status(400).json({
        status: 400,
        error: errors,
      });
    });
  }
}
