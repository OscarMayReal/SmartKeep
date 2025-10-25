import { getAuth } from "keystone-lib";

export async function addLocation(location: any) {
    const auth = await getAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + "/locations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.data?.sessionId}`,
        },
        body: JSON.stringify(location),
    });
    return response.json();
}