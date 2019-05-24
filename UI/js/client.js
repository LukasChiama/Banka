/* eslint-disable no-restricted-globals */
const client = JSON.parse(sessionStorage.getItem('user'));

if (!client) {
  location.replace('/');
}

const firstname = document.querySelector('#firstname');
const lastname = document.querySelector('#lastname');
const email = document.querySelector('#email');

const firstnameForm = document.querySelector('.firstname');
const lastnameForm = document.querySelector('.lastname');
const emailForm = document.querySelector('.email');

firstname.innerHTML = client.firstname;
lastname.innerHTML = client.lastname;
email.innerHTML = client.email;

firstnameForm.innerHTML = client.firstname;
lastnameForm.innerHTML = client.lastname;
emailForm.innerHTML = client.email;
