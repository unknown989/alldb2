import { People, PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "../../lib/db.server";

type Data = {
  people: People[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let p: PrismaClient = prisma;
  
  res.status(200).json({ people: await p.people.findMany() })
}
