import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

export async function CreateAsset({name, location, barcode, serialNumber, addedBy, tenantId}: {name: string, location?: string, barcode?: string, serialNumber?: string, addedBy: string, tenantId: string}) {
    return await prisma.asset.create({
        data: {
            name,
            locationId: location,
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
        },
        include: {
            location: true
        }
    });
}

export async function GetAsset({id}: {id: string}) {
    return await prisma.asset.findUnique({
        where: {
            id
        },
        include: {
            location: true
        }
    });
}

export async function EditAssetCheckedOut({id, checkedOutBy, checkedOut}: {id: string, checkedOutBy: string, checkedOut: boolean}) {
    return await prisma.asset.update({
        where: {
            id
        },
        data: {
            checkedOutBy,
            checkedOut
        }
    });
}

export async function DeleteAsset({id}: {id: string}) {
    console.log(id)
    return await prisma.asset.delete({
        where: {
            id
        }
    });
}

export function MoveAssetToLocation({assetId, locationId}: {assetId: string, locationId: string}) {
    return prisma.asset.update({
        where: {
            id: assetId
        },
        data: {
            locationId
        }
    })
}

export async function CreateLocation({name, tenantId, geolocation}: {name: string, geolocation?: string, tenantId: string}) {
    return await prisma.location.create({
        data: {
            name,
            tenantId,
            geolocation
        }
    });
}

export async function GetLocations({tenantId}: {tenantId: string}) {
    return await prisma.location.findMany({
        where: {
            tenantId
        },
        include: {
            _count: {
                select: {
                    assets: true
                }
            }
        }
    });
}

export async function GetLocation({id}: {id: string}) {
    return await prisma.location.findUnique({
        where: {
            id
        }
    });
}