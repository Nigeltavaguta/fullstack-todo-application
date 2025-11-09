# Full-Stack Todo Application

A complete full-stack application with FastAPI backend and React/TypeScript frontend.

## Features

- User registration and login
- JWT token authentication
- Protected routes
- Responsive UI with Tailwind CSS
- Logging

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, SQLite, JWT, Python-Jose, Passlib, Uvicorn  
**Frontend:** React 19, TypeScript, Vite, Axios, Tailwind CSS  
**Authentication:** JWT Tokens, BCrypt Password Hashing

## Prerequisites

- Python 3.8+
- Node.js 20+
- npm

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd app
python -m uvicorn main:app --reload --port 8000`
```

### frontend

`bash npm run dev`
