import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// MongoDB connect
mongoose.connect('mongodb://127.0.0.1:27017/jobmailer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch(err => {
    console.error("❌ MongoDB connection error:", err);
});

// Mongoose schema
const emailLogSchema = new mongoose.Schema({
    date: String,
    time: String,
    to: [String],
    position: String,
    cv: String,
    template: String,
    status: String,
    error_message: String
}, { timestamps: true });

const EmailLog = mongoose.model('EmailLog', emailLogSchema);

app.post('/send', async (req, res) => {
    const { email, salutation, position, cv, template } = req.body;

    try {
        const emails = email.split(',').map(e => e.trim()).filter(e => e.length > 0);

        let templateContent = await fs.readFile(path.join(__dirname, 'templates', template), 'utf-8');
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

        // ✅ SUCCESS log
        await new EmailLog({
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            to: emails,
            position,
            cv,
            template,
            status: "success",
            error_message: ""
        }).save();

        res.redirect('/?success=' + encodeURIComponent(`Email sent for ${position} to: ${emails.join(', ')}`));
    } catch (err) {
        console.error("Email send error:", err);

        // ❌ FAILURE log
        await new EmailLog({
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            to: email.split(',').map(e => e.trim()),
            position,
            cv,
            template,
            status: "failed",
            error_message: err.message
        }).save();

        res.redirect('/?error=' + encodeURIComponent('Failed to send email. Please try again.'));
    }
});

app.get('/logs', async (req, res) => {
    try {
        const logs = await EmailLog.find().sort({ createdAt: -1 }).lean();
        res.render('logs', { logs });
    } catch (err) {
        console.error("Fetch logs error:", err);
        res.send("Failed to load logs.");
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
