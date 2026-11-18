# 🤖 AI-Powered Interview Preparation Platform

An intelligent AI-powered platform designed to help students and job seekers prepare for technical and HR interviews with confidence. Practice interviews, generate personalized questions, analyze your performance, and improve your interview skills using AI.

## 🚀 About The Project

The AI-Powered Interview Preparation Platform is a full-stack web application that helps candidates prepare for real-world job interviews.

The platform provides an interactive interview preparation experience with AI-generated questions, interview sessions, resume parsing, performance feedback, and progress tracking.

It aims to make interview preparation smarter, easier, and more effective.

## ✨ Features

- **AI-Powered Interview Preparation:** Generate interview questions using AI.
- **Mock Interviews:** Practice interviews in an interactive environment.
- **Resume Parsing:** Upload and analyze resumes for interview preparation.
- **Performance Feedback:** Get feedback and evaluate interview performance.
- **User Authentication:** Secure user registration and login.
- **Google Authentication:** Support for Google-based authentication.
- **Personalized Dashboard:** Track interview activities and performance statistics.
- **Interview History:** Access previous interview sessions and results.
- **Profile Management:** Manage personal information and account details.
- **Camera Integration:** Use camera functionality during interview sessions.
- **Phone Detection:** Phone detection functionality during interviews.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database & Services
- MongoDB
- Firebase Authentication
- Google Gemini AI
- Cloudinary

## 📁 Project Structure

```text
AI-Interview-Platform/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
│
└── .gitignore
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Nilesh-singh91/-AI-powered-Interview-Preparation-Website.git
```

### 2. Navigate to Project Folder

```bash
cd -AI-powered-Interview-Preparation-Website
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure the required environment variables.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm run dev
```

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file if required and configure the frontend API URL and Firebase credentials according to your project configuration.

Start the frontend:

```bash
npm run dev
```

### 5. Open in Browser

```text
http://localhost:5173
```

## 🎯 Project Objectives

- Make interview preparation accessible and efficient.
- Help candidates improve technical and communication skills.
- Provide AI-generated interview practice.
- Analyze interview performance and identify improvement areas.
- Build confidence before real job interviews.

## 🔮 Future Enhancements

- Real-time speech analysis.
- Advanced AI-based answer evaluation.
- More interview categories and difficulty levels.
- Personalized learning recommendations.
- Advanced interview performance analytics.

## 👨‍💻 Developer

**Nilesh Kumar Singh**

B.Tech Computer Science & Engineering

GitHub: [Nilesh-singh91](https://github.com/Nilesh-singh91)

Project Repository: [AI-Powered Interview Preparation Website](https://github.com/Nilesh-singh91/-AI-powered-Interview-Preparation-Website)

---

⭐ If you find this project useful, consider giving it a star!

**Built with ❤️ to make interview preparation smarter.**
