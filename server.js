import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/send', async (req, res) => {
    const { email, salutation, position, cv } = req.body;

    try {
        const emails = email.split(',')
            .map(e => e.trim())
            .filter(e => e.length > 0);

        let subject = `Application for ${position} Role`;
        let body = "";

        if (position === "Frontend Developer") {
            body = `
                <p>Dear ${salutation},</p>
                <p>I hope you're doing well.</p>
                <p>I'm Ishwar Verma, a frontend specialist with expertise in React.js, JavaScript, Tailwind CSS, and crafting responsive UI designs.</p>
                <p>I love building pixel-perfect, fast and interactive web interfaces. Please find my CV attached for your kind consideration.</p>
                <p>Looking forward to connecting with you regarding frontend roles.</p>
                <p>Best regards,<br>
                Ishwar Verma<br>
                [Mobile Number]<br>
                https://www.linkedin.com/in/ishwar-verma/</p>
            `;
        } else if (position === "Backend Developer") {
            body = `
                <p>Dear ${salutation},</p>
                <p>I hope you're doing well.</p>
                <p>I'm Ishwar Verma, passionate about building robust backend systems with Node.js, Express, and secure API design.</p>
                <p>I enjoy solving complex problems and ensuring scalable backend architectures. Please find my CV attached for your kind consideration.</p>
                <p>Looking forward to opportunities in backend development.</p>
                <p>Best regards,<br>
                Ishwar Verma<br>
                [Mobile Number]<br>
                https://www.linkedin.com/in/ishwar-verma/</p>
            `;
        } else if (position === "Full Stack Developer") {
            body = `
                <p>Dear ${salutation},</p>
                <p>I hope you're doing well.</p>
                <p>I'm Ishwar Verma, a full stack developer skilled in building complete web applications from scratch using MERN stack.</p>
                <p>I love working on both frontend aesthetics and backend logic to deliver seamless user experiences. Please find my CV attached for your kind consideration.</p>
                <p>Looking forward to any suitable full stack roles in your esteemed organization.</p>
                <p>Best regards,<br>
                Ishwar Verma<br>
                [Mobile Number]<br>
                https://www.linkedin.com/in/ishwar-verma/</p>
            `;
        } else {
            body = `
                <p>Dear ${salutation},</p>
                <p>This is a general application for ${position} role. Kindly find my CV attached.</p>
                <p>Best regards,<br>
                Ishwar Verma<br>
                [Mobile Number]<br>
                https://www.linkedin.com/in/ishwar-verma/</p>
            `;
        }

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
            subject,
            html: body,
            attachments: [
                {
                    filename: cv,
                    path: path.join(__dirname, 'cv', cv)  // 🗂 Attach from /cv folder
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
