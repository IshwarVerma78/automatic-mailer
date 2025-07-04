# Automatic Mailer - Node.js (Express + Nodemailer)

🚀 This is a simple automatic job application mailer built with Node.js (Express) and Nodemailer. It sends a pre-defined HTML email (with your CV attached) to any HR email address submitted via a form.

## 🛠 Features
- 📧 Sends professional job application email
- 📎 Attaches your `cv.pdf`
- ✅ Uses environment variables for security
- 🌐 Simple HTML form interface
- 🚀 Built on Express & Nodemailer

## 📂 Project Structure
├── server.js # Express server
├── public/
│ └── index.html # Form to submit HR email
├── cv.pdf # Your resume attachment
├── .env # Environment variables (never push to GitHub!)
├── .gitignore
├── package.json
└── README.md


## ⚙️ Installation
1. Clone the repository

git clone https://github.com/yourusername/automatic-mailer.git
cd automatic-mailer


2. Install dependencies
npm install

# 🔑 Environment Variables
Create a .env file in the root with:
EMAIL_USER=yourgmailid@gmail.com
EMAIL_PASS=yourapppassword

✅ Note: Use Gmail App Passwords if you have 2FA. .env is listed in .gitignore so it won't be pushed to GitHub.

# 🚀 Running the app

npm start

Visit 👉 http://localhost:3000
Fill the HR email and hit "Send Email".

.

#🔥 How it works
User submits HR email via the HTML form (public/index.html). The server (server.js) takes the email, prepares an HTML email body, attaches cv.pdf, and sends it via Nodemailer using your Gmail SMTP credentials.

#📝 Customize
To change your message, edit the mailOptions in server.js.

To attach a different file, replace cv.pdf in the root.

#⚡ Deployment
You can deploy on Render, Railway, Heroku, DigitalOcean, etc. Just make sure to set your environment variables on the platform.

#🙌 License
MIT License

✍️ Author
Ishwar Verma


