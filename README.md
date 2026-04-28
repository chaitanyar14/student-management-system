# Student Management System

A full-stack, production-ready Student Management System built with React, Node.js, Express, and MySQL. It features a modern, responsive UI with JWT-based authentication.

## Project Structure

```
student-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js  # Login/Signup logic
│   │   └── studentController.js # CRUD operations for students
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── validation.js      # Input validation logic
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth routes
│   │   └── studentRoutes.js   # /api/students routes
│   ├── .env.example
│   ├── Dockerfile             # Docker config for the backend
│   ├── package.json
│   └── server.js              # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # React Context (AuthContext)
│   │   ├── pages/             # Route components (Login, Signup, Dashboard)
│   │   ├── App.jsx            # Main app routing
│   │   ├── index.css          # Tailwind and custom styles
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── database/
    └── schema.sql             # SQL scripts for creating tables
```

## Local Setup Instructions

### Prerequisites
- Node.js (v16+)
- MySQL Server running locally or remotely

### 1. Database Setup
1. Open your MySQL client or CLI.
2. Execute the `database/schema.sql` script to create the database and required tables (`users` and `students`).

### 2. Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and update your database credentials.
4. Run the development server: `npm run dev`
5. The API will be available at `http://localhost:5000`

### 3. Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env`. (Default is `VITE_API_URL=http://localhost:5000/api`)
4. Start the Vite dev server: `npm run dev`
5. The app will be available at `http://localhost:5173`

## Deployment on AWS

### 1. Database (RDS)
1. Create an RDS instance in AWS selecting the MySQL engine.
2. Ensure the Security Group allows inbound traffic on port 3306 from your EC2 instance.
3. Connect to the RDS endpoint using a database client and run the `database/schema.sql` script.
4. Note down the endpoint URL, username, and password for the backend environment variables.

### 2. Backend (EC2 & Docker)
1. Launch an EC2 instance (e.g., Ubuntu 22.04).
2. SSH into the instance and install Docker.
3. Clone this repository or transfer the `backend` code.
4. In the `backend` directory, create a `.env` file containing your production variables, including the RDS endpoint.
5. Build the Docker image: `docker build -t student-api .`
6. Run the container: `docker run -d -p 5000:5000 --env-file .env student-api`
7. Ensure your EC2 Security Group allows inbound traffic on port 5000. Use an Elastic IP if needed.
8. Update the frontend `VITE_API_URL` to point to `http://<YOUR_EC2_IP>:5000/api`.

### 3. Frontend (S3 & CloudFront)
1. In the `frontend` directory, ensure `.env.production` points to your EC2 backend IP.
2. Build the production application: `npm run build`
3. Create an S3 bucket and enable static website hosting.
4. Uncheck "Block all public access" and add a bucket policy to allow public read access.
5. Upload the contents of the `frontend/dist` folder to your S3 bucket.
6. (Optional but Recommended) Setup AWS CloudFront pointing to your S3 bucket to provide HTTPS and global CDN caching.
