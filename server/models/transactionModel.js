class Transaction {
  constructor(id, accountNumber, amount, cashier, oldBalance) {
    this.id = id;
    this.createdOn = new Date(Date.now());
    this.type = 'debit';
    this.accountNumber = accountNumber;
    this.cashier = cashier;
    this.amount = amount;
    this.oldBalance = oldBalance;
    this.newBalance = 0.0;
  }
}
export default Transaction;
