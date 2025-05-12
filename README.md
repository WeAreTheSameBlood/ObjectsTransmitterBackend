# ObjectsTransmitter Backend

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![NestJS](https://img.shields.io/badge/NestJS-v10+-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15+-blue)
![AppWrite](https://img.shields.io/badge/AppWrite-v1.6+-orange)

---

## 🚀 Overview

**ObjectsTransmitter** is backend built with NestJS for storing, serving, and managing 3D model files (.obj, .usdz, .glb).  
It uses AppWrite for storage and authentication, PostgreSQL for persistent data, JWT for session management, and an automated daily backup process.

---

## 🛠️ Technologies

- **Node.js v18+**  
- **NestJS v10**  
- **TypeScript**  
- **PostgreSQL v15** (via Docker Compose or managed service)  
- **TypeORM**  
- **AppWrite**  
  - Storage (upload/download)  
  - Auth (email/password, sessions)  
- **JWT** (access & refresh flows)  
- **@nestjs/schedule** (cron backup)  

---

## 🔒 Security Measures

- **JWT tokens** with expiration (`expiresIn`)  
- **Refresh endpoint** to renew access token before expiry  
- **Unique username** check via AppWrite Users service  
- **Rate limiting** (can be added with Guards) 
- **Strict CORS** & helmet middleware  
- **Environment variables** for all secrets (`.env`), not committed  

---

## ✨ API Endpoints

### Authentication

- `POST /v1/auth/signup`  
  Register a new user, create AppWrite account & session, return JWT.

- `POST /v1/auth/login`  
  Login existing user via AppWrite, return JWT & session ID.

- `POST /v1/auth/refresh`  
  If access token has <15 min left, return a new JWT.

- `POST /v1/auth/logout`  
  Invalidate the AppWrite session.

### Models

- `GET  /v1/models`  
  Returns list of models (GeneralInfoDTO).

- `GET  /v1/models/:id`  
  Returns detailed info for one model (ObjectDetailsDTO).

- `POST /v1/models`  
  Upload a new model file (multipart/form-data).

- `DELETE /v1/models/:id`  
  Delete a model (removes from AppWrite & database).

### Users

> Note: `POST /v1/users` is deprecated—use the Auth flow instead.

- `GET    /v1/users`  
  List all users (GeneralInfoDTO).

- `GET    /v1/users/:id`  
  Get one user’s profile (detailed).

- `PATCH  /v1/users/:id`  
  Update username or name.

- `DELETE /v1/users/:id`  
  Delete a user (models remain, owner set to null).

---

## 🏁 Local Dev

1. **Clone the repo**  
   ```bash
   git clone https://github.com/<your-org>/objects-transmitter-backend.git
   cd objects-transmitter-backend
   ```

2. **Set configure .env (look .env.public)**

3. **Start with Docker Compose**
    ```bash
    docker-compose up --build
    ```

    - Postgres runs on localhost:5432
	- Backend runs on http://localhost:3000

4. **Test via curl or Postman**
    ```bash
    curl http://localhost:3000/v1/health
    curl http://localhost:3000/v1/models
    ```


## 📖 Swagger Documentation

After starting the app, open:

    ```bash
    http://localhost:3000/api
    ```

to view interactive API docs with request/response schemas.