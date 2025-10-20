# garage configuration for [heritage universe](https://github.com/dokxid/universe)

## set up environment

### cloning this repo

```bash
git clone https://github.com/dokxid/garage-configuration-universe
cd garage-configuration-universe
```

### generating the config

```sh
cp .env.example .env            # generate your own .env to load
vim .env                        # enter the ports you desire
./generate-garage-config.sh     # generate the config to be used
```

### running on docker

```sh
docker compose up -d
```

### create an api key

```sh
./setup-garage.sh
cat keys/.next_server
```

### setup aws cli

enter the outputs from .aws_cli to the [heritage universe](https://github.com/dokxid/universe)
repos .env like this:

```
AWS_ACCESS_KEY=xxx
AWS_SECRET_KEY=xxxxxx
```

and execute the setup-aws-cli script:

```sh
./setup-aws-cli.sh

```

### setup universe next js server for local development

enter the outputs from .next_server to the [heritage universe](https://github.com/dokxid/universe)
repos .env like this:

```
AWS_S3_ENDPOINT=http://localhost:3900
AWS_S3_BUCKET_URL=http://localhost:3900
AWS_REGION=garage
AWS_BUCKET_NAME=universe
AWS_ACCESS_KEY_ID=XXX      # the generated access key
AWS_SECRET_ACCESS_KEY=XXXXX    # the generated secret key
```

## useful information

### references

[garage documentation](https://garagehq.deuxfleurs.fr/)

### commands

```bash
alias garage="docker exec -ti garage-universe-garage-1 /garage"
```
