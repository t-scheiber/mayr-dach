# Static demo on Coolify

The demo at https://mayr-dach.thomasscheiber.com is built from this repository using `Dockerfile.demo`. It serves prebuilt German and English pages with unprivileged nginx on port 8080. There is no database, Node.js process, SMTP configuration, persistent storage, or admin portal in the running container.

Projects and jobs come from `content/projects.json` and `content/jobs.json`. Edit these files and redeploy to update the demo. Images and videos remain in `public/`.

`bun install --frozen-lockfile`, `bunx prisma generate`, and `bun run build:demo` reproduce the static export in `.demo-out/`. Prisma generates types for the original app during the build only. It never connects to a database for the demo. The build uses a generated `.demo-build/` directory so the original admin and API source remain available for future full deployments.

The demo is labelled in both languages, sends no form submissions, and excludes admin/API routes. Search indexing is discouraged using robots.txt, page metadata, and the X-Robots-Tag header. The existing company website is linked from the demo notice.

Coolify configuration: Dockerfile build pack, `/Dockerfile.demo`, exposed port `8080`, domain `https://mayr-dach.thomasscheiber.com`, health check `/de/`, memory limit `128M`, and Coolify gzip compression disabled. nginx compresses text assets only. Compressing MP4 files in the proxy removes their content length and prevents Cloudflare from serving byte ranges. After changing this setting, purge the demo hostname's cached files in Cloudflare.

The root redirects to `/de/`. nginx uses relative redirects so neither the internal port nor HTTP leaks into public redirects. Both locale prefixes are explicit for static hosting. A proxied Cloudflare CNAME points to the Proxmox tunnel; its existing `*.thomasscheiber.com` route reaches the Coolify proxy at `https://192.168.1.200`. This route was verified against the public demo hostname, including pages, static assets, and video range responses.

The original VPS workflow is not used for this demo. Deployments use the dedicated `deploy/coolify-demo` branch in Coolify.
