import {clientPromise} from "@/lib/mongodb/connections";
import type {NextApiRequest, NextApiResponse} from 'next'


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const {slug} = req.query
    const client = await clientPromise;
    const db = client.db("hl-universe");
    const experience = await db.collection("experiences").findOne({slug: slug});

    res.status(200).json(experience);
}
