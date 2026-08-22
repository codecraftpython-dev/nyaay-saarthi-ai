# Nyaay सारथी ⚖️

### Digital Legal Awareness, Guidance & Advocate Connect Platform

> **Nyaay सारथी** is a modern Indian civic-tech platform designed to
> make legal information easier to understand and access. It connects
> citizens with legal-awareness resources, AI-assisted guidance,
> advocates, appointments, applications, and case-related activity in
> one platform.

**Live Website:** https://nyaay-saarthii.onrender.com/

------------------------------------------------------------------------

## 📌 Overview

Nyaay सारथी is built around a simple idea:

**Make legal awareness understandable, make the next step clearer, and
make professional legal assistance easier to reach.**

The platform provides separate experiences for:

-   👤 **Citizens**
-   ⚖️ **Advocates / Lawyers**
-   🤖 **AI Legal Assistance**
-   📚 **Legal Rights & Awareness**
-   📅 **Advocate Appointment Management**
-   📝 **Applications / Complaint Tracking**
-   🔐 **Authentication & Profile Management**

The system is designed as a **legal-awareness and navigation platform**,
not as an AI lawyer or a replacement for a qualified advocate.

------------------------------------------------------------------------

## 🎯 Problem Statement

Many citizens struggle to understand:

-   What legal rights they have
-   Whether their situation may require formal action
-   Which authority or forum they should approach
-   What documents they may need
-   How to prepare an application or complaint
-   Whether they may be eligible for free legal aid
-   Which type of advocate they should consult
-   How to track applications and appointments

Traditional legal information can be difficult to understand because of
complex terminology, scattered resources, and limited access to
professional guidance.

### Nyaay सारथी addresses this gap by bringing these capabilities together in a single digital platform.

------------------------------------------------------------------------

# ✨ Core Features

## 🏠 Public Website

The public-facing experience provides access to:

-   Home
-   About Us
-   Contact Us
-   Chat to AI
-   Book an Appointment
-   Know Your Rights
-   Login / Signup
-   English / Hindi language controls

The interface follows a light, trustworthy civic-tech visual style with:

-   Blue navigation elements
-   White/light backgrounds
-   Soft blue gradients
-   Rounded cards
-   Clear typography
-   Consistent iconography
-   Responsive layouts

------------------------------------------------------------------------

# 👤 Citizen Portal

After successful citizen authentication, the user enters the dedicated
citizen interface.

### Citizen Navigation

-   Home
-   Book an Appointment
-   Know Your Rights
-   Chat to AI
-   My Applications
-   Profile

The citizen portal is designed to provide a centralized dashboard for
legal awareness and assistance.

------------------------------------------------------------------------

## 👤 Citizen Profile

Route:

``` text
/user/profile
```

The profile area can contain:

-   Profile picture
-   Name
-   Email
-   Mobile number
-   Date of birth
-   State
-   City

### Profile Actions

-   Edit Profile
-   Change Password
-   My Applications
-   My Appointments
-   Saved Resources
-   Logout

The architecture is designed to remain extensible so additional citizen
services can be added later.

------------------------------------------------------------------------

# 🤖 AI Legal Assistant

Route:

``` text
/chat
```

The AI assistant is one of the core features of Nyaay सारथी.

### Opening Experience

The interface introduces the assistant with:

> **How can Nyaay सारथी help you today?**

Users can describe their issue naturally in simple language.

### Example Topics

-   Landlord/security-deposit disputes
-   Online payment or UPI fraud
-   Consumer complaints
-   Fundamental rights
-   Government grievances
-   Free legal aid
-   Police complaints
-   Tenant disputes
-   Employment-related issues
-   Cybercrime
-   Banking disputes

### AI Response Structure

The assistant is designed to organize responses into useful sections:

1.  **Understanding Your Situation**
2.  **Your Possible Rights**
3.  **Is This Potentially Actionable?**
4.  **Relevant Authority / Forum**
5.  **What You May Need**
6.  **What You Can Do Next**
7.  **Legal Aid**
8.  **Advocate Assistance**
9.  **Application / Complaint**
10. **Status**

### AI Actions

Depending on the conversation, users can access actions such as:

-   Generate Application
-   Find Advocate
-   Save Conversation
-   Start New Chat
-   Track Status

### AI Follow-up / Quick Topics

The interface supports quick issue starters so citizens can begin
without knowing how to phrase a legal question.

### Important AI Limitation

Nyaay सारथी should **not** be represented as an AI lawyer.

AI-generated information is intended for general legal awareness and
procedural guidance. Users should consult a qualified advocate for
professional legal advice.

