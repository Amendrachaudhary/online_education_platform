<div align="center">
  
![favicon](https://github.com/user-attachments/assets/ba86af86-a98e-4842-9cc4-5871c5ef234b)

</div>

# NANDANI's SCHOOL 🎓 - Advanced Learning Management System with DBMS Features

NANDANI's SCHOOL is a comprehensive learning management system (LMS) built with advanced database management features. It provides educators and students with a seamless e-learning experience, featuring a robust PostgreSQL database with stored procedures, triggers, views, and transactions.

## 🚀 Tech Stack

### Frontend:
- **React** (via Vite) ⚡
- **React Router DOM** for navigation
- **React Toastify** for notifications
- **Framer Motion** for animations
- **Quill** for rich text editing
- **Axios** for API requests
- **RC Progress** for progress tracking
- **React YouTube** for video embedding
- **Clerk Authentication** for user management

### Backend:
- **Node.js** & **Express.js** 🚀
- **PostgreSQL** & **Sequelize ORM** for relational database
- **Cloudinary** for media storage
- **Multer** for file uploads
- **Stripe** for payment processing
- **Cors** for cross-origin requests
- **Dotenv** for environment variables
- **Nodemon** for development

### Database Features:
- ✅ **Normalized Schema** (3NF) with proper relationships
- ✅ **Stored Procedures** for complex operations
- ✅ **Triggers** for automatic data updates
- ✅ **Views** for analytics and reporting
- ✅ **Transactions** for atomic operations
- ✅ **Indexes** for performance optimization
- ✅ **Constraints** (Foreign Keys, Unique, Check)
- ✅ **Activity Logging** via triggers

---

## 📂 Project Structure

### **Frontend (`client/`)**
```
📦 client
 ├── 📂 src
 │   ├── 📂 assets
 │   ├── 📂 components
 │   │   ├── 📂 educator
 │   │   │   ├── Footer.jsx
 │   │   │   ├── Navbar.jsx
 │   │   │   ├── Sidebar.jsx
 │   │   ├── 📂 student
 │   │   │   ├── Logger.jsx
 │   ├── 📂 context
 │   │   ├── AppContext.jsx
 │   ├── 📂 pages
 │   │   ├── 📂 educator
 │   │   │   ├── AddCourse.jsx
 │   │   │   ├── Dashboard.jsx
 │   │   │   ├── Educator.jsx
 │   │   │   ├── MyCourses.jsx
 │   │   │   ├── StudentsEnrolled.jsx
 │   │   ├── 📂 student
 │   │   │   ├── CourseDetails.jsx
 │   │   │   ├── CoursesList.jsx
 │   │   │   ├── Home.jsx
 │   │   │   ├── MyEnrollMents.jsx
 │   │   │   ├── Player.jsx
 │   │   ├── App.jsx
 │   │   ├── index.css
 │   │   ├── main.jsx
 ├── 📜 .env
 ├── 📜 .gitignore
 ├── 📜 package.json
 ├── 📜 tailwind.config.js
 ├── 📜 vite.config.js
```

### **Backend (`server/`)**
```
📦 server
 ├── 📂 configs
 │   ├── cloudinary.js
 │   ├── database.js (PostgreSQL + Sequelize)
 │   ├── multer.js
 ├── 📂 controllers
 │   ├── courseController.js
 │   ├── educatorController.js
 │   ├── userController.js
 │   ├── webhooks.js
 ├── 📂 database
 │   ├── education_system.sql (Complete DB schema)
 ├── 📂 middlewares
 │   ├── authMiddleware.js
 ├── 📂 models
 │   ├── User.js
 │   ├── Course.js
 │   ├── Lesson.js
 │   ├── Enrollment.js
 │   ├── Progress.js
 │   ├── Payment.js
 │   ├── Review.js
 │   ├── ActivityLog.js
 │   ├── index.js (Relationships)
 ├── 📂 routes
 │   ├── courseRoute.js
 │   ├── educatorRoutes.js
 │   ├── userRoutes.js
 ├── 📂 utils
 │   ├── dbProcedures.js (Stored procedure helpers)
 ├── 📜 .env
 ├── 📜 .gitignore
 ├── 📜 package.json
 ├── 📜 server.js
```

---

## 🗄️ Database Schema

### **Tables:**
1. **users** - User information (students, teachers, admin)
2. **courses** - Course details
3. **lessons** - Individual lessons within courses
4. **enrollments** - Student-course enrollments (Many-to-Many)
5. **progress** - Student progress tracking
6. **payments** - Payment records
7. **reviews** - Course reviews and ratings
8. **activity_logs** - System activity logging

### **Relationships:**
- 1 Teacher → Many Courses
- 1 Student → Many Enrollments
- 1 Course → Many Lessons
- 1 Enrollment → Many Progress Records
- Many-to-Many: Students ↔ Courses (via enrollments)

### **DBMS Features Implemented:**

#### 1. **Stored Procedures:**
- `enroll_student()` - Atomic enrollment + payment creation
- `compute_course_progress()` - Calculate completion percentage
- `get_top_courses_by_enrollment()` - Analytics query

#### 2. **Triggers:**
- Auto-update progress completion timestamps
- Auto-enroll on payment success
- Activity logging for courses and enrollments

#### 3. **Views:**
- `view_top_courses` - Top courses by enrollment
- `view_teacher_performance` - Teacher analytics
- `view_monthly_enrollments` - Monthly statistics
- `view_student_progress` - Student progress summary
- `view_revenue_report` - Revenue analytics

#### 4. **Transactions:**
- Atomic enrollment + payment operations
- Rollback on errors
- Serializable isolation level for consistency

#### 5. **Indexes:**
- Optimized indexes on frequently queried columns
- Composite indexes for complex queries

---

## 🌟 Features

✅ **User Authentication** (Signup, Login, Clerk Integration)  
✅ **Course Management** (Add, Edit, Delete, Enroll)  
✅ **Video Streaming** (Embedded YouTube player)  
✅ **Progress Tracking** (Course Completion)  
✅ **Educator Dashboard** (Monitor students)  
✅ **Secure Payments** (Stripe integration with transactions)  
✅ **Responsive Design** (Mobile-friendly UI)  
✅ **Advanced DBMS Features** (Procedures, Triggers, Views, Transactions)

---

## ⚡ Installation & Setup

### 1️⃣ Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### 2️⃣ Clone the Repository
```bash
git clone <repository-url>
cd Edemy-LMS
```

### 3️⃣ Database Setup

#### Install PostgreSQL and create database:
```bash
# Create database
createdb nandani_school

# Or using psql:
psql -U postgres
CREATE DATABASE nandani_school;
\q
```

#### Run SQL script to create schema:
```bash
cd server/database
psql -U postgres -d nandani_school -f education_system.sql
```

### 4️⃣ Install Dependencies

#### Frontend:
```bash
cd client
npm install
```

#### Backend:
```bash
cd server
npm install
```

### 5️⃣ Setup Environment Variables

#### Backend (`server/.env`):
```env
# Database
DB_NAME=nandani_school
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Server
PORT=3000
NODE_ENV=development

# Clerk
CLERK_SECRET_KEY=your_clerk_secret
CLERK_WEBHOOK_SECRET=your_webhook_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CURRENCY=usd

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`client/.env`):
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 6️⃣ Run the Application

#### Backend:
```bash
cd server
npm start
# or for development:
npm run server
```

#### Frontend:
```bash
cd client
npm run dev
```

---

## 📊 Database Queries & Examples

### Complex Queries:

#### 1. Students who haven't completed course after 30 days:
```sql
SELECT 
    u.name,
    c.course_title,
    e.enrollment_date,
    CURRENT_DATE - e.enrollment_date::DATE as days_enrolled,
    compute_course_progress(u.user_id, c.course_id) as completion_percentage
FROM users u
JOIN enrollments e ON u.user_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE CURRENT_DATE - e.enrollment_date::DATE > 30
  AND compute_course_progress(u.user_id, c.course_id) < 100
ORDER BY days_enrolled DESC;
```

#### 2. Teacher with highest average rating:
```sql
SELECT 
    u.name,
    AVG(r.rating) as avg_rating,
    COUNT(r.review_id) as review_count
FROM users u
JOIN courses c ON u.user_id = c.teacher_id
JOIN reviews r ON c.course_id = r.course_id
WHERE u.role = 'teacher'
GROUP BY u.user_id, u.name
ORDER BY avg_rating DESC
LIMIT 1;
```

#### 3. Top 5 courses by enrollment:
```sql
SELECT * FROM get_top_courses_by_enrollment(5);
```

---

## 🔥 Deployment

This project is set up for deployment on **Vercel** or any Node.js hosting platform.

### Deploy Backend
```bash
cd server
vercel --prod
```

### Deploy Frontend
```bash
cd client
vercel --prod
```

### Database Backup:
```bash
pg_dump -U postgres nandani_school > backup.sql
```

### Database Restore:
```bash
psql -U postgres nandani_school < backup.sql
```

---

## 📚 Documentation

### ER Diagram
See `database/education_system.sql` for complete schema definition.

### API Documentation
- Base URL: `http://localhost:3000`
- Endpoints:
  - `GET /api/course/all` - Get all published courses
  - `GET /api/course/:id` - Get course by ID
  - `POST /api/user/purchase` - Purchase course (with transaction)
  - `POST /api/user/update-course-progress` - Update progress
  - `GET /api/educator/dashboard` - Educator dashboard data

---

## 🔐 License
This project is licensed under the [MIT License](LICENSE).

---

## 🎯 Contributors

👤 **NANDANI's SCHOOL Development Team**  
📧 Contact: [your-email@example.com](mailto:your-email@example.com)

---

## 🌐 Connect with Us

- **Name**: NANDANI's SCHOOL
- **Email**: [contact@nandanischool.com](mailto:contact@nandanischool.com)

---

## Thank you for checking out **NANDANI's SCHOOL**! Happy learning! 😊

---

## ⭐ Support
Give a ⭐ if you like this project!

---

Made with ❤️ by NANDANI's SCHOOL Team

### ⭐ Show Some Love!

If you like this project, don't forget to leave a **⭐ Star** on GitHub! 🚀
