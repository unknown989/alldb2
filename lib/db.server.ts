import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient = Object();

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    } else {
        prisma = global.prisma;
    }
}

export default (function (): PrismaClient { return prisma; })();