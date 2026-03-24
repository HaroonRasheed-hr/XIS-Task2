# XIS Wallet Backend API Documentation

## Server Status
✅ Django Server Running on `http://localhost:8000/`

## Key Features
- **User Authentication**: Each user has their own account
- **Personal Image Storage**: Users can only see and manage their own images
- **Secure Access**: Token-based authentication for all image operations

## API Endpoints

### Authentication

#### 1. **Signup** 
- **URL:** `POST /api/auth/signup/`
- **Auth Required:** No
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
- **Auth Required:** No
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

### Images (User-Specific)

#### 1. **Get My Images**
- **URL:** `GET /api/images/`
- **Auth Required:** Yes (Bearer Token)
- **Description:** Returns only the authenticated user's images
- **Headers:**
```
Authorization: Bearer {token}
```
- **Response:**
```json
[
  {
    "id": 1,
    "user": "john@example.com",
    "name": "photo.jpg",
    "size": "2.5 MB",
    "type": "jpg",
    "url": "http://localhost:8000/media/images/...",
    "date": "Mar 25"
  }
]
```

#### 2. **Upload Image**
- **URL:** `POST /api/images/`
- **Auth Required:** Yes (Bearer Token)
- **Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```
- **Form Data:** `file` (image file)
- **Response:**
```json
{
  "id": 1,
  "user": "john@example.com",
  "name": "photo.jpg",
  "size": "2.5 MB",
  "type": "jpg",
  "url": "http://localhost:8000/media/images/...",
  "date": "Mar 25"
}
```

#### 3. **Delete Image**
- **URL:** `DELETE /api/images/{id}/`
- **Auth Required:** Yes (Bearer Token)
- **Restrictions:** User can only delete their own images
- **Headers:**
```
Authorization: Bearer {token}
```
- **Response Status:** 204 No Content
- **Error on unauthorized delete:** 403 Forbidden

## Database Models

### User
- Extends Django's built-in User model
- Fields: username, email, password, first_name, last_name

### UserProfile
- **Fields:**
  - user (OneToOne relationship with User)
  - address (TextField)
  - created_at (DateTime)

### Image ⭐ (User-Scoped)
- **Fields:**
  - user (ForeignKey to User) - **Each image belongs to a specific user**
  - name (CharField)
  - file (ImageField)
  - size (CharField)
  - image_type (CharField)
  - date_uploaded (DateTime)

## Security Features

✅ **User Isolation**
- Users can only see their own images
- Users can only delete their own images

✅ **Authentication**
- Token-based authentication required for image operations
- Automatic logout on 401 Unauthorized

✅ **Permissions**
- 403 Forbidden returned if user tries to delete another user's image
- 401 Unauthorized returned if no token provided

## Frontend Integration

The frontend automatically:
- Stores authentication tokens in localStorage
- Includes tokens in Authorization headers for all image API calls
- Filters images to show only the authenticated user's images
- Redirects to login on 401 errors
- Prevents unauthenticated users from accessing the dashboard

## Installation & Setup Completed

✅ UserProfile model created
✅ Authentication serializers implemented
✅ Login/Signup endpoints created
✅ User-specific image filtering implemented
✅ Permission checks added (users can only delete their own images)
✅ Database migrations applied
✅ CORS configured
✅ Django server running on port 8000

## How to Test

1. **Sign up** a new account at `/signup`
2. **Login** with your credentials at `/login`
3. **Upload images** - stored in your personal space
4. **View images** - only your images are visible
5. **Delete images** - can only delete your own images
6. **Logout** in the dashboard header

