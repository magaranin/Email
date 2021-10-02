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

function show_email(email_id, mailbox2){

  // Show the mailbox and hide other views
  document.querySelector('#email-detail').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  console.log(mailbox2)
  // Show the mailbox name
  const email_detail = document.querySelector('#email-detail');
  email_detail.innerHTML = `<h3>${mailbox2.charAt(0).toUpperCase() + mailbox2.slice(1)}</h3>`;

  //show the content of sent/received email
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      console.log(email_id);
      let email_detailHTML = '';  
      email_detailHTML += `<div class="emailStyle">`;
      email_detailHTML += `<div class="subject">${email.subject}</div>`;
      email_detailHTML += `<div class="senderAndTime">${email.sender}<br> ${email.timestamp}</div>`;
      email_detailHTML += `<div class="email_address">${email.recipients.join(', ')}</div>`;
      email_detailHTML += `<div class="body">${email.body}</div>`;
      if (email.archived === true) {
        email_detailHTML += `<button onclick="archive(${email.id}, false)">Unarchive</button>`;
      }
      else {
        email_detailHTML += `<button onclick="archive(${email.id}, true)">Archive</button>`;
      }
      email_detailHTML += `</div>`;
      console.log(email_detail.innerHTML);
      email_detail.innerHTML += email_detailHTML;

      //Show if email has been read 
      fetch(`/emails/${email_id}`, {
        method: "PUT",
        body:JSON.stringify({
          read: true
        })
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });  
}

function archive(email_id, archive_email) {
  //Show if email has been archive 
  fetch(`/emails/${email_id}`, {
    method: "PUT",
    body:JSON.stringify({
      archived: archive_email
    })
  })
  .then(() => load_mailbox("inbox"));  
}

function load_mailbox(mailbox1) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail').style.display = 'none';

  // Show the mailbox name
  const emails_view = document.querySelector('#emails-view');
  emails_view.innerHTML = `<h3>${mailbox1.charAt(0).toUpperCase() + mailbox1.slice(1)}</h3>`;

  //Show the sent emails
  fetch(`/emails/${mailbox1}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);
    emails.forEach(function(email) {
      let emailHTML = '';
      if (email.read === true) {
        emailHTML += `<div class="emailStyle emailRead" onclick="show_email(${email.id}, '${mailbox1}');">`;
      }
      else {
        emailHTML += `<div class="emailStyle" onclick="show_email(${email.id}, '${mailbox1}');">`;
      }
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