# TODO App Backend

## Setup

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Set `PORT` in `.env`.

Start MongoDB locally in a separate terminal:

```bash
mkdir data
mongod --dbpath data
```

Set `MONGODB_URI` in `.env` to your connection string:

```env
MONGODB_URI=mongodb://<host>:<port>/<database>
```

For Atlas, use your Atlas connection string instead. The database and collection are created on the first write.

Start the API:

```bash
npm run dev
```

Use `npm start` for a normal run without nodemon.

## Docs

- Swagger UI: `/api-docs`
- JSON spec: `/api-docs.json`

## Tests

Run:

```bash
npm test
```

## Assumptions and Limitations

- Single shared todo list; no users or authentication.
- MongoDB must be running before the server starts; there is no reconnect retry.
- Todos are not paginated.
- Titles are limited to 120 characters; descriptions to 1000.
