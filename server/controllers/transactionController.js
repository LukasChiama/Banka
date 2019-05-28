import Transaction from '../models/transactionModel';
import Account from '../models/accountModel';
import User from '../models/userModel';
import Mail from '../utils/Mail';

const { getUserByEmail } = User;
const { getAccount } = Account;

export default class TransactionController {
  static async debit(req, res) {
    const { accountnumber } = req.params;
    const accountExists = await getAccount(accountnumber);
    if (!accountExists) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist.',
      });
    }
    const { balance, owneremail } = accountExists;
    // Get the owner of the account to send an email notification
    const accountOwner = await getUserByEmail(owneremail);
    delete accountOwner.password; // remove sensitive information
    let transaction;
    try {
      transaction = new Transaction(req.body);
    } catch (error) {
      return error.message;
    }

    if (balance < transaction.amount) {
      return res.status(400).json({
        status: 400,
        error: 'Insufficient funds',
      });
    }

    transaction.accountnumber = accountnumber;
    transaction.cashier = req.user.id;
    transaction.oldbalance = balance;
    transaction.newbalance = balance - Number(transaction.amount);

    const newTransaction = await transaction.debit();
    const {
      id, amount, cashier, type, newbalance,
    } = newTransaction;

    // Get email template and send email
    const emailNotification = new Mail(newTransaction, accountOwner, accountnumber, newbalance);
    Mail.transporter().sendMail(emailNotification.getMailOptions(), (err, info) => {
      if (err) return err;
      return info;
    });
    if (req.body.sender) return null;
    return res.status(201).json({
      status: 201,
      data: {
        transactionId: id,
        accountnumber,
        amount: parseFloat(amount),
        cashier,
        transactionType: type,
        accountBalance: String(newbalance),
      },
    });
  }

  static async credit(req, res) {
    const { accountnumber } = req.params;
    const accountExists = await getAccount(accountnumber);
    if (!accountExists) {
      return res.status(404).json({
        status: 404,
        error: 'Account does not exist.',
      });
    }
    const { balance, owneremail } = accountExists;
    // Get the owner of the account to send an email notification
    const accountOwner = await getUserByEmail(owneremail);
    delete accountOwner.password; // remove sensitive information
    let transaction;
    try {
      transaction = new Transaction(req.body);
    } catch (error) {
      return error.message;
    }

    transaction.accountnumber = accountnumber;
    transaction.cashier = req.user.id;
    transaction.oldbalance = balance;
    transaction.newbalance = balance + Number(transaction.amount);
    const newTransaction = await transaction.credit();
    const {
      id, amount, cashier, type, newbalance,
    } = newTransaction;

    // Get email template and send email
    const emailNotification = new Mail(newTransaction, accountOwner, accountnumber, newbalance);
    Mail.transporter().sendMail(emailNotification.getMailOptions(), (err, info) => {
      if (err) return err;
      return info;
    });
    if (req.body.receiver) return null;

    return res.status(201).json({
      status: 201,
      data: {
        transactionId: id,
        accountnumber,
        amount,
        cashier,
        transactionType: type,
        accountBalance: newbalance,
      },
    });
  }

  static async transfer(req, res) {
    const { receiver, sender, amount } = req.body;
    req.params.accountnumber = sender;
    const debit = await TransactionController.debit(req, res);
    if (debit) return null;
    req.params.accountnumber = receiver;
    const credit = await TransactionController.credit(req, res);
    if (credit) return null;
    return res.status(200).json({ message: `Transfer of N${amount} successful` });
  }

  static async getTransaction(req, res) {
    const { id } = req.params;

    const result = await Transaction.getTransaction(id);
    if (!result) {
      return res.status(404).json({
        status: 404,
        error: 'Transaction does not exist.',
      });
    }
    const {
      createdon, type, accountnumber, amount, oldbalance, newbalance,
    } = result;
    return res.status(200).json({
      status: 200,
      data: {
        transactionId: id,
        createdon,
        type,
        accountNumber: Number(accountnumber),
        amount,
        oldbalance,
        newbalance,
      },
    });
  }
}
