# 📱 Social Media Microservices Backend

This project is a **Microservices-based Social Media Application** built using **Node.js**, **Express.js**, **Redis**, **Docker**, and a **CI/CD pipeline**.  
It follows a distributed services pattern with an **API Gateway** managing client requests and Redis handling caching and inter-service communication.

---

## 🏗️ Architecture

The application consists of the following services:

1. **API Gateway** – Routes client requests to respective microservices.  
2. **Identity Service** – Handles user authentication & authorization (JWT-based).  
3. **Post Service** – Manages user posts (create, update, delete, like, comment).  
4. **Media Service** – Handles file uploads (images/videos).  
5. **Search Service** – Provides search functionality across posts & users.  
6. **Redis** – Used as a cache and message broker for services.  

<p align="center">
  <img src="./img/microservices.png" alt="Architecture Diagram" width="700"/>
</p>

---

## 🚀 Features

- **Authentication & Authorization** with JWT  
- **CRUD operations for Posts** (likes, comments included)  
- **Media Uploads** (images/videos) via Media Service  
- **Search Users and Posts** with Search Service  
- **Redis Caching** for faster response times  
- **Redis Pub/Sub** for inter-service communication  
- **Dockerized Services** for easy deployment  
- **CI/CD Pipeline** for automated build & deployment  

---

## ⚙️ Tech Stack

- **Backend Framework**: Node.js, Express.js  
- **Database**: MongoDB  
- **Cache / Messaging**: Redis  
- **API Gateway**: Express Gateway  
- **Containerization**: Docker & Docker Compose  
- **Pipeline**: GitHub Actions (CI/CD)  

---

## 🛠️ Setup & Installation

### 1️⃣ Clone the repository

git clone https://github.com/BharatKumawat63777/Social-Media-Services.git
cd Social-Media-Services

### 2️⃣ Start services with Docker Compose
docker-compose up --build

### 3️⃣ Environment Variables
PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://mongo:27017/identity
REDIS_URL=redis://redis:6379 



## 📬 API Endpoints

All requests go through the **API Gateway** (`http://localhost:3000`).

| Service           | Method | Endpoint                 | Description              |
|-------------------|--------|--------------------------|--------------------------|
| **Identity**      | POST   | `/v1/auth/register`      | Register a new user      |
| **Identity**      | POST   | `/v1/auth/login`         | Login & get JWT token    |
| **Post**          | POST   | `/v1/posts`              | Create a new post        |
| **Post**          | GET    | `/v1/posts/:id`          | Get a post by ID         |
| **Media**         | POST   | `/v1/media/upload`       | Upload an image/video    |
| **Search**        | GET    | `/v1/search?query=term`  | Search users or posts    |



## 🚀 Deploy via GitHub Actions (CI/CD)

This project uses **GitHub Actions** to automate deployment on **AWS EC2** with images stored in **AWS ECR**.

The pipeline will:

1. **Build Docker images** for each microservice  
2. **Push images** to **Amazon ECR**  
3. **SSH into the EC2 instance**  
4. **Pull the latest images** from ECR  
5. **Restart containers** using `docker-compose`  

---

## 📸 Postman Testing with AWS

You can test all APIs using **Postman**.  
👉 Import the collection: [docs/postman_collection.json](docs/postman_collection.json)


### 🔑 Login & Get Token 
<img src="./img/login.png" alt="Login Screenshot" width="600"/>

### 📝 ALL Post 
<img src="./img/all-post.png" alt="All Post" width="600"/> 

### 📤 Upload Media 
<img src="./img/upload.png" alt="Upload Media" width="600"/>

 ### 🔍 Search 
 <img src="./img/search.png" alt="Search Screenshot" width="600"/> 
 
 ### ☁️ Running on AWS 
 <img src="./img/ubanto.png" alt="AWS running Screenshot" width="600"/> 


