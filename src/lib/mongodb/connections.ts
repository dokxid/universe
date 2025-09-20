import mongoose from "mongoose";

declare global {
    var mongoose: any; // This must be a `var` and not a `let / const`
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    // throw error if no .env variable for mongodb_url
    if (!process.env.MONGODB_URL) {
        throw new Error(
            "please make sure to setup the .env like explained in the README.md"
        );
    }

    // compose uri
    const uri =
        "mongodb://" +
        process.env.MONGODB_USERNAME +
        ":" +
        process.env.MONGODB_PWD +
        "@" +
        process.env.MONGODB_URL;

    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
