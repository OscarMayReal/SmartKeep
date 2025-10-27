"use client";
import { QuickActions } from "@/components/dashboard";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

export default function Page() {
    // return (
    //     <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
    //         <div className="page-header">
    //             <div>
    //                 <h1 className="page-header-title">Home</h1>
    //                 <h2 className="page-header-subtitle">Get an overview of your inventory</h2>
    //             </div>
    //         </div>
    //         <QuickActions/>
    //     </motion.div>
    // );
    return redirect("/app/inventory");
}