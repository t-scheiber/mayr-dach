# mayr-dach.com

Corporate website for **Karl Mayr GmbH & Co. KG** — a roofing and facade company based in Saalfelden, Austria.

Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.

## Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Framework  | Next.js 16 (App Router)                 |
| UI         | React 19, Tailwind CSS 4, Framer Motion |
| Language   | TypeScript                              |
| Database   | PostgreSQL via Prisma 7                 |
| Auth       | Better Auth (passwordless email OTP)    |
| i18n       | next-intl (DE + EN)                     |
| Email      | Nodemailer                              |
| Deployment | GitHub Actions, Caddy, VPS              |

## Features

- **Bilingual** — full German and English content with cookie-based language preference
- **Admin Dashboard** — manage job postings, projects, and applications
- **Online Applications** — candidates upload CV with magic-link status tracking
- **Project Portfolio** — dynamic gallery with lightbox, pulled from database
- **SEO & AI Optimized** — JSON-LD schemas, llms.txt, sitemap, hreflang tags
- **Hero Videos** — per-service background videos with optimized loading
- **Animations** — page transitions, scroll reveals, service-specific loading screens

## Getting Started

### Prerequisites

- Node.js >= 22
- PostgreSQL database
- Bun (for seeding)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL, SMTP credentials, and auth secret

# Run database migrations
npx prisma migrate dev

# Seed initial data
bun prisma/seed.ts

# Start dev server
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm run dev`        | Start development server       |
| `npm run build`      | Generate Prisma client & build |
| `npm run start`      | Start production server        |
| `npm run lint`       | Run ESLint                     |
| `npm run db:migrate` | Run Prisma migrations          |
| `npm run db:seed`    | Seed the database              |

## Project Structure

```text
app/
  [locale]/          # i18n routes (de/en)
    admin/           # Admin dashboard
    jobs/            # Job listings & application form
    kontakt/         # Contact page
    leistungen/      # Services
    ueber-uns/       # About page
  api/               # API routes
components/          # Shared React components
content/             # Static JSON data (team, partners, company info)
i18n/                # Internationalization config
lib/                 # Utilities (auth, email, db, validation schemas)
prisma/              # Database schema, migrations, seed
public/              # Static assets (videos, images)
```

## Environment Variables

| Variable             | Description                              |
| -------------------- | ---------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string             |
| `BETTER_AUTH_SECRET` | Auth session secret                      |
| `BETTER_AUTH_URL`    | Base URL for auth callbacks              |
| `SMTP_HOST`          | Mail server host                         |
| `SMTP_PORT`          | Mail server port                         |
| `SMTP_USER`          | Mail server username                     |
| `SMTP_PASS`          | Mail server password                     |
| `NOTIFICATION_EMAIL` | Recipient for application notifications  |

## License

Private — all rights reserved.
