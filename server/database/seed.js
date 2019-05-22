import { hashPassword } from '../helpers/bcrypt';
import pool from './index';

(async () => {
  const password = 'adepassword';
  const hashedPassword = hashPassword(password);
  let result;
  const params = ['adebade@gmail.com', 'Ade', 'Bade', hashedPassword, 'staff', true];
  try {
    result = await pool.query(`INSERT INTO users (email, firstname, lastname, password, type, isadmin)
      VALUES ($1, $2, $3, $4, $5, $6)`, params);

    return result;
  } catch (error) {
    return error;
  }
})();

(async () => {
  const password = 'cadepassword';
  const hashedPassword = hashPassword(password);
  let result;
  const params = ['cadedade@gmail.com', 'Cade', 'Dade', hashedPassword, 'staff', false];
  try {
    result = await pool.query(`INSERT INTO users (email, firstname, lastname, password, type, isadmin)
      VALUES ($1, $2, $3, $4, $5, $6)`, params);
    return result;
  } catch (error) {
    return error;
  }
})();

(async () => {
  const password = 'edepassword';
  const hashedPassword = hashPassword(password);
  let result;
  const params = ['edefade@gmail.com', 'Ede', 'Fade', hashedPassword, 'client', false];
  try {
    result = await pool.query(`INSERT INTO users (email, firstname, lastname, password, type, isadmin)
      VALUES ($1, $2, $3, $4, $5, $6)`, params);
    return result;
  } catch (error) {
    return error;
  }
})();
