# TODO App Backend

## .env

Copy the example file and set your local values.

```bash
cp .env.example .env
```

Set `PORT` and `MONGODB_URI` in `.env`.

## Project Setup

Install dependencies and start MongoDB.

```bash
npm install
```

Start MongoDB locally for development:

```bash
mkdir data
mongod --dbpath data
```

## Commands

Start the API in development or normal mode.

```bash
npm run dev
npm start
```

## OpenAPI Docs

Available while the server is running.

- Swagger UI: `/api-docs`
- JSON spec: `/api-docs.json`

## Tests

Run the API tests and print coverage.

```bash
npm test
```
