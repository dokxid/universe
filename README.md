# universe

one day i will:

- [x] clean up this rushed readme.md
- [ ] make a github organization for heritage lab

# setting up for development

## 3rd party cloud services that may be needed

- [PostgreSQL](https://www.postgresql.org/) for database (self hostable)
- [Garage](https://garagehq.deuxfleurs.fr/) for self hostable AWS S3 compatible object storage

## installing dependencies

yarn magic, or any other pacman u like, you know the drill

```bash
git clone https://github.com/dokxid/universe.git
cd universe
bun install
```

make sure to copy the .env.example to make ur own one for development

```bash
# in repo folder ofc
cp .env.example .env
# these are needed for the generate config script, TODO: either generate with the generate secrets script or make them optional
cp .env.production.example .env.production
cp .env.staging.example .env.staging
```

and fill it out with the things mentioned in the comments in that file

## setting up database and garage for local development

### setup garage

this will be used for all environments:
 - local -> bucket: universe-local
 - staging -> bucket: universe-staging
 - production -> bucket: universe-production

```sh
# enter your desired storage size and node name
vim .env
# generate the config toml out of the .env and start service
./garage/generate-garage-config.sh
docker compose up -d garage
# generate the access key next needs and inser them into .env
./garage/setup-garage.sh
```

### setup postgresql and initial seeding

make sure that `POSTGRES_HOST` and `POSTGRES_DB` are set, to initialize the initial super admin to login.

```sh
docker compose up -d db-local
# the following environment variables should be in the .env already, but just to make sure they contain:
# POSTGRES_HOST=localhost:5432
# POSTGRES_DB=universe-local
vim .env
# generates prisma client and deploys migrations
bun docker:prisma
```

## seeding database

### seed database

there are two different seeding scripts, one meant for testing features, and one meant for the actual deployment (minimal state):

make sure that `BETTER_AUTH_ADMIN_EMAIL` and `BETTER_AUTH_ADMIN_PASSWORD` are set, to initialize the initial super admin to login.

```sh
# seeds database to a minimal state, creates super admin user
bun init:production
# seeds database with test data, creates super admin user
bun init:staging
```

### seeding cypress users for e2e testing

```bash
cp cypress.env.json.example cypress.env.json
```

and fill out the credentials you wanna use for testing

> [!NOTE]
> they will be added without email verification, but make sure its an email u have access for if you wanna try email stuff.

## running the server (finally)

you did it!!

```bash
bun dev
```

> [!NOTE]
> dev:https is just there to test clipboard capabilities, see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard

## run tests

> [!NOTE]
> so far there are only e2e tests in cypress, no component tests yet

### for running automated tests

```bash
bun test
bun e2e:headless
```

### cypress gui

```bash
bun e2e
```

## working with remote development

remember to forward these ports (if not modified):

| port  | service                                       |
| ----- | --------------------------------------------- |
| 3000  | next.js server                                |
| 3900  | garage s3 api port                            |
| 5432  | postgresql default port                       |
| 5433  | postgresql staging docker port  (on host)     |
| 5434  | postgresql production docker port (on host)   |

# deployment via docker

this will contain repeating elements from the local development section, but keep in mind, that this is meant as a checklist when deploying.

## workspace setup

bun magic, or any other pacman u like, you know the drill

```bash
# clone the repo
git clone https://github.com/dokxid/universe.git
cd universe
# install the needed dependencies
bun install
# copy the .env files for environment variable secrets
cp .env.example .env
cp .env.production.example .env.production
cp .env.staging.example .env.staging
# this will set the individual cookie passwords for all environments
./generate_secret.sh
```

make sure to copy the .env.example to make ur own one for development

for production:
```bash
vim .env.production
```

for staging:
```bash
vim .env.staging
```

and fill it out with the things mentioned in the comments in that file

## setup garage

this will be used for all environments:
 - local -> bucket: universe-local
 - staging -> bucket: universe-staging
 - production -> bucket: universe-production

```sh
# enter your desired storage size and node name
vim .env
# generate the config toml out of the .env and start service
./garage/generate-garage-config.sh
docker compose up -d garage
# generate the access key next needs and inser them into .env
./garage/setup-garage.sh
```

## setup postgresql and initial seeding

for production:
```sh
docker compose up -d db-production
# change POSTGRES_HOST and POSTGRES_DB to connect to the right database
# POSTGRES_HOST=localhost:5434
# POSTGRES_DB=universe-production
vim .env
# generates prisma client and deploys migrations
bun docker:prisma
# seeds database to a minimal state, creates super admin user
bun init:production
```

for staging:
```sh
docker compose up -d db-staging
# change POSTGRES_HOST and POSTGRES_DB to connect to the right database, i.e.:
# POSTGRES_HOST=localhost:5433
# POSTGRES_DB=universe-staging
vim .env
# generates prisma client and deploys migrations
bun docker:prisma
# seeds database with test data, creates super admin user
bun init:staging
```

## setup universe app / redeploy changes

for production:
```sh
docker compose up -d app-production --build
```

for staging:
```sh
docker compose up -d app-staging --build
```

if for some reason, you need to build it from scratch with no build cache:
```sh
docker compose build app-production --no-cache
# or
docker compose build app-staging --no-cache
```
