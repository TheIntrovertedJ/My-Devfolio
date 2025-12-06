-- Devfolio Database Initial Schema
-- MongoDB Collections Definition

-- Projects Collection
-- Stores portfolio projects showcased on the site
db.createCollection("projects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        title: { bsonType: "string", description: "Project title" },
        description: { bsonType: "string", description: "Project description" },
        url: { bsonType: "string", description: "GitHub or live URL" },
        imageUrl: { bsonType: "string", description: "Project thumbnail image" },
        tags: { 
          bsonType: "array", 
          items: { bsonType: "string" },
          description: "Technology tags (e.g., React, TypeScript)"
        },
        featured: { bsonType: "bool", description: "Pin to homepage" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

-- Skills Collection
-- Stores developer skills and expertise
db.createCollection("skills", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category"],
      properties: {
        _id: { bsonType: "objectId" },
        name: { bsonType: "string", description: "Skill name (e.g., TypeScript)" },
        category: { 
          bsonType: "string", 
          enum: ["language", "framework", "tool", "database", "other"],
          description: "Skill category"
        },
        proficiency: { 
          bsonType: "int",
          minimum: 1,
          maximum: 5,
          description: "1-5 proficiency level"
        },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

-- Blog Posts Collection (optional)
-- Stores blog articles
db.createCollection("posts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "slug", "content", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        title: { bsonType: "string" },
        slug: { bsonType: "string", description: "URL-friendly title" },
        content: { bsonType: "string", description: "Markdown content" },
        excerpt: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        published: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

-- Create indexes for better query performance
db.projects.createIndex({ "featured": 1, "createdAt": -1 });
db.projects.createIndex({ "tags": 1 });
db.skills.createIndex({ "category": 1 });
db.posts.createIndex({ "slug": 1 });
db.posts.createIndex({ "published": 1, "createdAt": -1 });
