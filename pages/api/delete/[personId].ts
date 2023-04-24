import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../../lib/db.server";

type Data = {
  status: number,
  message: string,
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

  const p = await prisma.people.delete({
    where: {
      id: personId?.toString(),
    }
  })
  if (!p) {
    res.status(500).json({ status: 500, message: "Unable to delete " + personId })
    return;
  }
  res.status(200).json({ status: 200, message: "Success" })
}
