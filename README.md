# 🚀 AI Prompt Library

A full-stack web application for creating, storing, and managing AI image generation prompts.

---

## 🧰 Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | Angular 16 (Reactive Forms)         |
| Backend   | Django 4.2 (Standard views, no DRF) |
| Database  | PostgreSQL 14                       |
| Cache     | Redis 7 (view counter tracking)     |
| Container | Docker + Docker Compose             |

---

## ▶️ Running the Project

### 📌 Prerequisites

* Docker
* Docker Compose

---

### 📦 Setup Steps

#### 1. Clone the repository

```bash
git clone <repo-url>
cd ai-prompt-library
```

---

#### 2. Start the application

```bash
docker-compose up --build
```

This will start:

* Backend API
* Frontend UI
* Database
* Redis cache

---

#### 3. Access the application

* 🌐 Frontend: [http://localhost:4200](http://localhost:4200)
* 🔐 Admin Panel: [http://localhost:8000/admin](http://localhost:8000/admin)

---

#### 4. Create admin user

Run:

```bash
docker exec -it prompt_backend python manage.py createsuperuser
```

---

## 🛑 Stop the application

```bash
docker-compose down
```

Remove all data (including database):

```bash
docker-compose down -v
```

---

## 🔌 API Endpoints

All APIs return JSON responses.

---

### 📄 Get all prompts

```
GET /prompts/
```

Returns a list of all stored prompts.

---

### 📄 Get single prompt

```
GET /prompts/:id/
```

Returns details of a specific prompt and increments its view count using Redis.

---

## 📸 Screenshots

### Prompt List

![Prompt List](image.png)

### Prompt Detail

![Prompt Detail](image-1.png)



