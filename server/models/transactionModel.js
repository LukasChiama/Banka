import pool from '../database/index';

export default class Transaction {
  constructor(transaction) {
    this.id = transaction.id;
    this.createdon = new Date(Date.now());
    this.type = transaction.type;
    this.accountnumber = transaction.accountnumber;
    this.cashier = transaction.cashier;
    this.amount = transaction.amount;
    this.oldbalance = transaction.oldbalance;
    this.newbalance = transaction.newbalance;
  }

  async debit() {
    const queryString = `INSERT INTO transactions (accountnumber, createdon,
      cashier, type, amount, oldbalance, newbalance)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
      this.accountnumber, this.createdon, this.cashier,
      'debit', this.amount, this.oldbalance, this.newbalance,
    ];
    const { rows } = await pool.query(queryString, values);
    pool.query(`UPDATE accounts SET balance = ${this.newbalance} WHERE accountnumber = ${this.accountnumber}`);
    return rows[0];
  }

  async credit() {
    const queryString = `INSERT INTO transactions (accountnumber, createdon,
      cashier, type, amount, oldbalance, newbalance)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [
      this.accountnumber, this.createdon, this.cashier,
      'credit', this.amount, this.oldbalance, this.newbalance,
    ];
    const { rows } = await pool.query(queryString, values);
    pool.query(`UPDATE accounts SET balance = ${this.newbalance} WHERE accountnumber = ${this.accountnumber}`);
    return rows[0];
  }

  static async getTransaction(id) {
    const queryString = 'SELECT * FROM transactions WHERE id = $1';
    const values = [id];
    try {
      const { rows } = await pool.query(queryString, values);
      return rows[0];
    } catch (error) {
      return error.message;
    }
  }
}
