# Blog Platform

This is a full-stack blogging platform built as part of a technical assessment. It uses a modern tech stack including Next.js 15, tRPC, Drizzle ORM, and PostgreSQL to allow users to create, manage, and filter blog posts and categories.

## Live Demo

The project is deployed on Vercel and can be viewed here: [https://blog-platform-murex.vercel.app/](https://blog-platform-murex.vercel.app/)

## Features

### 🔴 Core Features (Priority 1)
- ✅ Blog post CRUD operations (create, read, update, delete)
- ✅ Category CRUD operations
- ✅ Assign one or more categories to posts
- ✅ Blog listing page showing all posts
- ✅ Individual post view page
- ✅ Category filtering on listing page
- ✅ Basic responsive navigation
- ✅ Clean, professional UI

### 🟡 Expected Features (Priority 2)
- ✅ Landing page with 3 sections (Header/Hero, Features, CTA)
- ✅ Dashboard page for managing posts
- ✅ Draft vs Published post status
- ✅ Loading and error states
- ✅ Mobile-responsive design
- ✅ Content editor (Markdown support)

### 🟢 Bonus Features (Priority 3)
- ✅ Full 5-section landing page
- ✅ Post statistics (word count, reading time)
- ✅ SEO meta tags
- ✅ Pagination

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query (via tRPC), Zustand
- **Content**: Markdown support with react-markdown
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/artorias-66/blog-platform
   cd blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your database connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_platform"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations (make sure your database is running)
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database named `blog_platform`
3. Update your `.env.local` with the connection string

### Option 2: Hosted Database (Recommended)
1. **Neon** (Free tier available): [neon.tech](https://neon.tech)
2. **Supabase** (Free tier available): [supabase.com](https://supabase.com)
3. **Railway** (Free tier available): [railway.app](https://railway.app)

## Project Structure

```
blog-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/trpc/         # tRPC API routes
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── posts/            # Blog post pages
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   ├── server/               # Backend code
│   │   ├── db/              # Database schema and connection
│   │   ├── routers/         # tRPC routers
│   │   └── utils/           # Server utilities
│   ├── trpc/                # tRPC client setup
│   └── scripts/             # Database seed script
├── drizzle/                  # Database migrations
└── public/                  # Static assets
```

## API Structure

The application uses tRPC for type-safe APIs with the following routers:

- **Posts Router** (`/api/trpc/posts`)
  - `list` - Get all posts with optional category filtering
  - `bySlug` - Get a single post by slug
  - `create` - Create a new post
  - `update` - Update an existing post
  - `delete` - Delete a post

- **Categories Router** (`/api/trpc/categories`)
  - `list` - Get all categories
  - `create` - Create a new category
  - `update` - Update an existing category
  - `delete` - Delete a category

## Database Schema

### Posts Table
- `id` - Primary key
- `title` - Post title
- `slug` - URL-friendly identifier
- `content` - Post content (Markdown)
- `published` - Publication status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Categories Table
- `id` - Primary key
- `name` - Category name
- `slug` - URL-friendly identifier
- `description` - Category description
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Posts to Categories (Many-to-Many)
- `postId` - Foreign key to posts
- `categoryId` - Foreign key to categories

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com/).

1.  **Create a new "Project"** on Vercel and connect your GitHub repository.

2.  **Configure the service:**
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`

3.  **Add Environment Variables:**
    *   `DATABASE_URL`: Your PostgreSQL connection string (you can create a free Postgres instance on Render).
    *   `NEXT_PUBLIC_SITE_URL`: Set this to the value of your Vercel deployment URL.

4.  **Deploy!** Vercel will automatically build and deploy your application.

5.  **Database Migrations:** After the first deployment, you may need to run migrations. You can do this by connecting to your Vercel deployment via the shell and running `npm run db:migrate`.

## Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate migration files
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

## Features Implemented

### ✅ Core Requirements
- [x] Blog post CRUD operations
- [x] Category CRUD operations
- [x] Post-category relationships
- [x] Blog listing with filtering
- [x] Individual post views
- [x] Responsive navigation
- [x] Professional UI design

### ✅ Expected Features
- [x] Landing page (Hero, Features, CTA sections)
- [x] Dashboard for content management
- [x] Draft/Published post status
- [x] Loading and error states
- [x] Mobile-responsive design
- [x] Markdown content editor

### ✅ Bonus Features
- [x] SEO-friendly URLs with slugs
- [x] Type-safe APIs with tRPC
- [x] Modern React patterns
- [x] Clean architecture
- [x] Comprehensive documentation

## Tech Choices & Rationale

During this project, I made a few key technical decisions:

-   **Content Editor**: I opted for a **Markdown editor** instead of a full rich-text editor. This saved significant development time while still providing a great writing experience.
-   **API Layer**: I chose **tRPC** because its end-to-end type safety with Next.js is a huge productivity booster and helps prevent bugs between the frontend and backend.
-   **ORM**: I went with **Drizzle ORM**. It's lightweight, offers great performance, and its SQL-like syntax feels very intuitive.
-   **Styling**: **Tailwind CSS** was a clear choice for quickly building a clean and responsive UI without writing a lot of custom CSS.

## Time Spent

I spent approximately **14 hours** on this project over the course of a week, from initial setup to final deployment and documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Issues

If you encounter any bugs or have suggestions, please open an issue on the GitHub repository.
