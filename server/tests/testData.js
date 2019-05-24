// params
const wrongAcctNo = {
  accountNumber: '1234',
};

const wrongTransactionId = {
  accountNumber: 'as2',
};

// user
const clientField = {
  email: 'testClient@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
};
const clientField2 = {
  email: 'testClient2@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
};
const clientField3 = {
  email: 'testClientbbbb2@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
};

const clientField4 = {
  email: 'testClienbbbbbbft2@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
};

const staffField = {
  firstname: 'Ade',
  lastname: 'Bade',
  email: 'adebade1@gmail.com',
  password: 'adebade1234',
  isadmin: false,
};

const staffField2 = {
  email: 'testStaff2@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
  isadmin: false,
};

const staffField3 = {
  email: 'testStaff3@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
  isadmin: false,
};

const staffField4 = {
  email: 'testStaff4@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
  isadmin: false,
};

const adminField = {
  firstname: 'Ade',
  lastname: 'Bade',
  email: 'adebade11@gmail.com',
  password: 'adebade1234',
  isadmin: true,
};

const adminField2 = {
  email: 'testAdmin2@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
  isadmin: true,
};

const adminField3 = {
  email: 'testAdmin3@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
  isadmin: true,
};
const adminField4 = {
  email: 'testAdmin4@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
  isadmin: true,
};
const adminField5 = {
  email: 'testAdmin5@gmail.com',
  password: 'asdfghjkl',
  firstname: 'Halle',
  lastname: 'Berry',
  isadmin: true,
};

const missingClient = {
  lastname: 'Bade',
  email: 'adebade3@gmail.com',
  password: 'adebade1234',
};

const missingStaff = {
  firstname: 'Ade',
  lastname: 'Bade',
  password: 'adebade1234',
  isadmin: false,
};

const missingAdmin = {
  firstname: 'Bade',
  email: 'adebade31@gmail.com',
  password: 'adebade1234',
  isadmin: true,
};
const emptyClient = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};

const emptyStaff = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  isadmin: '',
};

const emptyAdmin = {
  firstname: '',
  lastname: 'Bade',
  email: '',
  password: '',
  isadmin: '',
};

const emptyLogin = {
  email: '',
  password: '',
};

const missingLogin = {
  password: 'password',
};

const wrongLogin = {
  accountNumber: 'as2',
};

const login = {
  email: 'testClienbbbbbbft2@gmail.com',
  password: 'asdfghjkl',
};

// Account
const emptyAccountType = {
  type: '',
};

const accountType = {
  type: 'savings',
};

const wrongAccountType = {
  type: 'everyday account',
};

// Transaction
const emptytransaction = {
  amount: '',
};

const transaction = {
  amount: 10000,
};

const wrongTransactionAmount = {
  amount: '20K',
};

const clientTransfer = {
  id: 2,
  email: 'edefade@gmail.com',
  type: 'client',
  isadmin: false,
  firstname: 'Ede',
  lastname: 'Fade',
};

const newAccount = {
  owner: 2,
  owneremail: 'edefade@gmail.com',
  type: 'savings',
  balance: 0,
};

const newTrans = {
  amount: 10000,
  cashier: 2,
  oldbalance: 0,
  newbalance: 10000,
};

// testAdmin
const testAdmin = {
  firstname: 'Adeq',
  lastname: 'Badeww',
  email: 'adebadewww@gmail.com',
  password: 'adebade1234',
};

const missingtestAdmin = {
  lastname: 'Bade',
  email: 'adebade31@gmail.com',
  password: 'adebade1234',
  isadmin: true,
};

const emptyTestAdmin = {
  firstname: '',
  lastname: 'Bade',
  email: '',
  password: '',
  isadmin: '',
};

const realAdmin = {
  firstname: 'Ade',
  lastname: 'Bade',
  email: 'adebade@gmail.com',
  password: 'adepassword',
  isadmin: true,
};

export {
  wrongAcctNo,
  wrongTransactionId,
  wrongAccountType,
  wrongLogin,
  wrongTransactionAmount,
  clientField,
  adminField,
  staffField,
  missingAdmin,
  missingClient,
  missingLogin,
  missingStaff,
  missingtestAdmin,
  emptyAccountType,
  emptyAdmin,
  emptyClient,
  emptyLogin,
  emptyStaff,
  emptyTestAdmin,
  emptytransaction,
  login,
  accountType,
  transaction,
  testAdmin,
  clientField2,
  adminField2,
  staffField2,
  clientField3,
  clientField4,
  staffField3,
  staffField4,
  adminField3,
  adminField4,
  adminField5,
  clientTransfer,
  newAccount,
  newTrans,
  realAdmin,
};
