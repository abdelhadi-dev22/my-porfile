# Portfolio Deployment to Vercel (with MySQL)

This guide helps you deploy your Next.js portfolio to Vercel using an external MySQL database (e.g., Aiven, TiDB, PlanetScale, or any hosted MySQL).

## 1. Database Setup
1. Create a MySQL/MariaDB database on your provider.
2. Get the connection string (e.g., `mysql://user:password@host:port/dbname`).
3. If your provider requires SSL, ensure the connection string includes `?ssl={"rejectUnauthorized":true}` or similar, or configure it in `src/lib/prisma.js`.

## 2. Vercel Configuration
Add the following **Environment Variables** in the Vercel Dashboard:

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Your external MySQL connection string. |
| `JWT_SECRET` | A long, random string for admin authentication. |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., `https://your-portfolio.vercel.app`). |

## 3. Deployment Steps
1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Vercel will automatically run `npm run build`.
4. After the first deployment, run the following command locally (with the production `DATABASE_URL`) to sync your database schema:
   ```bash
   npx prisma db push
   ```

## 4. Production Tips
- **Prisma Client**: The project is configured to use a singleton pattern for Prisma to avoid "too many connections" errors in serverless environments.
- **Dynamic Pages**: Critical pages are forced to `dynamic` rendering to ensure they always show the latest data from the database.
- **Images**: If you upload images in the admin panel, they are currently stored locally. For production, consider using a service like **Cloudinary** or **Vercel Blob** for persistent storage.
