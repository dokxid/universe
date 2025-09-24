import { attachDatabasePool } from "@vercel/functions";
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
    if (!process.env.MONGODB_URI) {
        throw new Error(
            "please define the MONGODB_URI environment variable inside .env"
        );
    }

    const uri = process.env.MONGODB_URI;

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const options = {
            appName: "devrel.vercel.integration",
        };

        if (process.env.NODE_ENV === "development") {
            // In development mode, use the existing cached connection
            cached.promise = mongoose.connect(uri, options);
        } else {
            // In production mode, connect and attach to Vercel's database pool
            cached.promise = mongoose
                .connect(uri, options)
                .then((mongooseInstance) => {
                    // Attach the underlying MongoDB client to Vercel's database pool
                    if (mongooseInstance.connection?.getClient) {
                        attachDatabasePool(
                            mongooseInstance.connection.getClient()
                        );
                    }
                    return mongooseInstance;
                });
        }
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
