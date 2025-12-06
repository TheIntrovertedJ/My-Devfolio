# Database Setup & Documentation

This folder contains database schemas, migrations, seed data, and utility scripts for the Devfolio portfolio.

## Structure

```
db/
├── migrations/       # Schema versions and structure
├── seeds/           # Initial data for development
├── scripts/         # Database utility scripts
└── structure/       # Database design documentation
```

## Environment Setup

Before running any database commands, ensure you have a MongoDB instance running and configure the connection string:

### 1. Install MongoDB

**Local Installation:**

```bash
# macOS
brew install mongodb-community

# Windows: Download from https://www.mongodb.com/try/download/community

# Linux
sudo apt-get install mongodb
```

**Or use MongoDB Atlas (Cloud):**

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/devfolio
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devfolio
```

### 3. Install Dependencies

The backend already includes MongoDB dependencies. If needed, add to `backend/`:

```bash
cd backend
npm install mongoose dotenv
```

## Database Scripts

Add these scripts to `backend/package.json`:

```json
"scripts": {
  "db:init": "ts-node ../db/scripts/init-db.ts",
  "db:seed": "ts-node ../db/seeds/seed.ts",
  "db:reset": "ts-node ../db/scripts/reset-db.ts",
  "db:backup": "ts-node ../db/scripts/backup.ts backup",
  "db:restore": "ts-node ../db/scripts/backup.ts restore"
}
```

## Usage

### Initialize Database

Creates collections if they don't exist and verifies connection:

```bash
npm run db:init
```

### Seed Database

Populates the database with sample projects and skills:

```bash
npm run db:seed
```

### Reset Database

⚠️ **WARNING: Deletes all data** in the database:

```bash
npm run db:reset
```

### Backup Database

Exports all collections to JSON files:

```bash
npm run db:backup
# Creates: db/backups/backup-TIMESTAMP/
```

### Restore Database

Restores data from a backup directory:

```bash
npm run db:restore db/backups/backup-2025-12-06T10-30-45-000Z
```

## Collections Schema

### Projects

Portfolio projects displayed on the site.

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  tags: string[],           // e.g., ["React", "TypeScript"]
  featured: boolean,        // Show on homepage
  createdAt: Date,
  updatedAt: Date
}
```

### Skills

Developer skills and expertise.

```typescript
{
  _id: ObjectId,
  name: string,             // e.g., "TypeScript"
  category: string,         // "language" | "framework" | "tool" | "database"
  proficiency: number,      // 1-5 level
  createdAt: Date
}
```

### Posts (Optional)

Blog articles.

```typescript
{
  _id: ObjectId,
  title: string,
  slug: string,             // URL-friendly: "my-first-post"
  content: string,          // Markdown content
  excerpt: string,
  tags: string[],
  published: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes

Indexes are created automatically for better query performance:

- `projects`: `featured`, `createdAt`, `tags`
- `skills`: `category`
- `posts`: `slug`, `published`, `createdAt`

## API Integration

In `backend/src/server.ts`, connect to the database:

```typescript
import { initializeDatabase } from '../db/scripts/init-db';

const app = express();

// Initialize database on startup
initializeDatabase().catch((err) => {
	console.error('Failed to connect to database:', err);
	process.exit(1);
});

app.listen(4000, () => console.log('Server running on :4000'));
```

## Troubleshooting

**"Cannot find module 'mongoose'"**

```bash
cd backend
npm install mongoose
```

**"Connection refused"**

- Check MongoDB is running: `sudo systemctl status mongodb`
- Verify `MONGODB_URI` in `.env`

**"Authentication failed"**

- For MongoDB Atlas, ensure IP whitelist includes your machine
- Use correct username/password in connection string

## References

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [MongoDB Schema Validation](https://docs.mongodb.com/manual/core/schema-validation/)
