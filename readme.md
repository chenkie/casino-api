# Casino API

This API goes along with the [React frontend](https://github.com/tjvantoll/devreach-casino) built during [Progress DevReach 2020](https://www.telerik.com/devreach).

## Installation

Start by cloning the repo.

This project uses Prisma for database access and expects a SQLite database under the `prisma` directory.

Create a file in the `prisma` directory called `dev.db`.

Next, install the dependencies.

```bash
// with npm
npm i

// with yarn
yarn
```

## Provide a JWT Secret

There is a file in the root of the project called `.env.example`. Rename this file to `.env` and provide a value for `JWT_SECRET`. This should be a long, strong, unguessable key.

## Run the App

There is a script in the `package.json` file called `dev` which runs `ts-node-dev` for development. Call this script to run the app.

```bash
npm run dev
```

## License

MIT
