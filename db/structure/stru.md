db/
├── migrations/ # Database schema version changes
│ └── 001_initial_schema.sql
├── seeds/ # Initial data for development
│ ├── projects.json
│ ├── skills.json
│ └── seed.ts
├── models/ # Mongoose/TypeORM schemas (optional—can live in backend/models)
│ ├── Project.ts
│ ├── User.ts
│ └── index.ts
├── scripts/ # Database utilities
│ ├── init-db.ts
│ ├── reset-db.ts
│ └── backup.ts
└── README.md # DB documentation & connection guide

npm run db:init # Initialize and verify connection
npm run db:seed # Populate with sample data
npm run db:reset # ⚠️ Delete all data
npm run db:backup # Export collections to JSON
npm run db:restore # Restore from backup
