import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const __dirname = path.resolve();

app.post('/send', (req, res) => {
    const { email } = req.body;

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
            <p>Dear Sir/Madam,</p>

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
            [Number]<br>
            [Linkdin profile]/</p>  
        `,
        attachments: [
            {
                filename: 'cv.pdf',
                path: path.join(__dirname, 'cv.pdf')
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.send(`<p style='color:red;'>Error sending mail: ${error}</p>`);
        }
        res.send(`<p style='color:green;'>Email sent successfully to ${email}</p>`);
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
