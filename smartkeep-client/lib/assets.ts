import { getAuth } from "keystone-lib";

export async function addAsset(asset: any) {
    const auth = await getAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + "/assets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.data?.sessionId}`,
        },
        body: JSON.stringify(asset),
    });
    return response.json();
}

export async function DeleteAsset({assetId}: {assetId: string}) {
    const auth = await getAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + "/assets/" + assetId, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${auth.data?.sessionId}`,
        },
    });
    return response.json();
}

export async function MoveAssetToLocation({assetId, locationId}: {assetId: string, locationId: string}) {
    const auth = await getAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + "/assets/" + assetId + "/location/" + locationId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${auth.data?.sessionId}`,
        },
    });
    return response.json();
}
