"use client";
import { AddLocationDrawer, LocationsTable } from "@/components/locationtable";
import { useRequests } from "@/lib/useRequests";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Page() {
    const data = useRequests({
        requests: [
            {
                url: "/locations",
                resType: "json",
            }
        ]
    })
    const [open, setOpen] = useState(false);
    return (
        <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
            <div className="page-header">
                <div>
                    <h1 className="page-header-title">Locations</h1>
                    <h2 className="page-header-subtitle">See your locations</h2>
                </div>
                <AddLocationDrawer open={open} setOpen={setOpen} LocationsListHook={data} />
            </div>
            <LocationsTable locationsListHook={data} />
        </motion.div>
    );
}