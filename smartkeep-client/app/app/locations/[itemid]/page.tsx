"use client";
import { motion } from "framer-motion";
import { useRequests } from "@/lib/useRequests";
import { QuickActionsItem, AssetInfo } from "@/components/assettable";
import { useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import for react-leaflet components to prevent SSR issues
const DynamicMap = dynamic(() => import('@/components/DynamicMap'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', width: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>Loading map...</div>
});

export default function ItemPage({ params }: { params: { itemid: string } }) {
    const data = useRequests({ requests: [{ url: "/locations/" + params.itemid, resType: "json" }] });
    useEffect(() => {
        data.reload();
    }, [params.itemid]);
    return (
        data.loaded && data.data["/locations/" + params.itemid] && <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
            <div className="page-header">
                <div>
                    <h1 className="page-header-title">{data?.data["/locations/" + params.itemid].data.name}</h1>
                    <h2 className="page-header-subtitle">{data?.data["/locations/" + params.itemid].data.id}</h2>
                </div>
            </div>
            {data?.data["/locations/" + params.itemid].data.geolocation && <DynamicMap center={data?.data["/locations/" + params.itemid].data.geolocation.split(", ").map(Number) as [number, number]} />}
        </motion.div>
    );
}