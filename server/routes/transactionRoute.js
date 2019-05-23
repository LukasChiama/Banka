import { Router } from 'express';
import transactionController from '../controllers/transactionController';
import { requireAuth, staffAuth, clientAuth } from '../middlewares/authentication';
import paramsValidate from '../middlewares/validateParams';
import transactionValidate from '../middlewares/validateTransaction';

const transactionRouter = new Router();

transactionRouter.post(
  '/:accountnumber/debit',
  requireAuth,
  staffAuth,
  paramsValidate.acctNo,
  transactionValidate.amount,
  transactionController.debit,
);

transactionRouter.post(
  '/:accountnumber/credit',
  requireAuth,
  staffAuth,
  paramsValidate.acctNo,
  transactionValidate.amount,
  transactionController.credit,
);

transactionRouter.post(
  '/transfer',
  requireAuth,
  clientAuth,
  transactionValidate.amount,
  transactionController.transfer,
);

transactionRouter.get(
  '/:id',
  requireAuth,
  paramsValidate.transId,
  transactionController.getTransaction,
);
export default transactionRouter;
