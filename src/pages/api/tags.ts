import {clientPromise} from "@/lib/mongodb/connections";
import type {NextApiRequest, NextApiResponse} from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const collection = db.collection("tags");

    const experiences = await collection.find({}).toArray();
    res.status(200).json(experiences);
}
