"use client";
import { motion } from "framer-motion";
import { useRequests } from "@/lib/useRequests";
import { QuickActionsItem, AssetInfo } from "@/components/assettable";
import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'

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
            {data?.data["/locations/" + params.itemid].data.geolocation && <MapContainer className="shadow-sm rounded-md" center={data?.data["/locations/" + params.itemid].data.geolocation.split(", ")} style={{ height: "500px", width: "100%", backgroundColor: "white", overflow: "hidden", marginTop: "10px" }} zoom={20} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={data?.data["/locations/" + params.itemid].data.geolocation.split(", ")} />
            </MapContainer>}
        </motion.div>
    );
}