import nodemailer from 'nodemailer';

export default class Mail {
  constructor(transaction, accountOwner, accountNumber, accountBalance) {
    this.transaction = transaction;
    this.accountOwner = accountOwner;
    this.accountNumber = accountNumber;
    this.accountBalance = accountBalance;
  }

  static transporter() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });
    return transporter;
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


  static resetPasswordTemplate(user, link) {
    const { firstname, email } = user;
    return {
      from: 'bankanigeriaplc@gmail.com',
      to: `${email}`,
      subject: 'Reset your Banka Password',
      html: `
      <h2 style="text-align:center"> Hey ${firstname},</h2>
<div style="background-color: #f9f9f9; text-align:center">
<p style="padding:20px 0 0 0">Someone requested a new password for your Banka account.</p><br>
<a style="background-color:green; padding:10px 20px; border:none;color:white; text-decoration:none" href="${link}">Reset Password</a><br><br>
<p>Link Expires in 30 Minutes</p>
<p style="color:red;font-style: italic;padding:20px">Ignore this message if you didn't make the request.</p>
</div>
      `,
    };
  }
}
