import {clientPromise} from "@/lib/mongodb/connections";
import type {NextApiRequest, NextApiResponse} from 'next'


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const collection = db.collection("experiences");

    const experiences = await collection.find({}).toArray();
    return res.status(200).json(experiences);
}