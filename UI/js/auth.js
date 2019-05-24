/* eslint-disable no-restricted-globals */
// Api URL
const api = 'http://localhost:8080/api/v1/';

// Alert message
class Message {
  constructor(message) {
    this.message = message;
  }

  alertMessage(status) {
    const displayMessage = document.querySelector('#message');
    displayMessage.setAttribute('style', 'display: block;');
    displayMessage.innerHTML = this.message;
    displayMessage.removeAttribute('class');
    displayMessage.classList.add(`${status}`);
    displayMessage.classList.add('fade-out-delay');
    setTimeout(() => {
      displayMessage.setAttribute('style', 'display: none;');
    }, 4000);
  }
}

// Handle sign up
const registerBtn = document.querySelector('#register');
if (registerBtn) {
  registerBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstname = document.querySelector('#firstname').value;
    const lastname = document.querySelector('#lastname').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    fetch(`${api}auth/signup`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
      }),
    }).then(resp => resp.json())
      .then((res) => {
        if (res.data) {
          const user = JSON.stringify(res.data);
          sessionStorage.setItem('user', user);
          const signedUp = new Message('Sign up successful');
          setTimeout(() => {
            location.assign('/dashboard.html');
          }, 2000);
          return signedUp.alertMessage('success');
        }
        const signedUp = new Message(res.error);
        return signedUp.alertMessage('error');
      }).catch((err) => {
        const signedUp = new Message(err);
        return signedUp.alertMessage('error');
      });
  });
}

// Handle sign in
const signinBtn = document.querySelector('#signin');
if (signinBtn) {
  signinBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    fetch(`${api}auth/signin`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(resp => resp.json())
      .then((res) => {
        if (res.data) {
          const user = JSON.stringify(res.data);
          sessionStorage.setItem('user', user);
          const signedin = new Message('Sign In successful');
          if (res.data.type === 'client') {
            setTimeout(() => {
              location.assign('/dashboard.html');
            }, 2000);
          } else if (res.data.type === 'staff' && res.data.isadmin === false) {
            setTimeout(() => {
              location.assign('/dashboard-staff.html');
            }, 2000);
          } else if (res.data.type === 'staff' && res.data.isadmin === true) {
            setTimeout(() => {
              location.assign('/dashboard-admin.html');
            }, 2000);
          }
          return signedin.alertMessage('success');
        }
        const signedin = new Message(res.error);
        return signedin.alertMessage('error');
      }).catch((err) => {
        const signedin = new Message(err);
        return signedin.alertMessage('error');
      });
  });
}
