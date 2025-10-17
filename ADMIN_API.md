# 👑 Admin API Documentation

## Admin Endpoints

### 1. Make User Admin (Development Only)

**Endpoint:** `POST /api/admin/make-admin`

**Description:** Promotes a user to admin status. This endpoint is **disabled by default** and will only work if the server is started with `ADMIN_SECRET` configured in `server/.env`.

Add to `server/.env`:
```env
ADMIN_SECRET=make-me-admin-123
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "secret": "make-me-admin-123"
}
```

**Example using cURL:**
```bash
curl -X POST http://localhost:4000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","secret":"make-me-admin-123"}'
```

**Example using PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/admin/make-admin" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"user@example.com","secret":"make-me-admin-123"}'
```

**Example using JavaScript/Fetch:**
```javascript
fetch('http://localhost:4000/api/admin/make-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    secret: 'make-me-admin-123'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

**Success Response (200):**
```json
{
  "message": "User is now an admin!",
  "user": {
    "id": "68f0f333b76f07dcca39ceca",
    "name": "John Doe",
    "email": "user@example.com",
    "isAdmin": true
  }
}
```

**Error Responses:**

- **403 Forbidden** - Invalid secret key
```json
{
  "error": "Invalid secret"
}
```

- **404 Not Found** - User doesn't exist
```json
{
  "error": "User not found"
}
```

---

## Admin Privileges

Once a user is an admin, they gain the following privileges:

### 1. Delete Any Comment

**Endpoint:** `DELETE /api/comments/:id`

**Description:** Admins can delete ANY comment (not just their own)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**
```bash
curl -X DELETE http://localhost:4000/api/comments/COMMENT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Success Response (200):**
```json
{
  "success": true
}
```

---

## Step-by-Step Guide to Become Admin

### Method 1: Using the API Endpoint

1. **Register an account** at http://localhost:5173
   - Email: `admin@example.com`
   - Password: `password123`
   - Name: `Admin User`

2. **Open a new terminal** (PowerShell)

3. **Set `ADMIN_SECRET`** in `server/.env` and restart the server, then run this command (replace with your email):
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/admin/make-admin" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"admin@example.com","secret":"make-me-admin-123"}'
  ```

4. **Logout** from the application

5. **Login again** to get a new JWT token with admin privileges

6. **You're now an admin!** You'll see:
   - Red "Admin" badge on your profile
   - Ability to delete any comment
   - Admin badge on your comments

### Method 2: Using MongoDB Atlas

1. Go to https://cloud.mongodb.com/
2. Navigate to: **Clusters → Browse Collections**
3. Select your database → **users** collection
4. Find your user by email
5. Click **Edit** (pencil icon)
6. Add or modify the field: `"isAdmin": true`
7. Click **Update**
8. **Logout and login** again in the app

### Method 3: Using MongoDB Compass

1. Download MongoDB Compass from https://www.mongodb.com/try/download/compass
2. Connect using:
   ```
   mongodb+srv://prasadshinde10048_db_user:Epp7D5pe4PVSZFt6@cluster0.1a2zhxs.mongodb.net/
   ```
3. Navigate to your database → **users** collection
4. Find your user document
5. Edit and add: `"isAdmin": true`
6. Save the document
7. **Logout and login** again in the app

---

## Testing Admin Features

### 1. Test Admin Badge
- Login as admin
- You should see a red "Admin" badge next to your name in the header

### 2. Test Delete Other Users' Comments
- Login as a regular user
- Add a comment
- Logout and login as admin
- You should see a 🗑️ Delete button on ALL comments
- Click delete on any comment (even ones you didn't create)

### 3. Test Admin Comment Badge
- Login as admin
- Add a comment
- Other admin users will see a red "Admin" badge on your comment

---

## Security Notes

⚠️ **Important:**

1. **Remove the make-admin endpoint in production:**
   - Delete `server/src/routes/admin.routes.js`
   - Remove the import and route from `server/src/index.js`

2. **Change the secret key** if you keep it:
   - In `admin.routes.js`, change `'make-me-admin-123'` to something secure
   - Use environment variables: `process.env.ADMIN_SECRET`

3. **Use database access** for production admin management:
   - Manually set `isAdmin: true` in MongoDB
   - Don't expose admin promotion endpoints

4. **JWT Token includes admin status:**
   - When a user becomes admin, they must **logout and login again**
   - The new JWT token will include `isAdmin: true`
   - Old tokens won't have admin privileges

---

## Admin Features in the UI

### Visual Indicators:
- 🔴 Red "Admin" badge in header (next to username)
- 🔴 Red "Admin" badge on admin user comments (visible to other admins)
- 🗑️ Delete button visible on ALL comments (not just own)

### Admin Actions:
- ✅ Delete any comment
- ✅ See all other admin users
- ✅ Full comment moderation

### Non-Admin Users See:
- ✏️ Edit button only on their own comments
- 🗑️ Delete button only on their own comments
- No admin badges (except on admin comments if they're also admin)

---

## Example Workflow

```bash
# 1. Register a user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@test.com","password":"admin123"}'

# Response: { "token": "eyJhbGc...", "user": {...} }

# 2. Make them admin
curl -X POST http://localhost:4000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","secret":"make-me-admin-123"}'

# Response: { "message": "User is now an admin!", "user": {...} }

# 3. Login again to get new token with admin privileges
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'

# Response: { "token": "eyJhbGc..." } # New token with isAdmin: true

# 4. Use the new token to delete any comment
curl -X DELETE http://localhost:4000/api/comments/COMMENT_ID \
  -H "Authorization: Bearer NEW_TOKEN"
```

---

## Quick Reference

| Action | Endpoint | Method | Auth Required | Admin Only |
|--------|----------|--------|---------------|------------|
| Make Admin | `/api/admin/make-admin` | POST | No | No (uses secret) |
| Delete Any Comment | `/api/comments/:id` | DELETE | Yes | Yes |
| Register User | `/api/auth/register` | POST | No | No |
| Login User | `/api/auth/login` | POST | No | No |
| Get Comments | `/api/comments/:postId` | GET | No | No |
| Add Comment | `/api/comments/:postId` | POST | Yes | No |
| Edit Own Comment | `/api/comments/:id` | PUT | Yes | No |
| Delete Own Comment | `/api/comments/:id` | DELETE | Yes | No |
| Upvote Comment | `/api/comments/upvote/:id` | POST | Yes | No |

---

## Troubleshooting

**Q: I made myself admin but still don't see the badge**
- A: You need to **logout and login again** to get a new JWT token

**Q: I can't delete other users' comments**
- A: Make sure you logged out and back in after becoming admin

**Q: The make-admin endpoint returns 404**
- A: Check that the server restarted after adding the admin routes

**Q: How do I remove admin status?**
- A: Use MongoDB to set `isAdmin: false` on the user document

**Q: Can I have multiple admins?**
- A: Yes! Run the make-admin command for each user email

---

**Ready to become admin? Run this command with your email:**

```powershell
Invoke-RestMethod -Uri "http://localhost:4000/api/admin/make-admin" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"YOUR_EMAIL_HERE","secret":"make-me-admin-123"}'
```

Then **logout and login again!** 👑
