---
# Project Setup and Deployment Guide
---

## Project Setup and Deployment Guide

` This guide will help you set up and run the project locally using Docker as well as deploy it on a server. The project includes a Vite React frontend and a Node.js backend, both managed with Docker containers.`

## Table of Contents

1. [Requirements](#requirements)
2. [Local Setup](#local-setup)
3. [Deployment Guide for Server](#deployment-guide-for-server)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

### Requirements

- **Docker**: Required to containerize and run the application.
- **Docker Compose**: Manages the multi-container setup.
- **Git**: For cloning the repository.

> **Note:** The `deploy.sh` script will install Docker and Docker Compose if not already installed when deploying to a server.

---

### Local Setup

To run the project locally using Docker:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/DipakTech/task-app.git
   cd task-app
   ```

2. **Set Up Environment Variables**

   - Create `.env` files in both the `frontend` and `backend` directories with the following dummy values:

     **For Backend** (`backend/.env`):

     ```env
     PORT=4000
     NODE_ENV=production
     ACCESS_TOKEN_SECRET=myaccesstokensecret
     POSTGRES_URL="postgres://user:password@localhost:5432/mydatabase"
     POSTGRES_PRISMA_URL="postgres://user:password@localhost:5432/mydatabase"
     POSTGRES_URL_NO_SSL="postgres://user:password@localhost:5432/mydatabase"
     POSTGRES_URL_NON_POOLING="postgres://user:password@localhost:5432/mydatabase"
     POSTGRES_USER="user"
     POSTGRES_HOST="localhost"
     POSTGRES_PASSWORD="password"
     POSTGRES_DATABASE="mydatabase"
     ```

     **For Frontend** (`frontend/.env`):

     ```env
     VITE_BASE_URL="http://localhost:4000/api/"
     VITE_API_KEY=sampleapikey
     ```

3. **Build and Start Containers**
   Run the following command from the project root:

   ```bash
   docker-compose up --build -d
   ```

4. **Access the Application**

   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:4000/api

   > **Note:** The `docker-compose.yml` file handles container networking, so the frontend will automatically connect to the backend API.

---

### Deployment Guide for Server

The `deploy.sh` script will automate the deployment process on a server, including installing Docker, Docker Compose, and Nginx, as well as setting up environment variables.

#### Steps

1. **Upload or Access the Server**:

   - Upload `deploy.sh` to the server or log in via SSH.

2. **Run the Deployment Script**

   ```bash
   sudo bash deploy.sh
   ```

   The script performs the following:

   - Installs Docker and Docker Compose (if not already installed).
   - Configures Nginx as a reverse proxy for backend and frontend, with rate limiting.
   - Clones the GitHub repository if not already present.
   - Sets up swap memory to improve server performance.
   - Creates environment files for both frontend and backend.
   - Builds and launches Docker containers.
   - Configures Nginx to start on boot and manages traffic.

3. **Access the Application**
   - The application will be available at `http://your-domain.com` (replace with your server’s domain).

---

### Environment Variables

Below are the main environment variables used in the `.env` files:

| Variable              | Description                         | Example Value                                        |
| --------------------- | ----------------------------------- | ---------------------------------------------------- |
| `PORT`                | Port for the backend server         | `4000`                                               |
| `NODE_ENV`            | Node environment (e.g., production) | `production`                                         |
| `ACCESS_TOKEN_SECRET` | Token secret for authentication     | `myaccesstokensecret`                                |
| `POSTGRES_URL`        | Primary database connection URL     | `postgres://user:password@localhost:5432/mydatabase` |
| `VITE_BASE_URL`       | Base URL for API in the frontend    | `http://localhost:4000/api/`                         |
| `VITE_API_KEY`        | API key for frontend                | `sampleapikey`                                       |

Replace dummy values with actual secrets and URLs as necessary for production.

---

### Troubleshooting

- **Check Container Status**:

  ```bash
  docker-compose ps
  ```

- **View Logs**:
  - **Nginx Logs**:
    ```bash
    sudo journalctl -u nginx
    ```
  - **Docker Logs**:
    ```bash
    docker-compose logs
    ```

For any configuration changes, repeat the steps for updating environment variables and restart the containers.

---

This guide provides step-by-step instructions for running and deploying the application. For additional help, refer to the logs in the troubleshooting section.

Let me know if you need further details!
