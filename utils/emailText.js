const getEmailText = (link) => `
<p>Hi Akash,<br>
A password reset for your account was requested. Please click the button below to change your password.<br>
<br>
Note that this link is valid for 24 hours. After the time limit has expired, you will have to resubmit the request for a password reset.</p><br>
<a href=${link} clicktracking=off><button style="background: blue; color:white; padding:5px;">Reset Password</button></a>`;

module.exports = getEmailText;
