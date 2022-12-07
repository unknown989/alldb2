import { People, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../lib/db.server";

type Data = {
    person: People
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { personId } = req.query;
    res.status(200).json(
        {
            person: await prisma.people.findUnique({
                where: {
                    id: personId,
                },
                include: {
                    images: true,
                }
            })
        }
    )
}
