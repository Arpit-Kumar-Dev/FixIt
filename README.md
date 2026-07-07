<div align="center">

# 🛠️ FixIt

**A full-stack service-booking platform connecting users with trusted service providers.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://fix-it-umber.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://fix-it-umber.vercel.app)

[🔗 Live Demo](https://fix-it-umber.vercel.app) · [Report Bug](https://github.com/Arpit-Kumar-Dev/FixIt/issues) · [Request Feature](https://github.com/Arpit-Kumar-Dev/FixIt/issues)

</div>

---

## 📖 Overview

FixIt connects users with service providers for on-demand repair and maintenance services. It handles authentication for both users and providers, service bookings, secure online payments, and email/SMS notifications — all in one platform.

## ✨ Features

- 🔐 **Authentication** — Secure JWT-based login for Users and Service Providers
- 📅 **Booking Management** — Create, track, and manage service bookings
- 💳 **Payments** — Integrated online payments via Razorpay
- 📧 **Notifications** — Automated emails (Nodemailer) and SMS/OTP (Twilio)
- ☁️ **File Uploads** — Images and documents stored on AWS S3
- 🎨 **Modern UI** — Responsive, animated interface built with React, MUI, and Tailwind CSS

## 🧰 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- ⚛️ React 18 + Vite
- 🎨 Tailwind CSS & Material UI
- 🎬 Framer Motion
- 🧭 React Router DOM
- 🌐 Axios

</td>
<td valign="top" width="50%">

**Backend**
- 🟢 Node.js + Express
- 🍃 MongoDB + Mongoose
- 🔑 JWT & bcrypt
- 📦 Multer + AWS S3
- 💰 Razorpay
- 📱 Twilio
- ✉️ Nodemailer

</td>
</tr>
</table>

## 📂 Project Structure

```
FixIt/
├── BACKEND/
│   ├── controllers/     # Business logic (Booking, Payment, Email, User, Service Provider)
│   ├── routes/          # API route definitions
│   ├── models/          # Mongoose schemas
│   ├── DB/              # Database connection
│   ├── util/            # Helper utilities
│   └── server.js        # Entry point
└── FRONTEND/
    ├── src/              # React components, pages, and assets
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- AWS S3 bucket credentials
- Razorpay API keys
- Twilio account credentials

### 1️⃣ Backend Setup

```bash
cd BACKEND
npm install
```

Create a `.env` file inside `BACKEND`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
```

Run the server:

```bash
npm start
```

### 2️⃣ Frontend Setup

```bash
cd FRONTEND
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default, and the backend on the port set in `.env`.

## 🔌 API Overview

| Route | Purpose |
|---|---|
| `/users` | User registration, login, and profile management |
| `/sp` | Service provider registration and management |
| `/booking` | Create and manage service bookings |
| `/payment` | Handle Razorpay payment flows |
| `/email` | Send transactional and booking-related emails |

## 🤝 Contributing

Contributions are welcome! Please open an issue to discuss any major changes before submitting a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project currently has no license specified. Add a `LICENSE` file if you'd like to make usage terms explicit.

## 👤 Author

<div align="center">

**Arpit Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-Arpit--Kumar--Dev-181717?style=for-the-badge&logo=github)](https://github.com/Arpit-Kumar-Dev)

</div>
