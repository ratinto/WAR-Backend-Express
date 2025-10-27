# 🧺 WAR Backend - Express.js

**Washing At Rishihood** - Backend API built with Express.js, TypeScript, PostgreSQL, and Prisma ORM.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: bcrypt + JWT (optional)
- **Validation**: express-validator

## 📁 Project Structure

```
WAR-Backend-Express/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma client & DB connection
│   │   └── env.ts       # Environment variables
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts
│   │   ├── cors.ts
│   │   └── validateRequest.ts
│   ├── utils/           # Helper functions
│   │   ├── validators.ts
│   │   ├── passwordHash.ts
│   │   └── responseFormatter.ts
│   ├── services/        # Business logic layer
│   │   ├── student.service.ts
│   │   ├── washerman.service.ts
│   │   └── order.service.ts
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── order.controller.ts
│   │   └── dashboard.controller.ts
│   ├── routes/          # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── order.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── .env                 # Environment variables
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd WAR-Backend-Express
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=8000
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@host:port/database"
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=*
   EMAIL_DOMAIN=rishihood.edu.in
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

## 💻 Development

### Start development server
```bash
npm run dev
```

The server will start on `http://localhost:8000`

### Build for production
```bash
npm run build
npm start
```

### Prisma commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Push schema changes without migration
npm run prisma:push
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/student/login` | Student login |
| POST | `/api/auth/student/signup` | Student registration |
| POST | `/api/auth/washerman/login` | Washerman login |
| POST | `/api/auth/washerman/signup` | Washerman registration |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/create` | Create new order |
| GET | `/api/orders/student/:bag_no` | Get student orders |
| GET | `/api/orders/all` | Get all orders |
| GET | `/api/orders/pending` | Get pending orders |
| PUT | `/api/orders/:order_id/status` | Update order status |
| PUT | `/api/orders/:order_id/count` | Update clothes count |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/dashboard/:bag_no` | Student dashboard data |
| GET | `/api/washerman/dashboard` | Washerman dashboard data |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |

## 📊 Database Schema

### Student Model
```prisma
model Student {
  bagNo        String   @id
  name         String
  email        String   @unique
  enrollmentNo String   @unique
  password     String
  phoneNo      String
  residencyNo  String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  orders       Order[]
}
```

### Washerman Model
```prisma
model Washerman {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

### Order Model
```prisma
model Order {
  id              Int      @id @default(autoincrement())
  bagNo           String
  numberOfClothes Int
  status          Status   @default(PENDING)
  submissionDate  DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  student         Student  @relation(fields: [bagNo], references: [bagNo])
}

enum Status {
  PENDING
  INPROGRESS
  COMPLETE
}
```

## 🏗️ Architecture

### MVC Pattern
```
Request → Routes → Controllers → Services → Database
                        ↓
                   Response ← Middleware
```

### Flow Example
1. **Client** sends request to `/api/orders/create`
2. **Routes** match the endpoint and forward to controller
3. **Controller** validates input using middleware
4. **Service** handles business logic
5. **Prisma** queries PostgreSQL database
6. **Response** formatted and sent back to client

## 🔒 Security Features

- Password hashing with bcrypt
- Input validation with express-validator
- CORS protection
- Environment variable security
- SQL injection protection via Prisma

## 📝 Development Status

✅ Project structure created  
✅ Dependencies installed  
⏳ Database schema (Next Task)  
⏳ Middleware & utilities (Next Task)  
⏳ Services layer (Next Task)  
⏳ Controllers (Next Task)  
⏳ Routes (Next Task)  
⏳ Testing (Next Task)  

## 📧 Contact

For issues or questions, please contact the development team.

---

**Migration from Django REST Framework to Express.js - In Progress** 🚀
# WAR-Backend-Express
