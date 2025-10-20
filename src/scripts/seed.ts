import { config } from "dotenv";
import { db } from "../server/db";
import { posts, categories, postsToCategories } from "../server/db/schema";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function seed() {
  console.log("🌱 Seeding database...");

  // Create categories
  const [techCategory, lifestyleCategory, tutorialCategory] = await db
    .insert(categories)
    .values([
      {
        name: "Technology",
        description: "Posts about technology, programming, and software development",
        slug: "technology",
      },
      {
        name: "Lifestyle",
        description: "Personal stories and lifestyle content",
        slug: "lifestyle",
      },
      {
        name: "Tutorials",
        description: "Step-by-step guides and how-to articles",
        slug: "tutorials",
      },
    ])
    .returning();

  console.log("✅ Created categories");

  // Create sample posts
  const [post1, post2, post3] = await db
    .insert(posts)
    .values([
      {
        title: "Getting Started with Next.js 15",
        content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements to the React framework. In this post, we'll explore the key changes and how to get started.

## What's New in Next.js 15

- **Improved Performance**: Better build times and runtime performance
- **Enhanced Developer Experience**: Better error messages and debugging tools
- **New App Router Features**: More flexible routing and layout options

## Getting Started

To create a new Next.js 15 project, run:

\`\`\`bash
npx create-next-app@latest my-app
\`\`\`

This will set up a new project with all the latest features and best practices.

## Conclusion

Next.js 15 continues to push the boundaries of what's possible with React, making it easier than ever to build modern web applications.`,
        slug: "getting-started-with-nextjs-15",
        published: true,
      },
      {
        title: "The Art of Minimalist Living",
        content: `# The Art of Minimalist Living

Minimalism isn't just about having fewer things—it's about making room for what truly matters in your life.

## What is Minimalism?

Minimalism is a lifestyle that focuses on living with intention. It's about:

- Removing distractions
- Focusing on what adds value
- Creating space for growth
- Living with purpose

## Benefits of Minimalist Living

1. **Reduced Stress**: Less clutter means less mental overhead
2. **More Time**: Fewer possessions to manage and maintain
3. **Better Focus**: Clear spaces lead to clear minds
4. **Financial Freedom**: Spending less on unnecessary items

## Getting Started

Start small by decluttering one area of your home. Ask yourself:
- Does this item add value to my life?
- When did I last use this?
- Would I buy this again today?

Remember, minimalism looks different for everyone. Find what works for you.`,
        slug: "art-of-minimalist-living",
        published: true,
      },
      {
        title: "Building a RESTful API with Node.js",
        content: `# Building a RESTful API with Node.js

In this tutorial, we'll build a complete RESTful API using Node.js, Express, and PostgreSQL.

## Prerequisites

- Node.js installed
- PostgreSQL database
- Basic knowledge of JavaScript

## Project Setup

First, let's initialize our project:

\`\`\`bash
mkdir my-api
cd my-api
npm init -y
npm install express pg
\`\`\`

## Creating the Server

Create a \`server.js\` file:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Database Connection

Set up your database connection:

\`\`\`javascript
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});
\`\`\`

## API Endpoints

Now let's create our CRUD endpoints:

\`\`\`javascript
// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
\`\`\`

## Conclusion

You now have a basic RESTful API! This is just the beginning—you can add authentication, validation, and more advanced features as needed.`,
        slug: "building-restful-api-nodejs",
        published: false, // This is a draft
      },
    ])
    .returning();

  console.log("✅ Created sample posts");

  // Link posts to categories
  await db.insert(postsToCategories).values([
    { postId: post1.id, categoryId: techCategory.id },
    { postId: post1.id, categoryId: tutorialCategory.id },
    { postId: post2.id, categoryId: lifestyleCategory.id },
    { postId: post3.id, categoryId: techCategory.id },
    { postId: post3.id, categoryId: tutorialCategory.id },
  ]);

  console.log("✅ Linked posts to categories");
  console.log("🎉 Database seeded successfully!");
}

seed().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});
