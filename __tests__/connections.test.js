import { buildConnectionString } from "@/lib/utils/buildConnectionString";

describe("MongoDB connection", () => {
    it("should generate a valid connection string with search parameters", () => {
        const uri =
            "mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority";
        const dbName = "testdb";

        const connectionString = buildConnectionString(uri, dbName);
        expect(connectionString).toBe(
            "mongodb+srv://user:password@cluster.mongodb.net/testdb?retryWrites=true&w=majority"
        );
    });
    it("should generate a valid connection string with search parameters even with no trailing slash", () => {
        const uri =
            "mongodb+srv://user:password@cluster.mongodb.net?retryWrites=true&w=majority";
        const dbName = "testdb";

        const connectionString = buildConnectionString(uri, dbName);
        expect(connectionString).toBe(
            "mongodb+srv://user:password@cluster.mongodb.net/testdb?retryWrites=true&w=majority"
        );
    });
    it("should not duplicate the database name if already present", () => {
        const uri =
            "mongodb+srv://user:password@cluster.mongodb.net/testdb?retryWrites=true&w=majority";
        const dbName = "testdb";
        const connectionString = buildConnectionString(uri, dbName);
        expect(connectionString).toBe(
            "mongodb+srv://user:password@cluster.mongodb.net/testdb?retryWrites=true&w=majority"
        );
    });
});
