import pool from './index';
(async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        email text UNIQUE NOT NULL,
        firstname text NOT NULL,
        lastname text NOT NULL,
        password text NOT NULL,
        type text NOT NULL,
        isadmin BOOLEAN DEFAULT FALSE)`);

    await pool.query(`CREATE TABLE IF NOT EXISTS accounts(
        id SERIAL PRIMARY KEY,
        accountnumber BIGINT NOT NULL,
        createdon TIMESTAMPTZ DEFAULT NOW(),
        owner INT NOT NULL,
        type text NOT NULL,
        status text NOT NULL,
        balance FLOAT,
        owneremail text NOT NULL,
        FOREIGN KEY (owner) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (owneremail) REFERENCES users (email) ON DELETE CASCADE)`);

    await pool.query(`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        createdon TIMESTAMPTZ DEFAULT NOW(),
        type VARCHAR(20) NOT NULL,
        accountnumber BIGINT NOT NULL,
        cashier INT NOT NULL,
        amount FLOAT NOT NULL,
        oldbalance FLOAT NOT NULL,
        newbalance FLOAT NOT NULL,
        FOREIGN KEY (cashier) REFERENCES users (id) ON DELETE CASCADE)`);
  } catch (error) {
    return error;
  }
})();
