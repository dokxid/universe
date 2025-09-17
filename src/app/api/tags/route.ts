import {clientPromise} from "@/lib/mongodb/connections";


export async function GET() {
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const collection = db.collection("tags");

    const experiences = await collection.find({}).toArray();
    return Response.json(experiences)
}
