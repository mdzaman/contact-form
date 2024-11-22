// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Configure nodemailer with Hostgator SMTP
const transporter = nodemailer.createTransport({
    host: 'mail.looselycoupled.org',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email@looselycoupled.org',
        pass: 'your-password'
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate input
        const errors = {};
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        if (!subject) errors.subject = 'Subject is required';
        if (!message) errors.message = 'Message is required';
        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        // Send email
        await transporter.sendMail({
            from: `"Contact Form" <your-email@looselycoupled.org>`,
            to: 'firoze@looselycoupled.org',
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br>${message}</p>
            `
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
