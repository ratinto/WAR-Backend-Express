# API Routes - Django to Express Migration

## Route Mapping (Django → Express)

All routes maintain the same structure for frontend compatibility.

### Authentication Routes

| Method | Django URL | Express URL | Controller | Description |
|--------|-----------|-------------|------------|-------------|
| POST | `/api/auth/student/login/` | `/api/auth/student/login` | `studentLogin` | Student login |
| POST | `/api/auth/student/signup/` | `/api/auth/student/signup` | `studentSignup` | Student registration |
| POST | `/api/auth/washerman/login/` | `/api/auth/washerman/login` | `washermanLogin` | Washerman login |
| POST | `/api/auth/washerman/signup/` | `/api/auth/washerman/signup` | `washermanSignup` | Washerman registration |

### Order Routes

| Method | Django URL | Express URL | Controller | Description |
|--------|-----------|-------------|------------|-------------|
| POST | `/api/orders/create/` | `/api/orders/create` | `createOrder` | Create new order |
| GET | `/api/orders/student/<bag_no>/` | `/api/orders/student/:bagNo` | `getStudentOrders` | Get student's orders |
| GET | `/api/orders/all/` | `/api/orders/all` | `getAllOrders` | Get all orders |
| GET | `/api/orders/pending/` | `/api/orders/pending` | `getPendingOrders` | Get pending orders |
| PUT | `/api/orders/<order_id>/status/` | `/api/orders/:orderId/status` | `updateOrderStatus` | Update order status |
| PUT | `/api/orders/<order_id>/count/` | `/api/orders/:orderId/count` | `updateOrderCount` | Update clothes count |

### Dashboard Routes

| Method | Django URL | Express URL | Controller | Description |
|--------|-----------|-------------|------------|-------------|
| GET | `/api/student/dashboard/<bag_no>/` | `/api/student/dashboard/:bagNo` | `getStudentDashboard` | Student dashboard data |
| GET | `/api/washerman/dashboard/` | `/api/washerman/dashboard` | `getWashermanDashboard` | Washerman dashboard data |

---

## Request/Response Formats

### Student Login
**POST** `/api/auth/student/login`

```json
// Request
{
  "email": "student@rishihood.edu.in",
  "password": "password123"
}

// Response (Success)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "bagNo": "B-001",
    "name": "John Doe",
    "email": "student@rishihood.edu.in",
    "enrollmentNo": "ENR001",
    "phoneNo": "1234567890",
    "residencyNo": "R101",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Student Signup
**POST** `/api/auth/student/signup`

```json
// Request
{
  "bagNo": "B-001",
  "name": "John Doe",
  "email": "student@rishihood.edu.in",
  "enrollmentNo": "ENR001",
  "password": "password123",
  "phoneNo": "1234567890",
  "residencyNo": "R101"
}

// Response (Success)
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "bagNo": "B-001",
    "name": "John Doe",
    "email": "student@rishihood.edu.in",
    "enrollmentNo": "ENR001",
    "phoneNo": "1234567890",
    "residencyNo": "R101",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Order
**POST** `/api/orders/create`

```json
// Request
{
  "bagNo": "B-001",
  "numberOfClothes": 10
}

// Response (Success)
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "bagNo": "B-001",
    "numberOfClothes": 10,
    "status": "PENDING",
    "submissionDate": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Order Status
**PUT** `/api/orders/:orderId/status`

```json
// Request
{
  "status": "inprogress"
}

// Response (Success)
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "bagNo": "B-001",
    "numberOfClothes": 10,
    "status": "INPROGRESS",
    "submissionDate": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:01:00.000Z"
  }
}
```

### Student Dashboard
**GET** `/api/student/dashboard/:bagNo`

```json
// Response (Success)
{
  "success": true,
  "data": {
    "student": {
      "bagNo": "B-001",
      "name": "John Doe",
      "email": "student@rishihood.edu.in",
      "enrollmentNo": "ENR001",
      "phoneNo": "1234567890",
      "residencyNo": "R101",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "totalOrders": 10,
    "pendingOrders": 2,
    "inprogressOrders": 3,
    "completeOrders": 5,
    "recentOrders": [
      {
        "id": 10,
        "bagNo": "B-001",
        "numberOfClothes": 15,
        "status": "COMPLETE",
        "submissionDate": "2024-01-10T00:00:00.000Z",
        "createdAt": "2024-01-10T00:00:00.000Z",
        "updatedAt": "2024-01-10T01:00:00.000Z"
      }
      // ... up to 5 recent orders
    ]
  }
}
```

---

## Validation Rules

### Student Signup
- ✅ `bagNo`: Required, must match pattern `/^[BG]-\d+$/`
- ✅ `name`: Required, non-empty string
- ✅ `email`: Required, valid email, must end with `rishihood.edu.in`
- ✅ `enrollmentNo`: Required, non-empty string
- ✅ `password`: Required, minimum 6 characters
- ✅ `phoneNo`: Required, non-empty string
- ✅ `residencyNo`: Required, non-empty string

### Create Order
- ✅ `bagNo`: Required, non-empty string
- ✅ `numberOfClothes`: Required, integer between 1-50

### Update Order Status
- ✅ `status`: Required, one of: `pending`, `inprogress`, `complete`
- ✅ Status transitions: 
  - `pending` → `inprogress` (Received)
  - `inprogress` → `complete` (Ready)

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ],
  "statusCode": 400
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation, invalid input)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

---

## Testing with cURL

### Student Login
```bash
curl -X POST http://localhost:8000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@rishihood.edu.in","password":"password123"}'
```

### Create Order
```bash
curl -X POST http://localhost:8000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{"bagNo":"B-001","numberOfClothes":10}'
```

### Get Student Dashboard
```bash
curl http://localhost:8000/api/student/dashboard/B-001
```

---

✅ All 14 endpoints implemented and ready for testing!
