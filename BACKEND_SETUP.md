# Backend Setup & Testing Guide

## Prerequisites

- MongoDB running locally or MongoDB Atlas connection string in `.env`
- Node.js v16+ installed

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `.env` in project root (or update existing):

```env
MONGODB_URI=mongodb://localhost:27017/devfolio
PORT=4000
NODE_ENV=development
```

For MongoDB Atlas (cloud):

```env
# Use a placeholder and store real credentials in your local `.env` (DO NOT commit):
MONGODB_URI="mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.example.mongodb.net/devfolio?retryWrites=true&w=majority"
```

Warning: never paste your real username/password into files tracked by git. Always keep secrets in a local `.env` (already included in `.gitignore`).

### 3. Seed Database (Optional)

Populate with sample projects and skills:

```bash
npm run db:seed
```

Output should show:

```
Connected to MongoDB
✓ Seeded 3 projects
✓ Seeded 12 skills
Database seeded successfully!
```

### 4. Start Backend Server

```bash
npm run dev
```

You should see:

```
✓ Connected to MongoDB
✓ Server running on http://localhost:4000
✓ API endpoints available at http://localhost:4000/api
```

### 5. Test API Endpoints

**Option A: Using the test script**

```bash
node test-backend.js
```

**Option B: Using curl**

Get all projects:

```bash
curl http://localhost:4000/api/projects
```

Get all skills:

```bash
curl http://localhost:4000/api/skills
```

Get health status:

```bash
curl http://localhost:4000/api/health
```

**Option C: Using Postman**

1. Open Postman
2. Create requests for each endpoint
3. Test CRUD operations

## API Endpoints

### Projects

| Method | Endpoint                      | Description            |
| ------ | ----------------------------- | ---------------------- |
| GET    | `/api/projects`               | List all projects      |
| GET    | `/api/projects?featured=true` | List featured projects |
| GET    | `/api/projects/:id`           | Get single project     |
| POST   | `/api/projects`               | Create project         |
| PUT    | `/api/projects/:id`           | Update project         |
| DELETE | `/api/projects/:id`           | Delete project         |

### Skills

| Method | Endpoint                        | Description        |
| ------ | ------------------------------- | ------------------ |
| GET    | `/api/skills`                   | List all skills    |
| GET    | `/api/skills?category=language` | Filter by category |
| GET    | `/api/skills/:id`               | Get single skill   |
| POST   | `/api/skills`                   | Create skill       |
| PUT    | `/api/skills/:id`               | Update skill       |
| DELETE | `/api/skills/:id`               | Delete skill       |

### Health

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/api/health` | Check server status |

## Example Requests

### Create a Project

```bash
curl -X POST http://localhost:4000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "A cool portfolio project",
    "url": "https://github.com/user/project",
    "tags": ["React", "TypeScript"],
    "featured": true
  }'
```

### Create a Skill

```bash
curl -X POST http://localhost:4000/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python",
    "category": "language",
    "proficiency": 4
  }'
```

### Update a Project

```bash
curl -X PUT http://localhost:4000/api/projects/:id \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "featured": false
  }'
```

## Troubleshooting

**Error: Cannot find module 'mongoose'**

```bash
npm install mongoose dotenv
```

**Error: Connection refused (MongoDB)**

- Ensure MongoDB is running locally: `sudo systemctl start mongodb`
- Or update `MONGODB_URI` to use MongoDB Atlas

**Error: Port 4000 already in use**

- Change port in `.env`: `PORT=5000`
- Or kill existing process: `lsof -ti:4000 | xargs kill -9`

**Database scripts not working**

```bash
npm install --save-dev @types/node typescript ts-node
npm run db:init
```

## Database Management

### Initialize Database

```bash
npm run db:init
```

### Reset Database (WARNING: Deletes all data)

```bash
npm run db:reset
```

### Backup Database

```bash
npm run db:backup
# Creates: db/backups/backup-TIMESTAMP/
```

### Restore from Backup

```bash
npm run db:restore db/backups/backup-TIMESTAMP
```

## Development Commands

```bash
npm run build      # Compile TypeScript
npm run dev        # Start with auto-reload
npm run start      # Run compiled version
npm run db:seed    # Seed database
npm run db:init    # Initialize database
npm run db:reset   # Clear all data
```

## Next Steps

1. ✅ Backend setup complete
2. Integrate with frontend (consume API endpoints)
3. Add authentication (JWT)
4. Deploy to production (Vercel, Render, Railway)

## Support

Check logs in `backend/dist/` for compiled files
Debug MongoDB connections in `.env` configuration
