document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('form').onsubmit = submit;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  const emails_view = document.querySelector('#emails-view');
  emails_view.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Show the sent emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    emails.forEach(function(email) {
      let emailHTML = '';
      
      emailHTML += `<div class="emailStyle">`;
      emailHTML += `<div class="date">${email.timestamp}</div>`;
      emailHTML += `<div class="email_address">${email.recipients.join(', ')}</div>`;
      emailHTML += `<div class="subject">${email.subject}</div>`;
      emailHTML += `<div class="body">${email.body.substring(0, 50)}</div>`;
      emailHTML += `</div>`;
      emails_view.innerHTML += emailHTML;
      console.log(emails_view.innerHTML);
    })
  })
  .catch(error => {
   console.log('Error:', error);
  });
}

function submit() {

  //make POST request to /emails and create a JSON object values for recipients, subject and body
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })  
  .then(response => response.json())
  .then(result => {
    load_mailbox('sent'); 
  })
  // Catch any errors and log them to the console
  .catch(error => {
    console.log('Error:', error);
  });
  // Prevent default submission
  return false;
}