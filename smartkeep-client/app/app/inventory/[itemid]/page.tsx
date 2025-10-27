"use client";
import { motion } from "framer-motion";
import { useRequests } from "@/lib/useRequests";
import { QuickActionsItem, AssetInfo, LocationQuickView } from "@/components/assettable";
import { useEffect } from "react";

export default function ItemPage({ params }: { params: { itemid: string } }) {
    const data = useRequests({ requests: [{ url: "/assets/" + params.itemid, resType: "json" }] });
    useEffect(() => {
        data.reload();
    }, [params.itemid]);
    return (
        data.loaded && data.data["/assets/" + params.itemid] && <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
            <div className="page-header">
                <div>
                    <h1 className="page-header-title">{data?.data["/assets/" + params.itemid].data.name}</h1>
                    <h2 className="page-header-subtitle">{data?.data["/assets/" + params.itemid].data.id}</h2>
                </div>
            </div>
            <QuickActionsItem asset={data?.data["/assets/" + params.itemid].data} dataHook={data} />
            <AssetInfo asset={data?.data["/assets/" + params.itemid].data} />
            <LocationQuickView location={data?.data["/assets/" + params.itemid].data.location} />
        </motion.div>
    );
}