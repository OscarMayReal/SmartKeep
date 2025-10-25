import { CreateAsset, CreateLocation, EditAssetCheckedOut, GetAsset, GetAssets, GetLocation, GetLocations } from "../functions.ts";
import { VerifySession } from "../keystone.ts";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
    if (!req.headers["authorization"]) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const { name, geolocation } = req.body;
    var session;
    try {
        session = await VerifySession({
            appId: process.env.APP_ID as string,
            keystoneUrl: process.env.KEYSTONE_URL as string,
            sessionId: req.headers["authorization"]?.split(" ")[1],
            appSecret: process.env.APP_SECRET as string
        });
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const location = await CreateLocation({ name, geolocation, tenantId: session.tenant.id });
    res.json(location);
});

router.get("/", async (req, res) => {
    if (!req.headers["authorization"]) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    var session;
    try {
        // console.log(req.headers["authorization"]?.split(" ")[1]);
        // console.log(process.env.APP_ID);
        // console.log(process.env.APP_SECRET);
        // console.log(process.env.KEYSTONE_URL);
        session = await VerifySession({
            appId: process.env.APP_ID as string,
            keystoneUrl: process.env.KEYSTONE_URL as string,
            sessionId: req.headers["authorization"]?.split(" ")[1],
            appSecret: process.env.APP_SECRET as string
        });
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const locations = await GetLocations({ tenantId: session.tenant.id });
    res.json(locations);
});

router.get("/:id", async (req, res) => {
    if (!req.headers["authorization"]) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    var session;
    try {
        session = await VerifySession({
            appId: process.env.APP_ID as string,
            keystoneUrl: process.env.KEYSTONE_URL as string,
            sessionId: req.headers["authorization"]?.split(" ")[1],
            appSecret: process.env.APP_SECRET as string
        });
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const location = await GetLocation({ id: req.params.id });
    res.json(location);
});

// router.put("/:id", async (req, res) => {
//     if (!req.headers["authorization"]) {
//         res.status(401).json({ error: "Unauthorized" });
//         return;
//     }
//     var session;
//     try {
//         session = await VerifySession({
//             appId: process.env.APP_ID as string,
//             keystoneUrl: process.env.KEYSTONE_URL as string,
//             sessionId: req.headers["authorization"]?.split(" ")[1],
//             appSecret: process.env.APP_SECRET as string
//         });
//     } catch (error) {
//         res.status(401).json({ error: "Unauthorized" });
//         return;
//     }
//     const asset = await EditAssetCheckedOut({ id: req.params.id, checkedOutBy: session.user.id, checkedOut: req.body.checkedOut });
//     res.json(asset);
// });

export default router;
