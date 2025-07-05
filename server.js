import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // ✅ static files served from 'public'

// POST route to handle email sending
app.post('/send', async (req, res) => {
    const { email, salutation } = req.body;

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions = {
            from: `"Ishwar Verma" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Application for Frontend Web Developer Role',
            html: `
                <p>Dear ${salutation},</p>
                <p>I hope you're doing well.</p>
                <p>I'm Ishwar Verma, currently in my final year of BCA from Guru Jambheshwar University. 
                I specialize in frontend development with hands-on experience in React.js, JavaScript, Tailwind CSS, HTML5, 
                and responsive UI design. I'm passionate about building fast, user-friendly web interfaces and always eager 
                to learn and contribute.</p>
                <p>Please find my CV attached for your kind consideration. I’d be grateful if you could consider me for 
                any suitable opportunities in frontend development.</p>
                <p>Looking forward to your response.</p>
                <p>Best regards,<br>
                Ishwar Verma<br>
                [Mobile Number]<br>
                https://www.linkedin.com/in/ishwar-verma/</p>  
            `,
            attachments: [
                {
                    filename: 'cv.pdf',
                    path: path.join(__dirname, 'cv.pdf')
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        res.redirect('/?success=' + encodeURIComponent(`Email sent successfully to ${email}`));
    } catch (err) {
        console.error("Email send error:", err);
        res.redirect('/?error=' + encodeURIComponent('Failed to send email. Please try again.'));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

