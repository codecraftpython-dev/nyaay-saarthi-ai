# ⚖️ NyaaySarthi

### Your Guide. Your Rights. Your Justice.

NyaaySarthi is a digital legal awareness, guidance, and
advocate-consultation platform focused on making legal information and
access to professional legal support easier for citizens in India.

> **Disclaimer:** NyaaySarthi provides general legal information and
> guidance. It is not a substitute for professional legal advice or
> legal representation. Users should consult a qualified advocate for
> advice specific to their situation.

## 🚀 Key Features

### 🤖 AI Legal Assistant

-   AI-powered general legal awareness and guidance
-   Multi-turn conversations
-   Indian-law-focused information
-   Guidance for rights, complaints, applications and basic procedures
-   Consumer-law, cyber-fraud, FIR and other legal-awareness topics
-   Multilingual support: English, Hindi, Bengali, Telugu, Tamil,
    Marathi, Gujarati and Kannada
-   Legal disclaimer and safety guardrails
-   Available for both citizens and advocates

### 👤 Citizen Portal

-   Citizen account registration and login
-   Personalized citizen profile
-   Persistent profile information using PostgreSQL
-   Know Your Rights resources
-   AI Legal Assistant
-   Advocate discovery
-   Appointment/consultation booking
-   Applications and status tracking
-   Saved legal resources
-   Account settings

Citizen registration stores relevant profile information such as Full
Name, Mobile Number, Email Address, Date of Birth, State/UT,
City/District, Residential Address and password.

### ⚖️ Advocate Portal

-   Advocate registration
-   Professional profile
-   Consultation requests
-   Client/case information
-   Client document review
-   Advocate profile management
-   AI Legal Assistant

Advocate registration supports Advocate Name, Mobile Number, Email
Address, Bar Council Enrollment Number, State Bar Council, Practice
Areas, Years of Experience, Courts/Jurisdictions, Languages,
Consultation Fee, Consultation Duration and verification/document
information.

### 🔎 Advocate Discovery

Citizens can find advocates using practice area, court level, city,
language and experience.

Example practice areas include Criminal Law, Family Law, Cyber Law,
Corporate Law, Property Law and Consumer Disputes.

### 📅 Appointment Booking

-   Advocate consultation requests
-   Available appointment slots
-   Booking information
-   Consultation fee and duration display
-   User appointment history

### 💰 Consultation Fee

Fee and duration are stored separately.

Example:

``` text
consultation_fee = 500
consultation_duration = 30 minutes
```

Displayed as:

``` text
₹500 / 30 mins
```

This prevents incorrect formatting such as `₹50030`.

### 📚 Know Your Rights

Resources include: - Fundamental Rights - Constitutional rights -
FIR-related guidance - Domestic violence protection - Cyber-fraud
reporting - Consumer disputes - General legal awareness -
Complaint/application guidance

### 📝 Applications & Status

-   Application information
-   Required document guidance
-   Complaint/application guidance
-   Status tracking
-   Previous applications

### 🆘 Important Helplines

-   **112** --- Emergency Response Support
-   **1091** --- Women Helpline
-   **1930** --- Cyber Crime Helpline

Users should verify current official contact information before relying
on a helpline.

## 🔐 Authentication & Data Persistence

NyaaySarthi supports role-based authentication:

``` text
Citizen → Citizen Dashboard
Advocate → Advocate Dashboard
```

User-specific profile data is retrieved using the authenticated account
rather than hardcoded/default profile data.

Passwords are stored using secure password hashing and never as
plaintext.

## 🗄️ PostgreSQL

PostgreSQL is used for persistent application data such as: - User
accounts - Citizen profiles - Advocate profiles - Appointments -
Applications - Verification-related information

For advocates:

``` text
users.id
   ↓
advocates.user_id
```

This connects each advocate account to the correct professional profile.

## 🏗️ Technology Stack

### Frontend

-   React 19
-   TypeScript
-   Vite
-   Tailwind CSS v4
-   Motion / motion-react
-   Lucide React

### Backend

-   Node.js
-   Express.js
-   TypeScript
-   REST API endpoints

### Database

-   PostgreSQL
-   `pg`

### AI

