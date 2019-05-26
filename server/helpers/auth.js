/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secretKey = process.env.secretKey;


export default class Jwt {
  static async generateToken(payload) {
    const token = await jwt.sign(payload, secretKey, { expiresIn: '14d' });
    return token;
  }

  static async verifyToken(token) {
    const decoded = await jwt.verify(token, secretKey);
    return decoded;
  }

  static async genResetPasswordToken(payload, oldPassworHash) {
    const token = await jwt.sign(payload, oldPassworHash, { expiresIn: '0.5h' });
    return token;
  }

  static async verifyRestPasswordToken(token, oldPassworHash) {
    const decoded = await jwt.verify(token, oldPassworHash);
    return decoded;
  }
}
