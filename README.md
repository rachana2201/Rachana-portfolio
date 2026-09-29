# Personal Portfolio (Express + MongoDB)

Frontend (HTML/CSS/JS) is served by an Express API that stores projects and contact messages in MongoDB.

## Run locally
1. Create a free MongoDB Atlas cluster and copy its connection string.
2. `cp .env.example .env` and fill in `MONGODB_URI` and `ADMIN_KEY`.
3. `npm install && npm run seed && npm run dev` then open http://localhost:3000

## API
| Method | Route | Auth |
|---|---|---|
| GET | /api/projects | public |
| POST / PUT / DELETE | /api/projects[/:id] | `x-admin-key` header |
| POST | /api/contact | public |
| GET | /api/messages | `x-admin-key` header |

Add a project:
```
curl -X POST http://localhost:3000/api/projects -H "Content-Type: application/json" -H "x-admin-key: YOUR_KEY" \
  -d '{"title":"My App","description":"What it does","tech":["Node.js"],"repoUrl":"https://github.com/you/app"}'
```

## Deploy (Render, free tier)
1. Push this folder to a GitHub repo.
2. Render → New → Web Service → connect the repo. Build: `npm install`. Start: `npm start`.
3. Add environment variables `MONGODB_URI` and `ADMIN_KEY`.
4. In Atlas → Network Access, allow `0.0.0.0/0` (Render's IPs change).
5. Open the Render URL, then run `npm run seed` locally against the same Atlas database to add starter projects.