-   Google Gen AI SDK
-   Gemini-based AI Legal Assistant

### Deployment

-   Render
-   Render PostgreSQL

## 🧩 Architecture

``` text
React + TypeScript Frontend
            ↓
       Express API
        ↙       ↘
PostgreSQL     Gemini AI
```

The frontend communicates with the backend API. The backend handles
authentication, database operations and AI requests.

## 🔄 Citizen Workflow

``` text
Visit NyaaySarthi
      ↓
Citizen Registration
      ↓
PostgreSQL
      ↓
Login
      ↓
Citizen Dashboard
      ↓
Know Your Rights / Chat to AI / Find Advocate /
Book Consultation / My Applications / Profile
```

## 🔄 Advocate Workflow

``` text
Visit NyaaySarthi
      ↓
Advocate Registration
      ↓
Professional Details
      ↓
Verification Status
      ↓
PostgreSQL
      ↓
Login
      ↓
Advocate Dashboard
      ↓
Manage Profile / Consultation Requests /
Client Information / Document Review / Chat to AI
```

## 🔒 Advocate Verification

NyaaySarthi collects advocate enrollment and professional information
for its verification workflow.

Entering a Bar Council Enrollment Number alone does **not** mean that an
advocate has been officially verified by a Bar Council or government
authority.

Where live verification APIs are unavailable, the platform should
clearly represent the available status, such as Pending, Verified or
Rejected.

## 🛡️ Legal & Safety

NyaaySarthi is a legal-awareness and consultation-support platform.

The AI assistant: - Does not act as a lawyer - Does not represent users
in court - Does not replace a qualified advocate - Provides general
legal information and guidance

Professional legal advice should be obtained from a qualified advocate
when required.

## ⚙️ Environment Variables

``` env
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Never commit real database credentials or API keys to GitHub.

For Render deployment, configure secrets through the service's
Environment Variables settings.

## 🛠️ Local Development

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd NyaaySarthi
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file with the required values.

### 4. Run the application

Use the development command defined in `package.json`, for example:

``` bash
npm run dev
```

## 🚀 Deployment

Recommended architecture:

``` text
GitHub
  ↓
Render Web Service
  ↓
NyaaySarthi Backend + Frontend
  ↓
Render PostgreSQL
```

For production, the Render PostgreSQL internal connection can be used
when the web service and database are in the same Render region.

## 📌 Current Limitations

Depending on the current deployment, advanced integrations may still
require future development:

-   Live Bar Council verification API
-   Government identity verification
-   Live government/legal-service APIs
-   Payment gateway
-   Automated payment refund system
-   Built-in live video/audio consultation
-   Production-grade document storage
-   Advanced admin verification dashboard
-   Large-scale production monitoring

NyaaySarthi should not claim these integrations until they are actually
connected and tested.

## 🔮 Future Enhancements

-   Bar Council and government verification integrations
-   DigiLocker integration where appropriate
-   Secure online payments
-   Automated appointment confirmation
-   Cancellation/rescheduling workflows
-   Video/audio consultation
-   Secure document storage
-   Admin moderation and verification dashboard
-   More Indian languages
-   Accessibility improvements
-   Legal-aid authority integrations
-   Advanced analytics

## 🎯 Project Objective

NyaaySarthi aims to reduce the information gap between citizens and the
legal system.

Instead of requiring citizens to already know which law may apply, which
authority to approach, what documents are required, and where to find
professional help, NyaaySarthi aims to guide them through the process.

``` text
Legal Awareness
       +
AI Guidance
       +
Advocate Discovery
       +
Human Consultation
       =
More Accessible Legal Support
```

## 🌱 Social Impact

NyaaySarthi focuses on: - Legal awareness - Rights awareness -
Accessibility - Transparency - Easier access to advocates - Better
understanding of basic legal procedures

## 📋 Project Information

**Project Name:** NyaaySarthi\
**Tagline:** Your Guide. Your Rights. Your Justice.\
**Domain:** Legal Awareness & Advocate Consultation\
**Target Users:** Citizens and Advocates\
**Country Focus:** India

## 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

------------------------------------------------------------------------

# ⚖️ NyaaySarthi

**Your Guide. Your Rights. Your Justice.**
