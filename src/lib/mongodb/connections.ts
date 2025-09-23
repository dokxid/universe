import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extend global to include mongoose cache
declare global {
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
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
        cached.promise = mongoose.connect(uri);
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}

export default dbConnect;
