import { hashPassword } from '../helpers/bcrypt';
import pool from './index';

const seeds = [
  ['adebade@gmail.com', 'Ade', 'Bade', 'adepassword', 'staff', true],
  ['cadedade@gmail.com', 'Cade', 'Dade', 'cadepassword', 'staff', false],
  ['edefade@gmail.com', 'Ede', 'Fade', 'edepassword', 'client', false],
];

seeds.forEach(async (seed) => {
  const data = seed;
  data[3] = hashPassword(data[3]);
  try {
    const result = await pool.query(`INSERT INTO users (email, firstname, lastname, password, type, isadmin)
    VALUES ($1, $2, $3, $4, $5, $6)`, data);
    return result;
  } catch (error) {
    return error;
  }
});
