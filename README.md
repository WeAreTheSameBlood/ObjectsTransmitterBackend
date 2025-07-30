# ObjectsTransmitter Backend

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![NestJS](https://img.shields.io/badge/NestJS-v10+-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15+-blue)
![AppWrite](https://img.shields.io/badge/AppWrite-v1.6+-orange)

---

## 🚀 Overview

**ObjectsTransmitter** is backend built with NestJS for storing, serving, and managing 3D model files (.obj, .glb).  
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

### Models

- `POST /v1/models`  
  Upload a new model file (multipart/form-data)

- `GET  /v1/models`  
  Returns list of models with general data

- `GET  /v1/models/:id`  
  Returns detailed info for one model with details data

- `GET /v1/models/by_user/:user_id`  
  Return list of models for specific User

- `POST /v1/models/:id`  
  Deleting model by id and return result

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

---

## 📖 Swagger Documentation

After starting the app, open:
```bash
http://localhost:3000/api/docs
```

to view interactive API docs with request/response schemas.