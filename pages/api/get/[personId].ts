import { People, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../lib/db.server";

type Data = {
    person: People | null,
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { personId } = req.query;
    const data = await prisma.people.findUnique({
        where: {
            id: personId?.toString(),
        },
        include: {
            images: true,
        }
    })
    if (data === null) {
        res.status(500).json({
            person: null,
            message: "Cannot find person"
        });
    } else {
        res.status(200).json(
            {
                person: data,
                message: ""
            }
        )
    }
}
