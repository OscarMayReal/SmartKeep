"use client";
import { motion } from "framer-motion";

export default function Page() {
    return (
        <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
            <div className="page-header">
                <div>
                    <h1 className="page-header-title">Locations</h1>
                    <h2 className="page-header-subtitle">See your locations</h2>
                </div>
            </div>
        </motion.div>
    );
}