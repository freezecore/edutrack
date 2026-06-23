# EduTrack

This repository contains two parts:

- `backend/` – Python backend and CLI application
- `FRONTEND/` – React + Vite frontend

## Backend

The backend is a Python service using the standard library only.

Run from the repository root:

```powershell
python .\backend\server.py
```

The backend stores student data in `database.json` automatically.

## Frontend

Install dependencies and start the Vite app from the frontend folder:

```powershell
cd FRONTEND
pnpm install
pnpm dev
```

## Notes

- Add or update backend dependencies in `backend/requirements.txt`
- The frontend uses TypeScript, React, and Vite
