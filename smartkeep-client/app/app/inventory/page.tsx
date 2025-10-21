"use client";
import { motion } from "framer-motion";

export default function Page() {
    return (
        <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
            <div className="page-header">
                <div>
                    <h1 className="page-header-title">Inventory</h1>
                    <h2 className="page-header-subtitle">Manage your inventory</h2>
                </div>
            </div>
        </motion.div>
    );
}