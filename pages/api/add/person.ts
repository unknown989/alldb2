import { randomBytes } from 'crypto';
import { writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../lib/db.server";

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

  type Body = {
    username: string,
    firstname: string,
    lastname: string,
    keywords: string[],
    sex: string,
    profileimage: string,
    images: string[],
    details: { id: any; name: string; value: string }[],
  }


  const body: Body = req.body;
  const extension = body.profileimage.slice(11, 15).replace(";", "");
  const i = saveImage(body.profileimage, extension);


  const p = await prisma.people.create({
    data: {
      firstname: body.firstname,
      lastname: body.lastname,
      keywords: body.keywords,
      profileimage: i,
      sex: body.sex,
      username: body.username,
      details: body.details ? body.details : [],
    }
  })


  if (!p) {
    res.status(500).json({ status: 500, message: "Unable to create to a new person!" })
    return;
  }

  const images = await prisma.image.createMany({
    data: [...body.images || []].map((img) => {
      return { data: saveImage(img, "jpg"), ownerid: p.id }
    }),
    skipDuplicates: true
  })


  res.status(200).json({ status: 200, message: "Success" })
}


export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' // Set desired value here
        }
    }
}