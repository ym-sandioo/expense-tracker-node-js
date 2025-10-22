const nodemailer = require('nodemailer');

const mailerManager = async (to, subject, text) => {
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.mailtrap_user || "795f36e571bcc5",
            pass: process.env.mailtrap_pass || "5b426b607474f1"
        }
    });

    const mailOptions = {
        from: "info@expensetracker.com",
        to: to,
        subject: subject,
        html: `<p>${text}</p>`,
        text: text
    };

    try {
        await transport.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = mailerManager;