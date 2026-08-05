# Blood Donation NGO Management Platform

A production-ready Blood Donation NGO Management Platform built with Next.js 16, TypeScript, Supabase, and Drizzle ORM. This platform provides a public website for blood availability and donor registration, alongside a comprehensive admin dashboard for managing donors, blood requests, content, and more.

## Features

### Public Website
- **Homepage** - Blood availability display (aggregated counts only), health content carousel, and CTAs
- **Donor Registration** - Multi-step form with validation and eligibility calculation
- **Blood Request** - Emergency blood request submission with reference number generation
- **Health Awareness** - Published healthcare content with category filtering
- **About Us** - NGO information and mission
- **Contact** - Contact form and NGO details
- **Privacy Policy & Terms** - Legal pages

### Admin Dashboard
- **Dashboard** - Statistics, charts, and key metrics
- **Donor Management** - Search, filter, verify, and manage donors
- **Request Management** - Track blood requests with status management and internal notes
- **Content CMS** - Create and manage health awareness content
- **Notifications** - System notifications for important events
- **Admin Users** - Super Admin can manage other admin accounts
- **Audit Logs** - Complete audit trail of all admin actions
- **Settings** - Application configuration management

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui with Base UI
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
blood-donation-ngo/
├── src/
│   ├── app/
│   │   ├── (public)/           # Public website routes
│   │   ├── admin/              # Admin dashboard routes
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── public/             # Public website components
│   │   ├── admin/              # Admin dashboard components
│   │   └── forms/              # Form components
│   ├── actions/                # Server actions
│   ├── services/               # Business logic services
│   ├── db/
│   │   ├── schema/             # Drizzle schema files
│   │   ├── migrations/         # SQL migrations
│   │   ├── seed.ts             # Development seed data
│   │   └── index.ts            # Database client
│   ├── lib/
│   │   ├── auth/               # Auth utilities
│   │   ├── validations/        # Zod schemas
│   │   ├── security/           # Rate limiting
│   │   └── supabase/           # Supabase clients
│   ├── hooks/                  # React hooks
│   ├── types/                  # TypeScript types
│   └── config/                 # App configuration
├── public/                     # Static assets
├── drizzle.config.ts           # Drizzle configuration
├── .env.example                # Environment variables template
└── package.json
```

## Prerequisites

- Node.js 18.17 or later
- npm or pnpm
- A Supabase project (free tier works)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blood-donation-ngo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy:
   - Project URL
   - Anon (public) key
   - Service Role key (keep this secret!)
3. Go to **Settings > Database** and copy the connection string

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```bash
# Supabase (Public - safe for client)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Server-only - NEVER expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Optional: Rate limiting (Upstash Redis)
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
```

### 5. Set Up the Database

Generate and run migrations:

```bash
npm run db:push
```

Seed initial data (blood groups, sample content, etc.):

```bash
npm run db:seed
```

### 6. Create Your First Admin User

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **Add user** and create a user with email and password
4. Copy the user's UUID from the user list
5. Go to **Table Editor > admin_users**
6. Insert a new row:
   - `auth_user_id`: The UUID from step 4
   - `email`: The same email used in step 3
   - `full_name`: Your name
   - `role`: `SUPER_ADMIN`
   - `is_active`: `true`

### 7. Start Development Server

```bash
npm run dev
```

Visit:
- Public website: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema directly to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with initial data |

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `blood_groups` | Blood types (A+, A-, B+, etc.) |
| `donors` | Registered blood donors |
| `blood_requests` | Blood request submissions |
| `content` | Health awareness content items |
| `admin_users` | Admin dashboard users |
| `notifications` | System notifications |
| `settings` | Application configuration |
| `audit_logs` | Action audit trail |

### Key Enums

- **donor_status**: PENDING, ACTIVE, INACTIVE, DEACTIVATED
- **verification_status**: UNVERIFIED, VERIFIED
- **request_status**: PENDING, CONTACTED, IN_PROGRESS, FULFILLED, CANCELLED
- **urgency**: NORMAL, URGENT, EMERGENCY
- **admin_role**: ADMIN, SUPER_ADMIN
- **content_status**: DRAFT, PUBLISHED, ARCHIVED

## Security Features

### Privacy Protection
- Public endpoints only return aggregated data (counts by blood group)
- No donor PII is exposed on the public website
- Donor details are only accessible to authenticated admins

### Authentication & Authorization
- Supabase Auth for secure authentication
- Role-based access control (ADMIN, SUPER_ADMIN)
- Server-side session validation on all admin routes
- Middleware protection for admin routes

### Data Validation
- Zod schemas for all form inputs
- Server-side validation in all server actions
- Parameterized queries via Drizzle ORM (SQL injection prevention)

### Audit Trail
- All admin actions are logged
- Audit logs include: action, entity, admin, timestamp, metadata

### Rate Limiting
- In-memory rate limiting for public form submissions
- Configurable via Upstash Redis for production

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
4. Deploy!

### Production Checklist

- [ ] All environment variables are set
- [ ] Database migrations are applied
- [ ] At least one SUPER_ADMIN user exists
- [ ] Blood groups are seeded
- [ ] Default settings are configured
- [ ] Custom domain is configured (optional)
- [ ] Enable Supabase RLS policies (see below)

### Supabase Row Level Security (RLS)

For production, enable RLS policies in Supabase:

```sql
-- Enable RLS on all tables
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of published content
CREATE POLICY "Public can read published content"
ON content FOR SELECT
USING (status = 'PUBLISHED');

-- Allow public read of blood groups
CREATE POLICY "Public can read blood groups"
ON blood_groups FOR SELECT
USING (true);

-- Service role has full access (for server-side operations)
-- Note: These use the service role key which bypasses RLS
```

## Configuration

### Application Settings

Settings are stored in the `settings` table and can be managed via the admin dashboard:

| Key | Description | Default |
|-----|-------------|---------|
| `NGO_NAME` | Organization name | LifeBlood Foundation |
| `NGO_DESCRIPTION` | Organization description | - |
| `CONTACT_EMAIL` | Contact email address | - |
| `CONTACT_PHONE` | Contact phone number | - |
| `CONTACT_ADDRESS` | Physical address | - |
| `DONATION_ELIGIBILITY_INTERVAL_DAYS` | Days between donations | 90 |

### Design System

The platform uses a red/white healthcare theme:
- **Primary**: Red (`#DC2626` / Tailwind `red-600`)
- **Background**: White with subtle gray sections
- **Cards**: White with subtle shadows

## Medical Disclaimer

This platform is designed for administrative tracking and coordination of blood donation activities only. It does not provide medical advice, diagnosis, or treatment recommendations. All medical decisions should be made by qualified healthcare professionals.

## License

[MIT License](LICENSE)

## Support

For questions or support, please open an issue in the repository.