------------------------------------------------------------------------

# 📚 Know Your Rights

Route:

``` text
/rights
```

The rights portal provides searchable, category-based legal awareness.

### Categories

-   Constitutional Rights
-   Consumer Rights
-   Tenant & Property Rights
-   Employment Rights
-   Cyber Rights
-   Women's Rights
-   Children's Rights
-   Senior Citizen Rights
-   Rights of Persons with Disabilities
-   Police & Criminal Justice
-   Banking & Financial Rights
-   Family & Personal Rights

### Right Information Structure

Each right/resource can provide:

-   Right name
-   Simple explanation
-   Who it applies to
-   Relevant legal source
-   Example situation
-   What a person can do
-   Relevant authority
-   Useful documents
-   Related resources

### Contextual CTA

The rights experience connects users back to the AI assistant through:

**Talk to Nyaay सारथी**

The underlying architecture can later be extended into a verified legal
RAG system using official government and legal sources.

------------------------------------------------------------------------

# ⚖️ Book an Appointment

Route:

``` text
/appointments
```

The appointment system helps citizens discover advocates based on their
requirements.

### Advocate Discovery Filters

-   Practice Area
-   Court / Jurisdiction
-   Location
-   Language
-   Experience
-   Consultation Fee
-   Availability
-   Rating

### Advocate Card

Each advocate profile can display:

-   Profile photo
-   Advocate name
-   Verification badge
-   Practice areas
-   Experience
-   Location
-   Languages
-   Consultation fee
-   Rating
-   Availability status

### Actions

-   View Profile
-   Book Appointment

The system is designed to make advocate discovery more relevant instead
of requiring citizens to search through unrelated profiles.

------------------------------------------------------------------------

# 📝 My Applications

Route:

``` text
/user/applications
```

The citizen can view applications, complaints, or consultation-related
requests.

Each application can contain:

-   Application ID
-   Brief case information
-   Lawyer / advocate name
-   Advocate contact details
-   Appointment date
-   Appointment time
-   Application/consultation date
-   Lawyer fee
-   Application status
-   Acceptance status

### Activity / History

The citizen can also access recent activity such as:

-   Previous applications
-   Lawyer appointments
-   Consultation dates
-   Hearing dates
-   Application updates

The interface follows a ticket/case-card approach so multiple
applications remain easy to scan.

------------------------------------------------------------------------

# ⚖️ Advocate Portal

Nyaay सारथी also provides a dedicated advocate experience.

### Advocate Navigation

The advocate interface includes functionality around:

-   Home / Dashboard
-   Record History
-   IPC / BNS Reference
-   About Us
-   AI Chat
-   Profile / Advocate account

------------------------------------------------------------------------

## 👨‍⚖️ Advocate Dashboard

The advocate dashboard is designed around incoming citizen consultation
requests.

It can show:

-   Pending requests
-   Accepted requests
-   Declined requests
-   Consultation requests feed
-   Search requests
-   Today's consultations
-   Scheduled consultations
-   Citizen case summaries
-   Advocate verification information
-   Consultation fee / slot information

### Consultation Request Actions

Advocates can review incoming citizen requests and:

-   Accept
-   Decline
-   Review request details
-   View relevant citizen/case information
-   Manage consultations

------------------------------------------------------------------------

# 🤖 AI Chat for Advocates

The advocate portal also includes access to the same AI assistance
experience used in the citizen interface.

The feature is intended to provide consistent AI-assisted legal
information and case-support functionality while preserving the existing
advocate portal UI and navigation.

Possible uses include:

-   Case summarization
-   Legal issue identification
-   Indian-law awareness
-   Drafting assistance
-   Legal research assistance
-   Advocate recommendations where applicable
-   IPC/BNS-related reference support

The AI functionality should remain an **assistance tool**, not a
substitute for professional legal judgment.

------------------------------------------------------------------------

# 📖 IPC / BNS Reference

The advocate experience includes a legal reference area for Indian
criminal-law information.

The architecture can be expanded to support:

-   IPC references
-   BNS references
-   Section explanations
-   Related provisions
-   Search
-   Case/context references
-   Verified legal sources

This module is intended for reference and awareness and should be kept
aligned with verified/current legal sources.

------------------------------------------------------------------------

# 📜 Record History

The advocate portal provides a record/history-oriented workflow for
previously handled consultation activity.

The architecture can support:

-   Previous consultation requests
-   Accepted cases
-   Consultation history
-   Citizen/case summaries
-   Dates and appointment information
-   Status tracking

------------------------------------------------------------------------

# 🔐 Authentication

The application uses role-aware authentication for different platform
users.

