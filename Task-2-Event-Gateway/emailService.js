// emailService.js

require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to generate QR and send the email
async function sendQrCodeEmail(recipientEmail, participantName, uniqueToken) {
    try {
        // Generate the QR code as an image buffer
        const qrCodeBuffer = await QRCode.toBuffer(uniqueToken);

        const mailOptions = {
            from: `"Event Gateway" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: 'Your Event QR Code Ticket',
            html: `
                <h1>Hello, ${participantName}!</h1>
                <p>Thank you for registering for our event. Please find your unique QR code ticket below.</p>
                <p>Present this at the entrance for check-in.</p>
                <img src="cid:qrcodeimage" alt="Your QR Code Ticket">
                <p>See you at the event!</p>
            `,
            attachments: [
                {
                    filename: 'qrcode.png',
                    content: qrCodeBuffer,
                    cid: 'qrcodeimage'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${recipientEmail}`);

    } catch (error) { // <-- Braces were missing here
        console.error(`❌ Error sending email to ${recipientEmail}:`, error);
    }
}

module.exports = { sendQrCodeEmail };