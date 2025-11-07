# universe

one day i will:

- [ ] clean up this rushed readme.md
- [ ] make a github organization for heritage lab

# setting up for development

## 3rd party cloud services that may be needed

- [MongoDB](https://www.mongodb.com/) for database (self hostable)
- [Garage](https://garagehq.deuxfleurs.fr/) for self hostable AWS S3 compatible object storage
    - how to set it up: [garage config repo](https://github.com/dokxid/garage-configuration-universe)

## installing dependencies

yarn magic, or any other pacman u like, you know the drill

```bash
git clone https://github.com/dokxid/universe.git
cd universe
yarn install
```

make sure to copy the .env.example to make ur own one for development

```bash
# in repo folder ofc
cp .env.example .env.local
```

and fill it out with the things mentioned in the comments in that file

## seeding database

before u seed, make sure to fill out the mongodb section in the .env file, so the seeder knows, where to seed the data. ~~also make sure ure not accidentally seeding production~~

> [!NOTE]
> if you seed with this script, while the app is running, just be aware that the caches havent been revalidated yet, either revalidate manually or just seed within the app; we just need to seed it initially to get on the site without any bugs

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
yarn dev
```

> [!NOTE]
> dev:https is just there to test clipboard capabilities, see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard

## run tests

> [!NOTE]
> so far there are only e2e tests in cypress, no component tests yet

### for running automated tests

```bash
yarn test
yarn e2e:headless
yarn component:headless # we dont have any tests for this
```

### cypress gui

```bash
yarn e2e
```

## working with remote development

remember to forward these ports (if not modified):

| port  | service                               |
| ----- | ------------------------------------- |
| 3000  | next.js server                        |
| 3900  | garage s3 api port                    |
| 9443  | portainer to manage docker containers |
| 27017 | mongoDB                               |

# deployment via docker

## workspace setup

yarn magic, or any other pacman u like, you know the drill

```bash
git clone https://github.com/dokxid/universe.git
cd universe
bun install
cp .env.example .env
./generate_secret.sh  # this will set the cookie password
```

make sure to copy the .env.example to make ur own one for development

for production:
```bash
cp .env.production.example .env.production
vim .env.production
```

for staging:
```bash
cp .env.staging.example .env.staging
vim .env.staging
```

and fill it out with the things mentioned in the comments in that file

## setup garage

```sh
# enter your desired storage size and node name
vim .env
# generate the config toml out of the .env and start service
./garage/generate-garage-config.sh
docker compose up -d garage
# generate the access key next needs and inser them into .env
./garage/setup-garage.sh
```

## setup mongodb and initial seeding

```sh
# idk why i cant use other .envs yet
docker compose up -d db-production
docker compose up -d db-staging
vim .env  # enter database_url: mongodb://localhost:27017/<db_name>
bun prisma:generate
bun prisma:push
bun seed:docker  # init the database
```

## setup universe app

```sh
docker compose up -d app-production --build
docker compose up -d app-staging --build
```
