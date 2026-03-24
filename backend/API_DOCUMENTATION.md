# XIS Wallet Backend API Documentation

## Server Status
✅ Django Server Running on `http://localhost:8000/`

## API Endpoints

### Authentication

#### 1. **Signup** 
- **URL:** `POST /api/auth/signup/`
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main St, City, State 12345",
  "password": "securePassword123"
}
```
- **Response:**
```json
{
  "token": "5a7c8b9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
  "user": {
    "id": 1,
    "username": "john@example.com",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St, City, State 12345"
  }
}
```

#### 2. **Login**
- **URL:** `POST /api/auth/login/`
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response:**
```json
{
  "token": "5a7c8b9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
  "user": {
    "id": 1,
    "username": "john@example.com",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St, City, State 12345"
  }
}
```

### Images

#### 1. **Get All Images**
- **URL:** `GET /api/images/`
- **Response:** List of images with metadata

#### 2. **Upload Image**
- **URL:** `POST /api/images/`
- **Headers:** `Authorization: Bearer {token}` (optional)
- **Form Data:** `file` (image file)
- **Response:** Image object with metadata

#### 3. **Delete Image**
- **URL:** `DELETE /api/images/{id}/`
- **Headers:** `Authorization: Bearer {token}` (optional)
- **Response:** Success message

## Database Models

### User
- Extends Django's built-in User model
- Fields: username, email, password, first_name, last_name

### UserProfile
- **Fields:**
  - user (OneToOne relationship with User)
  - address (TextField)
  - created_at (DateTime)

### Image
- **Fields:**
  - name (CharField)
  - file (ImageField)
  - size (CharField)
  - image_type (CharField)
  - date_uploaded (DateTime)

## Frontend Integration

The frontend is configured to:
- Make API calls to `http://localhost:8000/api`
- Store authentication tokens in localStorage
- Include tokens in Authorization headers for protected endpoints

## Installation & Setup Completed

✅ UserProfile model created
✅ Authentication serializers implemented
✅ Login/Signup endpoints created
✅ Database migrations applied
✅ CORS configured
✅ Django server running on port 8000

## Next Steps

1. Test the endpoints using Postman or the frontend
2. Implement additional features as needed
3. Add more validation rules as required
