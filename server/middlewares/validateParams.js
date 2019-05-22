import Validator from 'validatorjs';
import customErrorMsgs from '../helpers/customErrorMsgs';

export default class paramsValidate {
  static acctNo(req, res, next) {
    const acct = req.params;

    const acctProperties = {
      accountnumber: 'numeric|digits:9',
    };

    const validator = new Validator(acct,
      acctProperties,
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

  static transId(req, res, next) {
    const transId = req.params;

    const transIdProperties = {
      id: 'numeric|min:1|max:10000',
    };

    const validator = new Validator(transId,
      transIdProperties,
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

  static email(req, res, next) {
    const transId = req.params;

    const transIdProperties = {
      email: 'required|email|max:50',
    };

    const validator = new Validator(transId,
      transIdProperties,
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
