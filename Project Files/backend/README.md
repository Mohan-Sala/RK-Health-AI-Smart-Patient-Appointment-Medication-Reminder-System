# RK Health Backend (Phase 2)

This repository holds the backend foundation and database architecture for RK Health — an AI-powered Healthcare Management and Patient Reminder Platform.

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Supabase account & PostgreSQL database

### Step 1: Install Dependencies
Navigate to the `backend` folder and run:
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Supabase connection strings:
```bash
cp .env.example .env
```

---

## 🛠️ Database Setup

### 1. Configure Supabase Connection
1. In your Supabase Dashboard, go to **Project Settings** > **Database**.
2. Under **Connection string**, select **URI** (Transaction Mode is recommended for serverless or Session Mode for dev setups).
3. Set your connection URL as `DATABASE_URL` in `.env`.

### 2. Run Database Migrations
Run the following Prisma command to push tables and constraints to your Supabase instance:
```bash
npx prisma migrate dev --schema=src/prisma/schema.prisma
```

### 3. Seed Database
Seeding inserts mock data (User, Appointments, Medications, AI Summaries, Reports, Notifications, Activity Logs, and Reminder History) to prepare for Phase 3.
Run:
```bash
npx prisma db seed --schema=src/prisma/schema.prisma
```

---

## 📊 Database Schema Overview

```
                   ┌──────────────┐
                   │     User     │
                   └──────┬───────┘
     ┌──────────┬─────────┼─────────┬──────────┐
     ▼          ▼         ▼         ▼          ▼
┌─────────┐┌─────────┐┌───────┐┌─────────┐┌───────────┐
│ Appoint ││ Meds    ││Reports││ Notifications ││ActivityLogs│
└────┬────┘└────┬────┘└───────┘└─────────┘└───────────┘
     ▼          ▼
┌─────────┐┌───────────────┐
│ AISummary││ReminderHistory│
└─────────┘└───────────────┘
```

### Core Entities:
1. **User**: Credentials, profiles, medical vitals, and system role configuration.
2. **Appointment**: Tracks patient appointments, times, doctors, visits, and links to AI summaries and calendars.
3. **Medication**: Holds drug names, dosages, frequencies, reminders, and recipient phone numbers.
4. **AiSummary**: Stores AI-generated analysis notes attached to appointments.
5. **Report**: Contains user files upload paths and documents metadata.
6. **Notification**: Dispatches system, appointment, report, and reminder alerts to users.
7. **ActivityLog**: Logs platform interactions and actions for audit logs.
8. **ReminderHistory**: AuditsTwilio/SMS, Email, and Push reminder deliveries.

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── config/       # env, Database connection helper, Supabase, and logging configs
│   ├── controllers/  # Route controller controllers
│   ├── routes/       # API router mappings
│   ├── middleware/   # Rate limiting, auth, logging, and error wrappers
│   ├── services/     # Third-party wrappers (Groq AI, Twilio, Google Calendar)
│   ├── prisma/       # schema.prisma & seed.js Database schema scripts
│   ├── validators/   # Zod request validation schemas
│   ├── utils/        # Error wrappers and standard formatting helpers
│   ├── database/     # DB seed scripts and hooks
│   ├── logs/         # Request and system logs
│   ├── uploads/      # Uploaded files
│   ├── app.js        # Express application configuration
│   └── server.js     # Entry point that runs the HTTP listener
```
