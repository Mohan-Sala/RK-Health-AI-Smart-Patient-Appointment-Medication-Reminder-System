# 🏥 RK Health - AI-Powered Smart Patient Appointment & Medication Reminder System

<div align="center">


**An AI-Powered Healthcare Management Platform for Smart Patient Care**

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Groq AI](https://img.shields.io/badge/Groq-AI-blueviolet)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![Twilio](https://img.shields.io/badge/Twilio-SMS-red)
![Google Calendar](https://img.shields.io/badge/Google-Calendar-4285F4?logo=googlecalendar&logoColor=white)

</div>

---

# 📖 Overview

RK Health is an **AI-powered healthcare management platform** that enables patients to manage appointments, medication schedules, AI-generated visit summaries, healthcare reports, and personal health records from a single responsive dashboard.

The platform combines cloud technologies, Artificial Intelligence, secure authentication, and modern web development practices to simplify healthcare management for patients.

---

# ✨ Key Features

- 👤 Secure User Registration & Login
- 🔐 JWT-Based Authentication
- 📅 Appointment Management
- 💊 Medication Reminder Management
- 🤖 AI-Powered Health Summary (Groq LLaMA 3.3-70B)
- 📊 Dashboard Analytics
- 📈 Medication Compliance Tracking
- 📄 Health Report Generation (PDF/CSV/Excel)
- 🔔 Notification Center
- 📜 Activity Logs
- 👨‍⚕️ Dynamic Doctor Management
- 👤 User Profile Management
- 🌙 Dark / Light Theme
- 📱 Fully Responsive UI
- ☁️ Cloud Database Integration
- 🔒 Secure API Architecture

---

# 🏗️ System Architecture

```
Frontend (HTML, CSS, JavaScript)

        │

        ▼

Node.js + Express.js REST API

        │

        ▼

JWT Authentication Middleware

        │

        ▼

Prisma ORM

        │

        ▼

Supabase PostgreSQL Database

        │

        ├──────────────► Groq AI
        │
        ├──────────────► Twilio SMS
        │
        └──────────────► Google Calendar
```

---

# 🛠 Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Vite

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL
- Supabase

## ORM

- Prisma ORM

## Authentication

- JWT
- bcrypt

## AI

- Groq API
- LLaMA 3.3 70B Versatile

## External APIs

- Google Calendar API
- Twilio SMS API

## Deployment

- GitHub Pages (Frontend)
- Node.js Server
- Supabase Cloud Database

---

# 📂 Project Structure

```
RK-Health/

│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   └── assets/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── prisma/
│   ├── config/
│   └── server.js
│
├── documentation/
│
├── README.md
│
└── package.json
```

---

# 🚀 Main Modules

## Authentication

- User Registration
- User Login
- Secure JWT Authentication
- Protected Routes
- Logout

---

## Dashboard

- Healthcare Statistics
- Upcoming Appointments
- Today's Medications
- Activity Timeline
- AI Insights
- Quick Actions

---

## Appointment Management

- Create Appointment
- Edit Appointment
- Delete Appointment
- Calendar Integration
- Doctor Management

---

## Medication Management

- Add Medication
- Edit Medication
- Delete Medication
- Medication Compliance
- Reminder Scheduling

---

## AI Summary

Generate patient-friendly healthcare summaries using:

- Appointment Details
- Doctor Notes
- Diagnosis
- Prescription
- Follow-up Instructions

Powered by **Groq LLaMA 3.3 70B**.

---

## Reports

Generate professional reports including:

- Appointment History
- Medication History
- AI Summaries
- Activity Logs
- Health Information

Export Formats:

- PDF
- CSV
- Excel

---

## Profile

Manage

- Personal Information
- Health Information
- BMI Calculation
- Insurance Details
- Medical Conditions
- Allergies

---

## Activity Logs

Track

- Login History
- Appointment Activity
- Medication Activity
- Report Generation
- AI Summary Generation

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected REST APIs
- Input Validation
- Environment Variables
- Database Access Control
- Secure API Communication

---

# 🤖 AI Integration

RK Health uses **Groq LLaMA 3.3-70B Versatile** to generate:

- Visit Summaries
- Healthcare Insights
- Medication Guidance
- Follow-up Recommendations
- Patient-Friendly Reports

---

# 🗄 Database

The application uses **Supabase PostgreSQL** with Prisma ORM.

Main Tables:

- Users
- Appointments
- Medications
- AI Summaries
- Reports
- Notifications
- Activity Logs
- User Settings

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/rk-health.git

cd rk-health
```

---

## Install Dependencies

### Frontend

```bash
cd frontend

npm install
```

### Backend

```bash
cd backend

npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

DATABASE_URL=

DIRECT_URL=

JWT_SECRET=

SUPABASE_URL=

SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=

TWILIO_ACCOUNT_SID=

TWILIO_AUTH_TOKEN=

TWILIO_PHONE_NUMBER=
```

---

# 🗄 Prisma

Generate Client

```bash
npx prisma generate
```

Run Migration

```bash
npx prisma migrate dev
```

---

# ▶ Run Backend

```bash
npm run dev
```

---

# ▶ Run Frontend

```bash
npm run dev
```

---

# 📷 Screenshots

| Page | Screenshot |
|------|------------|
| Landing Page | docs/images/landing.png |
| Login | docs/images/login.png |
| Dashboard | docs/images/dashboard.png |
| Appointments | docs/images/appointments.png |
| Medications | docs/images/medications.png |
| AI Summary | docs/images/ai-summary.png |
| Reports | docs/images/reports.png |
| Profile | docs/images/profile.png |

---

# 🎯 Future Enhancements

- Mobile Application
- Doctor Portal
- Hospital Dashboard
- Video Consultation
- Wearable Device Integration
- OCR Prescription Scanner
- Voice Assistant
- Emergency SOS
- Family Health Management
- AI Disease Prediction

---

# 📚 Documentation

Project documentation is available in the `documentation/` folder.

- API Documentation
- Database Documentation
- System Architecture
- Deployment Guide
- User Manual
- Security Documentation
- Testing Documentation
- Developer Guide
- Project Report

---

# 👨‍💻 Author

**Mohan Sala**

Computer Science Engineering Student

AI & Full Stack Developer

---

# 🙏 Acknowledgements

Special thanks to the following technologies and communities:

- OpenAI
- Groq
- Supabase
- Prisma
- Twilio
- Google Calendar API
- Node.js Community
- Express.js
- PostgreSQL
- GitHub

---

# 📄 License

This project is developed for academic and educational purposes.

MIT License

---

<div align="center">

### ⭐ If you found this project useful, please consider giving it a Star ⭐

</div>
