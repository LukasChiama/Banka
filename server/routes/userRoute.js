import { Router } from 'express';
import userController from '../controllers/userController';
import { requireAuth, staffAuth, adminAuth } from '../middlewares/authentication';
import userValidate from '../middlewares/validateUser';
import paramsValidate from '../middlewares/validateParams';

const userRouter = new Router();
const {
  signUp,
  signin,
  allUserAccounts,
  getAllUsers,
  changePassword,
} = userController;

userRouter.post('/auth/signup', userValidate.client, signUp);

userRouter.post('/auth/signin', userValidate.login, signin);

userRouter.post('/auth/signup/staff', requireAuth, adminAuth, userValidate.login, signUp);

userRouter.post('/auth/signup/admin', requireAuth, adminAuth, userValidate.login, signUp);

userRouter.patch('/auth/change-password', requireAuth, userValidate.changePassword, changePassword);

userRouter.get(
  '/user/:email/accounts',
  requireAuth,
  staffAuth,
  paramsValidate.email,
  allUserAccounts,
);

userRouter.get('/users', requireAuth, staffAuth, getAllUsers);

export default userRouter;
