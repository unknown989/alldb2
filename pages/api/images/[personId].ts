import { Image } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../lib/db.server";

type Data = {
    images: Image[]
    message: string
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
        select: {
            images: true,
        }
    });

    if (data === null) {
        res.status(404).json({ images: [], message: "Cannot find the person " })
    } else {
        res.status(200).json(
            {
                images: data.images,
                message: ""
            }
        )
    }
}

