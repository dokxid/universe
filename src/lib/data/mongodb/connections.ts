import { buildConnectionString } from "@/lib/utils/build-connection-string";
import { attachDatabasePool } from "@vercel/functions";
import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extend globalThis to include mongoose cache
declare global {
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongoose || {
    conn: null,
    promise: null,
};

if (!globalThis.mongoose) {
    globalThis.mongoose = cached;
}

function handleError(err: Error) {
    console.error("MongoDB connection error:", err);
}

async function dbConnect(): Promise<typeof mongoose> {
    if (!process.env.MONGODB_URI || !process.env.MONGODB_DBNAME) {
        throw new Error(
            "Please define the MONGODB_URI and MONGODB_DBNAME environment variable inside .env"
        );
    }
    const uri = buildConnectionString(
        process.env.MONGODB_URI,
        process.env.MONGODB_DBNAME
    );
    console.log("Connecting to MongoDB at URI:", uri);

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const options = {
            appName: "devrel.vercel.integration",
        };

        if (process.env.NODE_ENV === "development") {
            // In development mode, use the existing cached connection
            console.log(
                "development NODE_ENV detected, using cached connection"
            );
            cached.promise = mongoose.connect(uri, options).catch((err) => {
                handleError(err);
                return Promise.reject(err);
            });
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
