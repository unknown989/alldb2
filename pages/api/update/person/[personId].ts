import { People, PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../../lib/db.server";

type Data = {
  status: number,
  message: string,
}

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

  if (req.method?.toLowerCase() !== "post") {
    res.status(404).json({
      status: 404,
      message: "Invalid method"
    })
    return;
  }


  const { personId } = req.query;
  const body: People = req.body;
  let extension = body.profileimage.slice(11, 15).replace(";", "");
  let i = saveImage(body.profileimage, extension);

  await prisma.people.update({
    where: {
      id: personId?.toString(),
    },
    data: {
      firstname: body.firstname,
      lastname: body.lastname,
      keywords: body.keywords,
      profileimage: i,
      sex: body.sex,
      username: body.username,
      details: body.details ? body.details : [],
    }
  }).catch((err: Error) => {
    res.status(500).json({ status: 500, message: err.message })
    return;
  })
  res.status(200).json({ status: 200, message: "Success" })
}
