import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

export async function CreateAsset({name, location, barcode, serialNumber, addedBy, tenantId}: {name: string, location?: string, barcode?: string, serialNumber?: string, addedBy: string, tenantId: string}) {
    return await prisma.asset.create({
        data: {
            name,
            location,
            barcode,
            serialNumber,
            addedBy,
            tenantId
        }
    });
}

export async function GetAssets({tenantId}: {tenantId: string}) {
    return await prisma.asset.findMany({
        where: {
            tenantId
        }
    });
}

export async function GetAsset({id}: {id: string}) {
    return await prisma.asset.findUnique({
        where: {
            id
        }
    });
}