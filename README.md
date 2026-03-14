# 🌌 Full-Stack Portfolio Website

A premium, interactive, and fully responsive full-stack portfolio website built to showcase projects, skills, and experience. It features a stunning dark-themed, glassmorphic UI with integrated 3D visual effects and a secure, built-in admin dashboard for real-time content management.

## ✨ Key Features

- **Premium Dark UI**: A modern interface featuring glassmorphism, smooth gradients, and elegant typography.
- **Interactive 3D Backgrounds**: Immersive visual experiences powered by `Three.js` (LiquidEther background) and `tsparticles`.
- **Fluid Animations**: Smooth scrolling with `Lenis` and element transitions using `Framer Motion`.
- **Integrated Admin Panel**: A secure, password-protected admin dashboard seamlessly built into the frontend to manage Projects, Skills, and Experience via CRUD operations.
- **Secure Authentication**: Backend API secured with JWT (JSON Web Tokens) and `bcryptjs` for password hashing.
- **Robust Data Management**: Supports MongoDB for backend operations and integrates `Supabase` for real-time data and media handling.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19 (via Vite)
- **Styling**: Tailwind CSS v4
- **Animations & 3D**: Framer Motion, Three.js, tsParticles
- **Scrolling**: Lenis (Smooth Scroll)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **BaaS**: Supabase (Database & Storage)

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT & bcryptjs
- **File Uploads**: Multer
- **Security & Utilities**: CORS, dotenv

---

## 📂 Project Structure

The repository is divided into two main directories:

- `/portfolio` - The React frontend application.
- `/backend` - The Node.js/Express backend API.

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/Abdulahad-web-dev/Full-Stack-Portfoilo-Website.git
cd Full-Stack-Portfoilo-Website
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and start the development server.
```bash
cd backend
npm install

# Create a .env file based on the environment variables section below

# Start the server (runs on usually port 5000)
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the portfolio directory, install dependencies, and start the Vite development server.
```bash
cd portfolio
npm install

# Create a .env file based on the environment variables section below

# Start the frontend app
npm run dev
```

---

## 🔒 Environment Variables

You need to set up environment variables for both the backend and frontend to connect to your databases and authenticate users.

### Backend (`/backend/.env`)
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add any other required backend variables (e.g., SQLite/MySQL configs if applicable)
```

### Frontend (`/portfolio/.env`)
Create a `.env` file in the `portfolio` folder and add your Supabase keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api # URL to your local backend
```

---

## 🚀 Deployment

- **Frontend**: Can be deployed on Vercel, Netlify, or any static hosting platform (run `npm run build` in the `/portfolio` directory).
- **Backend**: Can be deployed on Render, Heroku, or DigitalOcean (ensure environment variables are configured in the hosting provider's dashboard).

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Abdulahad-web-dev/Full-Stack-Portfoilo-Website/issues).
