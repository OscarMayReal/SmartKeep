import { CreateAsset, DeleteAsset, EditAssetCheckedOut, GetAsset, GetAssets, MoveAssetToLocation } from "../functions.ts";
import { VerifySession } from "../keystone.ts";
import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
    if (!req.headers["authorization"]) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const { name, location, barcode, serialNumber } = req.body;
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
    const asset = await CreateAsset({ name, location, barcode, serialNumber, addedBy: session.user.id, tenantId: session.tenant.id });
    res.json(asset);
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
    const assets = await GetAssets({ tenantId: session.tenant.id });
    res.json(assets);
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
    const asset = await GetAsset({ id: req.params.id });
    res.json(asset);
});

router.put("/:id", async (req, res) => {
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
    const asset = await EditAssetCheckedOut({ id: req.params.id, checkedOutBy: session.user.id, checkedOut: req.body.checkedOut });
    res.json(asset);
});

router.delete("/:id", async (req, res) => {
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
    const asset = await DeleteAsset({ id: req.params.id });
    res.json(asset);
});

router.put("/:id/location/:locationId", async (req, res) => {
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
    const asset = await MoveAssetToLocation({ assetId: req.params.id, locationId: req.params.locationId });
    res.json(asset);
});

export default router;