### Supported Roles

``` text
Citizen
Advocate
```

The authentication architecture is intended to support:

-   Login
-   Signup
-   Password protection
-   Session/authentication handling
-   Role-based routing
-   Logout
-   Profile management
-   Protected pages

### Role-Based Experience

After successful authentication, the application routes the user to the
appropriate interface:

``` text
Citizen Login
      ↓
Citizen Portal

Advocate Login
      ↓
Advocate Portal
```

------------------------------------------------------------------------

# 🌐 Language Support

The interface provides English/Hindi language controls.

The architecture can be extended so that additional legal-awareness
content and AI responses can support Indian languages in future
versions.

------------------------------------------------------------------------

# 🎨 UI / UX Design

Nyaay सारथी uses a consistent visual language across public, citizen,
and advocate experiences.

### Design Direction

-   Light blue civic-tech theme
-   White backgrounds
-   Soft blue gradients
-   Blue primary actions
-   Rounded cards
-   Glass/soft-card effects where appropriate
-   Clear hierarchy
-   Minimal visual clutter
-   Accessible iconography
-   Professional legal/public-service appearance

### Design Goal

The interface should feel:

**Trustworthy + Modern + Accessible + Indian + Professional**

rather than looking like a generic AI chatbot.

------------------------------------------------------------------------

# 🧭 Main Application Flow

``` text
                    Nyaay सारथी
                         │
             ┌───────────┴───────────┐
             │                       │
          Citizen                 Advocate
             │                       │
        Authentication          Authentication
             │                       │
             ▼                       ▼
      Citizen Portal           Advocate Portal
             │                       │
     ┌───────┼────────┐       ┌──────┼─────────┐
     │       │        │       │      │         │
     ▼       ▼        ▼       ▼      ▼         ▼
   Rights   AI Chat  Apps    Requests History AI Chat
     │       │        │       │      │         │
     └───────┴────────┘       └──────┴─────────┘
             │                       │
             ▼                       ▼
       Find Advocate            Legal Reference
             │
             ▼
      Book Appointment
```

------------------------------------------------------------------------

# 🏗️ Technical Architecture

The project is designed around a modern full-stack architecture.

``` text
Frontend
React + TypeScript + Vite
        │
        │ REST/API
        ▼
Backend
Node.js + Express + TypeScript
        │
        ├──────────────► MongoDB
        │
        └──────────────► Gemini API
```

------------------------------------------------------------------------

# 🛠️ Technology Stack

## Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui / reusable component system
-   React Router
-   Lucide Icons

## Backend

-   Node.js
-   Express
-   TypeScript

## Database

-   MongoDB

## Authentication

-   JWT-based authentication
-   Secure password hashing
-   Role-based access control

## AI

-   Gemini API
-   AI-assisted legal-awareness workflow
-   Architecture prepared for future RAG integration

## Deployment

-   Render
-   MongoDB Atlas / MongoDB-compatible deployment
-   GitHub

------------------------------------------------------------------------

# 📁 Suggested Project Structure

``` text
Nyaay-Saarthi/
│
├── public/
│   └── logo.jpg
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── server/
│   ├── services/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   └── vite-env.d.ts
│
├── .gitignore
├── bun.lock
├── index.html
├── metadata.json
├── package.json
├── README.md
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

> The exact folder structure may differ from the implementation; this
> represents the recommended separation of frontend and backend
> responsibilities.

------------------------------------------------------------------------

# ⚙️ Local Development

## 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Nyaay-Saarthi
```

## 2. Install dependencies

Frontend:

``` bash
cd frontend
npm install
```

Backend:

``` bash
cd ../backend
npm install
```

------------------------------------------------------------------------

## 3. Configure Environment Variables

Create a `.env` file in the backend.

Example:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

For the Vite frontend, use:

``` env
VITE_API_URL=http://localhost:5000
```

Use the variable names required by the actual implementation if they
differ.

### Never commit secrets

Do not upload:

``` text
.env
.env.local
API keys
JWT secrets
Database credentials
```

to GitHub.

------------------------------------------------------------------------

# ▶️ Run the Application

## Backend

``` bash
cd backend
npm run dev
```

## Frontend

Open another terminal:

``` bash
cd frontend
npm run dev
```

Then open the Vite development URL shown in the terminal.

------------------------------------------------------------------------

# 🚀 Deployment on Render

The current project is deployed on Render.

For a separated frontend/backend deployment:

### Frontend

Use a Render Static Site.

Typical configuration:

``` text
Build Command:
npm install && npm run build

Publish Directory:
dist
```

### Backend

Use a Render Web Service.

Typical configuration:

