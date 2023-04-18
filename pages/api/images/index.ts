import { Image, } from '@prisma/client';
import { randomBytes } from 'crypto';
import { writeFile, writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../lib/db.server";

type Data = {
    images: Image[],
    message?: string,
    status: number;
}

type UploadImageProps = {
    images: string[]
    ownerId: string;
}

/**
 * 
 * @param data the base64 image data
 * @param extension the image extension (without the '.')
 * @returns file location if it was successful or the image data if there was an error
 */
const saveImage = (data: string, extension: string): string => {
    let iserr = false;
    const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const filename = randomBytes(24).toString("hex") + "." + extension;

    if (matches?.length !== 3) {
        iserr = true;
    } else {

        const img_data = Buffer.from(matches[2], "base64");


        writeFileSync("public/images_data/" + filename, img_data);
    }

    return iserr ? data : "/images_data/" + filename;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "GET") {

        res.status(200).json(
            {
                images: await prisma.image.findMany(),
                status: 200,
            }
        )
    } else if (req.method === "POST") {
        const body: UploadImageProps = req.body;
        let proceed = true; // will be false if an error occureed
        body.images.map(async (img) => {

            let extension = img.slice(11, 15).replace(";", "");
            let i = saveImage(img, extension);

            if (proceed) {
                await prisma.image.create({
                    data: {
                        data: i,
                        ownerid: body.ownerId,
                    },
                }).catch((err) => {
                    proceed = false;
                })
            }
        })
        if (!proceed) {
            res.status(500).json({
                images: [],
                status: 500,
                message: "Error occurred while uploading images."
            })
            return;
        }

        res.status(200).json(
            {
                images: [],
                message: 'Success',
                status: 200
            }
        )
    } else {
        res.status(404).json({ images: [], message: "invalid method", status: 404 })
    }
}
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        }
    }
}