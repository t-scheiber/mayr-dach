# mayr-dach

A demo website for Karl Mayr GmbH & Co. KG, a roofing and facade company in Saalfelden, Austria. I built it as a freelance project. It is not the company's live site: the company's own domain stays with an existing contract at another provider. The demo runs at https://mayr-dach.thomasscheiber.com and its pages are marked as a demo.

The site is bilingual (German and English). It lists the company's services, reference projects, team and partners, and has a job board with an online application form and an admin dashboard.

## Two ways to run it

The same code runs in two modes.

| | Full app | Static demo |
| --- | --- | --- |
| Needs | Node.js, PostgreSQL, SMTP server | Node.js to build, any static file server to serve |
| Build | `bun run build` | `bun run build:demo` |
| Output | Next.js server | Static files in `.demo-out/` |
| Projects and jobs | Read from PostgreSQL | Read from `content/projects.json` and `content/jobs.json` |
| Contact and application forms | Send mail, store applications and CV uploads | Shown but disabled, nothing is sent |
| Admin dashboard and sign-in | Works | Not built, the login link is hidden |
| API routes | Work | Not built |
| Search indexing | Allowed | Blocked with `robots.txt` and page metadata |

`NEXT_PUBLIC_DEMO_MODE=true` switches the code paths. `scripts/build-demo.mjs` sets it, copies the project into `.demo-build/`, removes `app/api` and the admin pages, and runs `next build` with static export. `Dockerfile.demo` serves that output with nginx on port 8080. `deploy/README.md` describes the hosting setup.

## Features

- German and English pages with next-intl. The locale comes from the URL, with `de` as the default.
- Six service pages: roofing, metalwork, glazing, facades, sealing and green roofs.
- Project gallery with image carousel, filled from the database (full app) or `content/projects.json` (demo, 35 projects).
- Job board with an application form. Candidates upload a CV (PDF or Word) and an optional cover letter. The server saves the files under `uploads/`, stores a record in PostgreSQL and emails the office.
- Admin dashboard to manage jobs, projects and applications, including application status (new, reviewing, accepted, rejected).
- Passwordless admin sign-in with a six-digit email code (Better Auth email OTP, valid for 5 minutes). Sign-up is disabled, so the admin's email must already exist in the `User` table. The seed script creates jobs only, not users.
- Contact form validated with zod, sent by email through Nodemailer.
- JSON-LD data, sitemap, `robots.txt`, hreflang tags, and `llms.txt` files in `public/`.
- Hero videos and scroll, page-transition and loading animations with Framer Motion.

## Stack

Versions come from `package.json`.

| Part | Technology |
| --- | --- |
| Framework | Next.js 16.4 (App Router), React 19.3 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL through Prisma 7 with the `pg` adapter |
| Auth | Better Auth 1.7 |
| i18n | next-intl 4 |
| Email | Nodemailer 10 |
| Package manager | Bun |

## Run the full app

You need Node.js 24.20 or newer, Bun and a PostgreSQL database.

```bash
bun install
```

Create a `.env` file with the variables below, then create the tables and seed the jobs. The repository has no `prisma/migrations` folder, so `db push` applies `prisma/schema.prisma` directly.

```bash
bunx prisma db push
bun run db:seed
bun run dev
```

The dev server listens on http://localhost:3000. The home page needs the database, because it reads projects from it.

## Run the static demo

```bash
bun install
bunx prisma generate
bun run build:demo
```

Serve `.demo-out/` with any static file server. The pages are at `/de/` and `/en/`. No database or environment variables are needed.

## Environment variables

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Signs sessions and the magic links in notification emails |
| `BETTER_AUTH_URL` | Base URL for auth callbacks and magic links |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Base URL for the browser auth client, optional |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Outgoing mail server. The port defaults to 587 |
| `NOTIFICATION_EMAIL` | Recipient of application and contact notifications |
| `NEXT_PUBLIC_SITE_URL` | Base URL for canonical links and the sitemap |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` to build the static demo. `build:demo` sets it |
| `DEPLOY_SECRET` | Bearer token for `/api/deploy-webhook`, which runs a deploy script on the original VPS |

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Start the development server |
| `bun run build` | Generate the Prisma client and build the full app |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run build:demo` | Build the static demo into `.demo-out/` |
| `bun run db:migrate` | Run `prisma migrate dev` |
| `bun run db:seed` | Seed the job postings |
| `bun run lh` | Run Lighthouse with `scripts/lighthouse.mjs` |

There is no test suite. `bun run build` succeeds without a database, but requesting pages that read from it fails until `DATABASE_URL` points to a running PostgreSQL.

## Layout

```text
app/[locale]/   pages for both languages, including admin/ and jobs/
app/api/        routes for applications, auth, contact, jobs, projects, deploy webhook
components/     React components and animations
content/        JSON data for the demo, team, partners and company
i18n/           next-intl routing and the German and English messages
lib/            auth, database, email, validation, demo/database content switch
prisma/         schema and seed script
scripts/        demo build, Lighthouse, image download and VPS setup scripts
deploy/         nginx config and notes for the static demo
```

`.github/workflows/deploy.yml` builds the full app on every push to `main`. Unless the repository variable `DEPLOY_ENABLED` is `false`, it then calls the deploy webhook of the original VPS setup.
