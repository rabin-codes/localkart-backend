# LocalKart Deployment Guide

This guide explains how to deploy the LocalKart platform to the cloud so it is accessible via a public URL.

## Recommended Hosting Strategy
- **Backend & Database**: [Railway](https://railway.app/) (Easiest for Spring Boot + MySQL)
- **Frontend**: [Vercel](https://vercel.com/) (Standard for React/Vite)

---

## 1. Deploying the Backend (Railway)

1.  **Create a New Project**:
    - Go to [Railway.app](https://railway.app/) and create an account.
    - Click **+ New Project** -> **GitHub Repo**.
    - Select your `localkart-backend` repository.
2.  **Add MySQL**:
    - Click **+ Add** -> **Database** -> **MySQL**.
    - Railway will automatically provide connection variables (`MYSQLHOST`, `MYSQLUSER`, etc.).
3.  **Configure Environment Variables**:
    - In your Railway Backend service, go to **Variables** and add:
        - `SPRING_DATASOURCE_URL` = `jdbc:mysql://${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}`
        - `SPRING_DATASOURCE_USERNAME` = `${{MYSQLUSER}}`
        - `SPRING_DATASOURCE_PASSWORD` = `${{MYSQLPASSWORD}}`
        - `JWT_SECRET` = `(Generate a long random string)`
4.  **Root Directory**:
    - Set the **Root Directory** in settings to `/backend`.
5.  **Build Command**: Railway will automatically detect the `pom.xml` and build using Maven.

---

## 2. Deploying the Frontend (Vercel)

1.  **Create a New Project**:
    - Go to [Vercel.com](https://vercel.com/) and import your repository.
2.  **Project Configuration**:
    - **Framework Preset**: Vite
    - **Root Directory**: `frontend`
3.  **Environment Variables**:
    - Add `VITE_API_BASE_URL` = `(Your Railway Backend URL)/api`
4.  **Deploy**: Vercel will build and give you a `.vercel.app` link.

---

## 3. Local Production Run
If you just want to run the project perfectly locally:
1.  Open PowerShell as Administrator.
2.  Run: `.\run-project.ps1`

This will seed the database, start the backend/frontend, and open the browser.
