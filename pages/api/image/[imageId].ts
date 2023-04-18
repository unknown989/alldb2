import { Image, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../lib/db.server";

type Data = {
    image: Image
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { imageId } = req.query;
    const data = await prisma.image.findUnique({
        where: {
            id: imageId?.toString(),
        }
    });
    if (data === null) {
        res.status(404).json({ image: { id: "", createdAt: new Date(), data: "", details: "", ownerid: "", updatedAt: new Date() }, message: "Cannot find the image" })
    } else {

        res.status(200).json(
            {
                image: data,
                message: ""
            }
        )
    }
}

