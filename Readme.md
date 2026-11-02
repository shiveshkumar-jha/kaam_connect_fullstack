# KaamConnect – Blue-Collar Recruitment Platform

**Connecting Skilled Workers with the Right Opportunities.**

KaamConnect is a full-stack recruitment platform designed to bridge the gap between blue-collar workers and employers in India. It provides workers with a digital identity to showcase their skills and discover relevant job opportunities, while enabling employers to post jobs, find suitable candidates, and manage recruitment efficiently.

The platform aims to make blue-collar recruitment more accessible, transparent, and organized by replacing fragmented hiring methods such as referrals, WhatsApp groups, and word-of-mouth communication.

---

## 🚀 Features

### 👷 Worker Experience
- User registration and secure login.
- Role-based worker authentication.
- Create and manage worker profiles.
- Showcase professional skills and experience.
- Explore available job opportunities.
- Apply for relevant jobs.
- Track application status.
- Access a personalized worker dashboard.

### 🏢 Employer Experience
- Employer registration and authentication.
- Create and manage employer profiles.
- Post new job opportunities.
- View and manage posted jobs.
- Discover potential candidates.
- Review worker applications.
- Update application status.
- Access an employer recruitment dashboard.

### 📊 Recruitment Dashboard
- Separate dashboards for workers and employers.
- Overview of jobs and applications.
- Application tracking and status management.
- Centralized recruitment workflow.
- Organized candidate management.

### 🔐 Security & Authentication
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected API routes.
- Role-based authorization.
- Secure cookie handling.
- Centralized error handling.

### ☁️ Media Management
- Cloudinary integration for media uploads.
- Multer middleware for handling file uploads.
- Cloud-based image storage.

---

## 🛠️ Technology Stack

### Frontend
- React.js
- JavaScript
- React Router DOM
- Axios
- HTML5
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- Cookie-parser
- Multer
- Cloudinary

### Development Tools
- Git & GitHub
- Postman
- VS Code
- MongoDB Atlas
- Vite

---

## 🏗️ Project Architecture

KaamConnect follows a client-server architecture.

```text
                 KAAMCONNECT
                      |
          +-----------+-----------+
          |                       |
       FRONTEND                BACKEND
          |                       |
       React.js               Node.js
          |                       |
    React Router              Express.js
          |                       |
       Axios                REST APIs
          |                       |
          +-----------+-----------+
                      |
                 MONGODB
                      |
              Mongoose ODM
                      |
             MongoDB Database

          External Integrations
                      |
                 Cloudinary
              (Media Storage)
```

---

## 📁 Project Structure

```text
KaamConnect/
│
├── backend/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── db/
│   │   ├── app.js
│   │   └── index.js
│   │
│   ├── public/
│   ├── .env
│   └── package.json
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── worker/
│   │   │   └── employer/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── public/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/KaamConnect.git
```

```bash
cd KaamConnect
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend root directory:

```env
PORT=8000

MONGODB_URL=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:5173

JWT_SECRET=your_jwt_secret

JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:8000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

## 🔗 API Overview

The backend exposes RESTful APIs for authentication, workers, employers, jobs, and applications.

| Module | Operations |
|---|---|
| Authentication | Register, Login, Logout, Get Current User |
| Worker | Manage Worker Profile |
| Employer | Manage Employer Profile |
| Jobs | Create, View, Update, Delete Jobs |
| Applications | Apply for Jobs, View Applications |
| Recruitment | Manage Application Status and Candidates |

**Base API URL:**

```text
/api/v1
```

*Note: Refer to the backend route files for the exact implemented endpoints and HTTP methods.*

---

## 🗄️ Database Design

KaamConnect uses MongoDB as its primary database, with Mongoose for schema definition and database operations.

Core collections include:

- **Users:** Stores authentication details, personal information, and user roles.
- **WorkerProfiles:** Stores worker-specific information, skills, experience, and profile details.
- **EmployerProfiles:** Stores employer and company information.
- **Jobs:** Stores job descriptions, requirements, salary details, and employer references.
- **Applications:** Stores job applications, worker references, application status, and recruitment information.

MongoDB references are used to establish relationships between users, profiles, jobs, and applications.

---

## 🔄 Application Workflow

### Worker Workflow

1. Register as a worker.
2. Log in to the platform.
3. Create or update a professional profile.
4. Explore available jobs.
5. Apply for suitable opportunities.
6. Track application progress.

### Employer Workflow

1. Register as an employer.
2. Log in to the platform.
3. Create an employer profile.
4. Publish job opportunities.
5. Discover and review candidates.
6. Manage applications and update hiring statuses.

---

## 🔒 Environment Variables & Security

- Never commit `.env` files to GitHub.
- Use strong JWT secrets.
- Hash passwords before storing them.
- Validate incoming API requests.
- Protect sensitive routes using authentication middleware.
- Implement role-based access control.
- Keep Cloudinary credentials private.

Add the following to `.gitignore`:

```gitignore
node_modules/
.env
dist/
.DS_Store
```

---

## 🎯 Project Objective

KaamConnect aims to:

- Digitize blue-collar worker identities.
- Improve access to employment opportunities.
- Reduce friction in the recruitment process.
- Help employers discover relevant skilled workers.
- Make application tracking more transparent.
- Build an accessible and scalable recruitment ecosystem.

---

## 🔮 Future Enhancements

- AI-powered job recommendations.
- Skill-based candidate matching.
- Worker identity and certification verification.
- Multilingual interface for regional accessibility.
- Voice-assisted job discovery.
- Real-time notifications.
- Resume generation and digital worker portfolios.
- Recruitment analytics and hiring insights.
- Interview scheduling and workflow automation.

---

## 👨‍💻 Contributors

**Developer:** Shivesh Kumar Jha

**Project:** KaamConnect – Blue Workforce Connect '26

**Institution:** National Institute of Technology Andhra Pradesh

---

## 📄 License

This project is developed for educational and innovation purposes as part of the Blue Workforce Connect '26 initiative.

