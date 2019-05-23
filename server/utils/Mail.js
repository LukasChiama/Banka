export default class Mail {
  constructor(transaction, accountOwner, accountNumber, accountBalance) {
    this.transaction = transaction;
    this.accountOwner = accountOwner;
    this.accountNumber = accountNumber;
    this.accountBalance = accountBalance;
  }

  getMailOptions() {
    return {
      from: 'bankanigeriaplc@gmail.com',
      to: `${this.accountOwner.email}`,
      subject: `${this.transaction.type.charAt(0).toUpperCase()
        + this.transaction.type.slice(1)} alert for your Banka Account: ${this.accountNumber}`,
      html: `<h3>${this.transaction.type.charAt(0).toUpperCase()
        + this.transaction.type.slice(1)} Alert</h3><p>Hello ${
        this.accountOwner.firstname
      }, your account was ${this.transaction.type}ed with <bold>₦${
        this.transaction.amount
      }</bold> on ${this.transaction.createdon}. Your account balance is <bold>₦${
        this.accountBalance
      }</bold> <br></p><p>Thank you for banking with us <br></p><p> © Banka Inc. </p> <p>https://banka-app.herokuapp.com</p>`,
    };
  }
}
