import { Router } from 'express';
import accountController from '../controllers/accountController';
import { requireAuth, staffAuth } from '../middlewares/authentication';
import paramsValidate from '../middlewares/validateParams';
import accountValidate from '../middlewares/validateAccount';

const accountRouter = new Router();
const {
  createAccount, changeStatus, deleteAccount,
  accountTransactionHistory, getAccount, getAllAccounts,
  dormantAccounts,
} = accountController;

accountRouter.post(
  '/',
  requireAuth,
  accountValidate.createAccount,
  createAccount,
);

accountRouter.patch('/:accountnumber',
  requireAuth,
  staffAuth,
  paramsValidate.acctNo,
  accountValidate.changeStatus,
  changeStatus);

accountRouter.delete('/:accountnumber',
  requireAuth,
  staffAuth,
  paramsValidate.acctNo,
  deleteAccount);

accountRouter.get('/:accountnumber/transactions',
  requireAuth,
  paramsValidate.acctNo,
  accountTransactionHistory);


export default accountRouter;
