# Personal Portfolio Website — Full Stack

A responsive personal portfolio built with **HTML, CSS, JavaScript, Node.js, Express and MySQL**.

## Features

- Responsive landing page with About, Skills, Projects and Contact sections
- Projects are fetched from MySQL through an Express REST API
- Contact form validates and stores messages in MySQL
- Protected admin REST endpoints to create, update and delete projects
- Starter project records for Florist Application, Agima Gifts and IoT Rain Alert System

## 1. Requirements

Install:
- Node.js 18 or newer
- MySQL Server 8 (or compatible MySQL version)
- A code editor such as Visual Studio Code

Check installation:

```bash
node --version
npm --version
mysql --version
```

## 2. Set up the database

1. Start your MySQL server.
2. Open MySQL Workbench or a MySQL terminal.
3. Run the complete script in `database/portfolio.sql`.

The script creates `portfolio_db`, the `projects` and `contact_messages` tables, and three starter projects.

## 3. Configure the application

In the project root, create a file named `.env` by copying `.env.example`.

Update these values to match your local MySQL setup:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio_db
ADMIN_KEY=replace-with-a-long-random-secret
```

Do not upload `.env` to GitHub. It is excluded by `.gitignore`.

## 4. Install and run

Open a terminal in the project root:

```bash
npm install
npm start
```

Open this address in your browser:

```text
http://localhost:3000
```

For automatic restart while developing:

```bash
npm run dev
```

## 5. REST API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server status |
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Add a project (admin key required) |
| PUT | `/api/projects/:id` | Update a project (admin key required) |
| DELETE | `/api/projects/:id` | Delete a project (admin key required) |
| POST | `/api/contact` | Save a contact message |

### Add a project (admin)

Use Postman, Thunder Client or curl. Include the `X-Admin-Key` header with the same value as `ADMIN_KEY` in `.env`.

Example request:

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: YOUR_ADMIN_KEY" \
  -d "{\"title\":\"Weather Dashboard\",\"description\":\"A responsive weather dashboard project.\",\"technologies\":\"HTML, CSS, JavaScript\",\"github_url\":\"https://github.com/YOUR_USERNAME/YOUR_REPO\",\"featured\":true}"
```

Example update:

```bash
curl -X PUT http://localhost:3000/api/projects/1 \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: YOUR_ADMIN_KEY" \
  -d "{\"title\":\"Updated project title\",\"description\":\"Updated project description\",\"technologies\":\"HTML, CSS, JavaScript\",\"featured\":true}"
```

Example delete:

```bash
curl -X DELETE http://localhost:3000/api/projects/1 \
  -H "X-Admin-Key: YOUR_ADMIN_KEY"
```

**Security note:** Keep your admin key private. The demo uses a shared secret header for admin endpoints; for a production portfolio, replace this with proper authentication, authorization, rate limiting and HTTPS.

## 6. Personalize before publishing

Search in `public/index.html` and update:
- `Kishore` if you want a different display name
- The email placeholder in the Contact section
- GitHub and LinkedIn profile links
- Education details and project descriptions
- Add real GitHub repository and live demo URLs to project records

You can update the starter projects in MySQL, for example:

```sql
USE portfolio_db;
UPDATE projects
SET github_url = 'https://github.com/YOUR_USERNAME/YOUR_REPOSITORY'
WHERE title = 'Agima Gifts';
```

Only add links that actually exist. The starter records intentionally leave project URLs empty.

## 7. Deployment

This application serves both the frontend and API from one Express server, so you can deploy it as one Node web service.

1. Push the project to a GitHub repository.
2. Create a managed MySQL database with a hosting provider.
3. Create a Node.js web service on Render (or another Node host) and connect the GitHub repository.
4. Set the build command to `npm install` and start command to `npm start`.
5. Add the database connection environment variables and a strong `ADMIN_KEY` in the hosting dashboard.
6. Run `database/portfolio.sql` against the hosted database using the provider's database connection details.
7. Open the deployed service URL and test `/api/health`, the projects section and contact form.

Do not use `localhost` as the database host in production. Use the database host supplied by your managed database provider. Keep credentials out of source control.

## 8. Troubleshooting

- **Access denied for MySQL:** Check `DB_USER` and `DB_PASSWORD`.
- **Unknown database:** Run `database/portfolio.sql`.
- **ECONNREFUSED:** Make sure the MySQL service is running and `DB_HOST`/`DB_PORT` are correct.
- **Port already in use:** Change `PORT` in `.env`.
- **Admin endpoint returns 401:** Check the `X-Admin-Key` header.
- **Admin endpoint returns 503:** Set a private `ADMIN_KEY` in `.env` and restart the server.

## Project structure

```text
personal-portfolio-fullstack/
├── database/
│   └── portfolio.sql
├── public/
│   ├── css/style.css
│   ├── js/app.js
│   └── index.html
├── src/
│   ├── config/db.js
│   ├── middleware/adminAuth.js
│   └── routes/
│       ├── contact.js
│       └── projects.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```
