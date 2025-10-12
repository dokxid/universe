# universe

one day i will:

-   [ ] clean up this rushed readme.md
-   [ ] make a github organization for heritage lab

# setting up for development

## 3rd party cloud services that may be needed

-   [WorkOS](https://workos.com/) for auth
    -   used rn for just authkit and their hosted login interfaces
-   [MongoDB](https://www.mongodb.com/) for database (self hostable)
-   [Garage](https://garagehq.deuxfleurs.fr/) for self hostable AWS S3 compatible object storage
    -   how to set it up: [garage config repo](https://github.com/dokxid/garage-configuration-universe)
    -   in the .env file u will see a `LOCAL_UPLOADER=` line, that will circumvent the garage s3 bucket setup for now. but its still useful for testing production

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

a script is included for seeding databases, you have to include ur own images for now though for the stories:

```bash
# copy image folder for our seeder
cp /path/to/image/folder ./src/data/scripts/seeds/images
yarn seed
```

> [!NOTE]
> if you seed with this script, while the app is running, just be aware that the caches havent been revalidated yet, either revalidate manually or just seed within the app; we just need to seed it initially to get on the site without any bugs

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
