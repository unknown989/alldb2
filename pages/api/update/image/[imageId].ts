import { Image, } from '@prisma/client';
import { unlinkSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../../lib/db.server";

type Data = {
    status: number,
    message: string,
}

type ImageBodyProp = {
    action: "delete" | "update";
    data?: Image;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    if (req.method?.toLowerCase() !== "post") {
        res.status(404).json({
            status: 404,
            message: "Invalid method"
        })
        return;
    }


    const { imageId } = req.query;
    const body: ImageBodyProp = req.body;

    switch (body.action) {
        case "delete":
            {

                const image_name = (await prisma.image.findUnique({
                    where: {
                        id: imageId?.toString(),
                    }
                }))?.data;

                await prisma.image.delete({
                    where: {
                        id: imageId?.toString(),
                    }
                }).catch((err: Error) => {
                    res.status(500).json({ status: 500, message: err.message })
                    return;
                })
                if (image_name && image_name.includes("."))
                    unlinkSync("public" + image_name);
                break;
            }

        case "update":
            {
                if (body.data) {
                    await prisma.image.update({
                        where: {
                            id: imageId?.toString(),
                        },
                        data: {
                            details: body.data?.details || [],
                        }
                    }).catch((err: Error) => {
                        res.status(500).json({ status: 500, message: err.message })
                        return;
                    })
                } else {
                    res.status(500).json({ status: 500, message: "No data was precised. " })
                    break;
                }
            }
        default:
            {
                res.status(500).json({ status: 500, message: "Unknown action. " })
                break;
            }
    }

    res.status(200).json({ status: 200, message: "Success" })
}