``` text
Build Command:
npm install && npm run build

Start Command:
npm start
```

Configure all production environment variables inside Render instead of
committing them to GitHub.

------------------------------------------------------------------------

# 🔑 Environment Variables

Typical variables used by the architecture include:

  Variable           Purpose
  ------------------ ------------------------------
  `MONGO_URI`        MongoDB connection
  `JWT_SECRET`       Authentication token signing
  `GEMINI_API_KEY`   Gemini AI access
  `PORT`             Backend server port
  `NODE_ENV`         Runtime environment
  `VITE_API_URL`     Frontend API endpoint

Do not expose private backend secrets through `VITE_*` variables.

------------------------------------------------------------------------

# 🔒 Security Considerations

Because the platform deals with legal-related information, security
should be treated as a major concern.

Recommended protections include:

-   Password hashing
-   JWT authentication
-   Protected API routes
-   Role-based authorization
-   Input validation
-   API rate limiting
-   CORS configuration
-   Secure environment variables
-   HTTPS in production
-   Safe error handling
-   No API secrets in frontend code
-   Minimal collection of personal information
-   Appropriate access control for applications and appointments

------------------------------------------------------------------------

# ⚖️ Legal & AI Disclaimer

Nyaay सारथी is a **legal awareness and assistance platform**.

It does not replace:

-   A qualified advocate
-   A court
-   A government authority
-   Official legal documents
-   Professional legal advice

AI-generated information may be incomplete, outdated, or incorrect.

Users should verify important legal information through authoritative
sources and consult a qualified legal professional when professional
advice is required.

For production use, legal content should be grounded in verified
official sources and maintained as laws and procedures change.

------------------------------------------------------------------------

# 🔮 Future Scope

The architecture can be extended with:

### 🤖 Verified Legal RAG

Connect the AI system with verified sources such as:

-   Government portals
-   Official legislation
-   Courts
-   Legal Services Authorities
-   Consumer forums
-   Verified public legal resources

### 📄 Document Intelligence

-   Upload legal documents
-   Summarize documents
-   Extract important dates
-   Identify sections/clauses
-   Generate document checklists

### 📝 Application Generator

Generate structured drafts for:

-   Complaints
-   Applications
-   Grievances
-   Consumer complaints
-   Legal notices
-   Government submissions

### 📍 Government Authority Navigator

Help users identify:

-   Relevant department
-   Appropriate authority
-   Complaint mechanism
-   Required documents
-   Submission procedure

### 📊 Application Tracking

Provide a unified timeline for:

-   Application submitted
-   Lawyer assigned
-   Appointment scheduled
-   Documents submitted
-   Hearing date
-   Status updates
-   Resolution

### 🌐 Indian Language Expansion

Expand legal-awareness and AI support to additional Indian languages.

### 📱 Mobile Application

The platform can later be extended into Android/iOS applications.

------------------------------------------------------------------------

# 🌱 Social Impact

Nyaay सारथी aims to contribute toward:

-   Better legal awareness
-   Easier access to information
-   Improved citizen-government navigation
-   Better advocate discovery
-   Greater awareness of legal rights
-   Easier access to legal-aid information
-   More transparent application/consultation workflows

The platform is particularly useful for people who may find traditional
legal terminology and processes difficult to understand.

------------------------------------------------------------------------

# 🧪 Prototype Scope

This project is designed as a **student/hackathon-ready full-stack
prototype**.

The prototype demonstrates the complete product concept across:

``` text
Public Website
      ↓
Authentication
      ↓
Citizen / Advocate Role
      ↓
Dedicated Dashboard
      ↓
AI Assistance
      ↓
Rights Awareness
      ↓
Advocate Discovery
      ↓
Appointments
      ↓
Applications / History
```

Production deployment would require additional validation, legal-content
verification, security hardening, privacy controls, monitoring, and
integration with official systems where applicable.

------------------------------------------------------------------------

# 🤝 Contribution

Contributions are welcome.

A typical contribution workflow:

``` bash
git checkout -b feature/your-feature
```

Make changes, test locally, then:

``` bash
git add .
git commit -m "Add: your feature"
git push origin feature/your-feature
```

Create a Pull Request with:

-   Description of the change
-   Screenshots where applicable
-   Testing performed
-   Any known limitations

------------------------------------------------------------------------

# 👥 Project

**Nyaay सारथी --- Digital Legal Awareness & Guidance**

> **Your Trusted Guide for Lawyer Consultation, Legal Clarity, Rights &
> Justice.**

Built as a civic-tech solution to make legal awareness, guidance,
advocate access, and citizen support easier through technology.
