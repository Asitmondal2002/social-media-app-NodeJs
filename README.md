# social-media-app-NodeJs
# GetSocial - A Full-Stack Social Media Web App 

Welcome to **GetSocial**, a full-stack social media web application built with **Node.js, Express.js, React, and MongoDB**. This project is designed with a **robust and scalable architecture** to deliver a seamless social media experience. It includes **user authentication, post management, real-time chat, user profiles, and more.**  

## 🚀 Key Features 

- **User Authentication**: Secure signup and login with JWT.  
- **Post Management**: Create, read, update, and delete posts.  
- **User Profiles**: Follow/unfollow functionality with detailed user profiles.  
- **Real-time Chat**: Instant messaging powered by **Socket.io**.  
- **Responsive UI**: Optimized for various screen sizes and devices.  
- **Search Functionality**: Efficient search for posts and users.  
- **Docker Support**: Easily deploy using **Docker** and **Docker Compose**.  

## 🛠 Technologies Used  

### Frontend:  
- React.js  
- HTML5, CSS3  

### Backend: 
- Node.js  
- Express.js  

### Database: 
- MongoDB  

### Real-time Communication: 
- Socket.io  

### Deployment:  
- Supports **Docker, AWS, Heroku, Azure**, etc.  

---

## 🔧 **Setup and Installation**  

### 1️⃣ Clone the repository**  
```bash
git clone https://github.com/Asitmondal/Social-Media-App-NodeJS.git
cd GetSocial
```
### **2️⃣ Set up the backend
``` 
cd backend
npm install
npm start 
```
### 3️⃣ Set up the frontend
```
cd ../frontend
npm install
npm start
```
##  🐳 Docker Setup
### 1️⃣ Build and run using Docker Compose
```
docker-compose up --build
```
### 2️⃣ Run the backend separately using Docker
```
cd backend
docker build -t getsocial-backend .
docker run -p 5000:5000 getsocial-backend
```
### 3️⃣ Run the frontend separately using Docker
```
cd frontend
docker build -t getsocial-frontend .
docker run -p 3000:3000 getsocial-frontend
```
## 🎯 Contributing
We welcome contributions! Feel free to submit issues, feature requests, or pull requests.