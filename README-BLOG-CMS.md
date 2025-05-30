# Bajramedia Blog CMS

This is the blog CMS system for Bajramedia, built with Next.js, Prisma, and MySQL/SQLite.

## Setup Instructions

Follow these steps to set up the blog CMS:

### 1. Configure the Database

You can use either SQLite (for development) or MySQL (for production).

#### For Development (SQLite)

The project is configured to use SQLite by default for development. The database file will be created in the prisma directory.

```env
DATABASE_URL="file:./dev.db"
```

#### For Production (MySQL)

For production, you should use a MySQL database. Update the `.env` file with your database connection details:

```env
DATABASE_URL="mysql://username:password@localhost:3306/bajramedia_blog"
```

Replace `username`, `password`, and optionally the host and database name as needed.

If switching between database providers, make sure to update the provider in `schema.prisma` file:
- For SQLite: `provider = "sqlite"`
- For MySQL: `provider = "mysql"`

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Migrations and Seed the Database

```bash
# Create the database tables
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3003 (or another port if 3000-3002 are in use)

## CMS Admin Interface

The admin interface is accessible at http://localhost:3003/admin after you start the server.

### Admin Features

- Dashboard with statistics and quick actions
- Blog post management (create, edit, delete, publish/unpublish)
- Author management
- Category management
- Tag management
- Image upload functionality
- Simple authentication system

### Authentication

The admin interface is protected by a simple authentication system. Default login credentials are:

- Username: `admin`
- Password: `admin`

This is a basic implementation for demonstration purposes. In a production environment, you should implement a more secure authentication system using:

- Database-backed user credentials
- Proper password hashing
- JWT or session-based authentication
- Role-based access control

### Image Uploads

The CMS includes an image upload system for blog post featured images. Images are stored in the `public/uploads/blog` directory. The upload system:

- Supports JPEG, PNG, GIF, and WEBP formats
- Limits file size to 5MB
- Generates unique filenames to prevent collisions
- Provides a user-friendly drag-and-drop interface

## Database Schema

The CMS uses the following database structure:

- **Posts**: Blog articles with content, metadata, and relationships
- **Authors**: Content creators with profiles
- **Categories**: Primary classification for posts
- **Tags**: Additional labels for more specific categorization

## API Endpoints

### Public API

- `GET /api/posts`: List all published blog posts
- `GET /api/posts/featured`: Get featured blog posts
- `GET /api/posts/[slug]`: Get a single blog post by slug
- `GET /api/posts/category/[category]`: Get posts by category
- `GET /api/posts/search`: Search posts by keyword

### Admin API

- `GET /api/admin/posts`: List all blog posts (including drafts)
- `GET /api/admin/posts/[id]`: Get a single blog post by ID
- `GET /api/admin/authors`: List all authors
- `GET /api/admin/authors/[id]`: Get a single author
- `GET /api/admin/categories`: List all categories
- `GET /api/admin/tags`: List all tags
- `GET /api/admin/stats`: Get dashboard statistics

## Additional Tools

You can use Prisma Studio to directly manage your database:

```bash
npm run db:studio
```

This will open an interface at http://localhost:5555 that allows you to browse and edit your database records.

## Blog Integration

The blog is seamlessly integrated with the main website. The blog posts are displayed on:

- The homepage blog section (`/`)
- The blog listing page (`/blog`)
- Individual blog post pages (`/blog/[slug]`)

## Frontend Components

The blog includes the following components:

- Blog post cards with featured images
- Blog post grid layout
- Blog post detail view with author information
- Related posts
- Search functionality
