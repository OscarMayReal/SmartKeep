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