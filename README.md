```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```


```bash

npm install -D @cloudflare/workers-types

git remote add origin https://github.com/aungkoman/basic-restful-web-service.git


## production API Endpoint 
https://basic-restful-web-service.aungkoman.workers.dev
https://api.software100.com.mm



## pug secret
npx wrangler secret put MY_API_KEY


## Deploy
npx wrangler deploy

```


## Database Seeder

```bash

## Create Table
npx wrangler d1 execute my-restful-web-service-db --local --command="CREATE TABLE expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, amount REAL, date TEXT);"
npx wrangler d1 execute my-restful-web-service-db --remote --command="CREATE TABLE expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, amount REAL, date TEXT);"

## Insert Data
npx wrangler d1 execute my-restful-web-service-db --local --command="INSERT INTO expenses (description, amount, date) VALUES ('Groceries', 54.20, '2026-07-13'), ('Internet Bill', 80.00, '2026-07-14'), ('Coffee', 4.50, '2026-07-15');"
npx wrangler d1 execute my-restful-web-service-db --remote --command="INSERT INTO expenses (description, amount, date) VALUES ('Groceries', 54.20, '2026-07-13'), ('Internet Bill', 80.00, '2026-07-14'), ('Coffee', 4.50, '2026-07-15');"

## Select Data
npx wrangler d1 execute my-restful-web-service-db --local --command="SELECT * FROM expenses;"
```
