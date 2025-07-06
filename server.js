import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/send', async (req, res) => {
    const { email, salutation, position, cv, template } = req.body;

    try {
        // Process emails
        const emails = email.split(',')
            .map(e => e.trim())
            .filter(e => e.length > 0);

        // Read template file from /templates folder
        let templateContent = await fs.readFile(path.join(__dirname, 'templates', template), 'utf-8');

        // Replace placeholder {{salutation}} and {{position}}
        templateContent = templateContent
            .replace(/{{salutation}}/g, salutation)
            .replace(/{{position}}/g, position);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: `"Ishwar Verma" <${process.env.EMAIL_USER}>`,
            to: emails,
            subject: `Application for ${position} Role`,
            html: templateContent,
            attachments: [
                {
                    filename: cv,
                    path: path.join(__dirname, 'cv', cv)
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        res.redirect('/?success=' + encodeURIComponent(`Email sent for ${position} to: ${emails.join(', ')}`));
    } catch (err) {
        console.error("Email send error:", err);
        res.redirect('/?error=' + encodeURIComponent('Failed to send email. Please try again.'));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
