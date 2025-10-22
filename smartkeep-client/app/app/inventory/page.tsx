"use client";
import { motion } from "framer-motion";
import { useRequests } from "@/lib/useRequests";
import { AssetsTable } from "@/components/assettable";
import { AddAssetDrawer } from "@/components/assettable";
import { useEffect, useState } from "react";

export default function Page() {
    const data = useRequests({ requests: [{ url: "/assets", resType: "json" }] });
    useEffect(() => {
        console.log(data)
    }, [data]);
    const [open, setOpen] = useState(false);
    return (
        <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
            <div className="page-header">
                <div>
                    <h1 className="page-header-title">Inventory</h1>
                    <h2 className="page-header-subtitle">Manage your inventory</h2>
                </div>
                <AddAssetDrawer open={open} setOpen={setOpen} AssetsListHook={data} />
            </div>
            <AssetsTable assetsListHook={data} />
        </motion.div>
    );
}