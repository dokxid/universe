import {MongoClient, ServerApiVersion} from "mongodb";

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// connection uri and options
if (!process.env.MONGODB_URL) {
    throw new Error('please make sure to setup the .env like explained in the README.md')
}
const uri = "mongodb://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PWD + "@" + process.env.MONGODB_URL;
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// In dev, use a global variable so the client isn’t constantly recreated
// In production, always create a new client
if (process.env.NODE_ENV === "development") {
    // Then use without type assertion:
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

async function run() {
    try {
        // Use the clientPromise instead of calling client.connect() directly
        const connectedClient = await clientPromise;

        // Send a ping to confirm a successful connection
        await connectedClient.db("admin").command({ping: 1});
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (e) {
        console.error(e);
    }
}

run().catch(console.dir);

export {clientPromise}