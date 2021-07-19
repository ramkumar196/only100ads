const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
let sendEmail = async function (fromEmail,toEmail,emailSubject,emailContent,emailHtmlContent) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "hollis21@ethereal.email", // generated ethereal user
      pass: "9NKBG6mm9EhWS71Y3k", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "hollis21@ethereal.email", // sender address
    to: "ram196kumar@gmail.com", // list of receivers
    subject: emailSubject, // Subject line
    text: emailContent, // plain text body
    html: emailHtmlContent, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = sendEmail;