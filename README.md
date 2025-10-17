# Nested Commenting Platform - MERN Stack

A modern, full-featured nested commenting system with authentication, built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## 🎯 Features

### Core Features
- 🔐 **User Authentication**: Secure JWT-based login/register system
- 💬 **Nested Comments**: Unlimited depth comment threads with visual hierarchy
- ⬆️ **Upvoting System**: Vote on comments to promote quality content
- 🎨 **Modern UI**: Beautiful dark theme with purple gradients using Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on all device sizes

### Bonus Features (All Implemented!)
- 🔄 **Comment Sorting**: Sort by newest, oldest, most upvotes, or most replies
- 👑 **Admin Privileges**: Admin users can delete any comment
- ✏️ **Edit Comments**: Users can edit their own comments
- 🎯 **User Badges**: Visual badges for comment authors and admins
- 📊 **Comment Counter**: See total comment count at a glance
- 🗂️ **Collapse/Expand**: Minimize comment threads for better navigation
- 🎭 **User Avatars**: Auto-generated unique avatars for each user
- ⏱️ **Timestamps**: Smart relative timestamps (e.g., "5 min ago")
- 🔢 **Reply Counter**: See how many replies each comment has
- 💫 **Smooth Animations**: Loading spinners and transitions
- ⚠️ **Delete Confirmation**: Prevent accidental comment deletion

## 🏗️ Architecture

This project follows **MVC (Model-View-Controller)** architecture:

### Backend (`server/`)
- **Models** (`src/models/`): MongoDB schemas
  - `User.js` - User authentication and profile
  - `Post.js` - Blog post/article
  - `Comment.js` - Nested comments with edit tracking
- **Controllers** (`src/controllers/`): Business logic
  - `auth.controller.js` - Registration, login, JWT
  - `post.controller.js` - Fetch post data
  - `comment.controller.js` - CRUD operations, upvoting, nested structure
- **Routes** (`src/routes/`): API endpoints
- **Middleware** (`src/middleware/`): JWT authentication
- **Express server** with Mongoose ODM

### Frontend (`client/`)
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern utility-first styling
- **Components**:
  - `LoginPage.jsx` - Authentication UI
  - `PostPage.jsx` - Main post display with header
  - `Comments.jsx` - Nested comment system with all features

## 🐳 Docker & Deployment

This project is fully containerized with Docker and ready for deployment to multiple cloud platforms.

### Quick Start with Docker

**Development (with hot reload):**
```bash
# Start all services
docker-compose up

# Rebuild after changes
docker-compose up --build

# Stop all services
docker-compose down
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📦 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS 3
- **Backend**: Node.js, Express 4
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (production)
- **Dev Tools**: Nodemon, Concurrently, PostCSS

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v20 or higher) OR Docker
- npm or yarn (if not using Docker)
- MongoDB Atlas account (or local MongoDB)

### Option 1: Docker Setup (Recommended)

**Development:**
```bash
# 1. Create environment file
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and secrets

# 2. Start with Docker Compose
docker-compose up

# Access the app at http://localhost:5173
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Traditional Setup

1. **Clone and navigate to the project**
   ```bash
   cd InterIIT
   ```

2. **Install all dependencies**
   ```bash
   npm install
   npm run install:server
   npm run install:client
   ```

3. **Configure Environment Variables**
   
   Create `server/.env` file:
   ```env
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_super_secret_jwt_key
   PORT=4000
   ```

   Create `client/.env` file (optional):
   ```env
   VITE_API_BASE=http://localhost:4000/api
   ```

### Running the Application

**Start both servers concurrently:**
```bash
npm run dev
```

This will start:
- **Backend API**: http://localhost:4000
- **Frontend**: http://localhost:5173

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ name, email, password }`
  - Returns: `{ token, user }`
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`
- `GET /api/auth/me` - Get current user (requires auth)

### Posts
- `GET /api/post` - Get the main post

### Comments (requires authentication for write operations)
- `GET /api/comments/:postId` - Get all comments for a post (nested structure)
- `POST /api/comments/:postId` - Add new comment
  - Body: `{ text, parent }` (parent is optional for replies)
- `PUT /api/comments/:id` - Edit comment (own comments only)
  - Body: `{ text }`
- `POST /api/comments/upvote/:id` - Upvote a comment
- `DELETE /api/comments/:id` - Delete comment (own or admin)

## 📝 Usage

1. Open http://localhost:5173 in your browser
2. **Register** a new account or **Login**
3. View the post and existing comments
4. **Add comments** using the input field
5. **Reply** to comments to create nested threads
6. **Upvote** comments you like
7. **Edit** your own comments (✏️ button)
8. **Delete** your comments or any comment as admin (🗑️ button)
9. **Sort comments** by newest, oldest, most upvotes, or most replies
10. **Collapse/Expand** comment threads for better navigation

## 👑 Admin User

To create an admin user, manually update the `isAdmin` field in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

Admin users can:
- Delete any comment (not just their own)
- See "Admin" badge on their profile
- See admin badges on other admin comments

## 🎨 UI Features

- **Dark Theme**: Modern dark UI with purple/indigo gradients
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Smooth Animations**: Loading states, hover effects, transitions
- **Nested Visual Hierarchy**: Clear left borders and indentation
- **User Badges**: "You" and "Admin" badges for identification
- **Smart Timestamps**: Relative time display (e.g., "5 min ago")
- **Reply Counter**: Shows number of replies per comment
- **Edit Indicator**: Shows "(edited)" for modified comments
- **Empty States**: Beautiful placeholder for no comments
- **Responsive Design**: Mobile-friendly layout
- **Loading Spinners**: Animated loading indicators
- **Confirmation Dialogs**: Prevent accidental deletions

## 📂 Project Structure

```
InterIIT/
├── client/                      # React frontend
│   ├── src/
│   │   ├── App.jsx             # Main app component & routing
│   │   ├── LoginPage.jsx       # Authentication page
│   │   ├── PostPage.jsx        # Post display with header
│   │   ├── Comments.jsx        # Nested comments system
│   │   ├── index.css           # Tailwind imports
│   │   └── main.jsx            # Entry point
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── package.json
├── server/                      # Express backend
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js         # User schema with admin field
│   │   │   ├── Post.js         # Post schema
│   │   │   └── Comment.js      # Comment schema (nested)
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── post.controller.js
│   │   │   └── comment.controller.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── post.routes.js
│   │   │   └── comment.routes.js
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT middleware
│   │   └── index.js            # Server entry
│   ├── .env                     # Environment variables
│   └── package.json
├── package.json                 # Root scripts
└── README.md
```

## 🧪 Testing

**Test Authentication:**
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Test Comments:**
```bash
# Get comments
curl http://localhost:4000/api/comments/POST_ID

# Add comment (requires token)
curl -X POST http://localhost:4000/api/comments/POST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text":"Great post!"}'
```


