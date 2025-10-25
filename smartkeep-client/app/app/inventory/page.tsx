"use client";
import { motion } from "framer-motion";
import { useRequests } from "@/lib/useRequests";
import { AssetsTable } from "@/components/assettable";
import { AddAssetDrawer } from "@/components/assettable";
import { useEffect, useState } from "react";
import { InventoryRibbon } from "@/components/ribbon";
import ItemPage from "./[itemid]/page";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ArrowLeftIcon, ArrowRightIcon, FileText, LibraryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Page() {
    const [assets, setAssets] = useState<any>([]);
    useEffect(() => {
        console.log(assets)
    }, [assets]);
    const data = useRequests({ 
        requests: [
            { url: "/assets", resType: "json" },
            { url: "/locations", resType: "json" },
        ]
    });
    useEffect(() => {
        console.log(data)
    }, [data]);
    const [open, setOpen] = useState(false);
    return (
        <motion.div initial={{ x: 50 }} animate={{ x: 0 }} transition={{ duration: 0.15, ease: "easeOut" }} className="page-layout">
            {/* <div className="page-header">
                <div>
                    <h1 className="page-header-title">Inventory</h1>
                    <h2 className="page-header-subtitle">Manage your inventory</h2>
                </div>
                <AddAssetDrawer open={open} setOpen={setOpen} AssetsListHook={data} />
            </div> */}
            <InventoryRibbon AssetsListHook={data} assets={assets} setAssets={setAssets} /> 
            <div style={{ height: "10px" }}/>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "start", gap: "10px" }}>
                <AssetsTable assetsListHook={data} assets={assets} setAssets={setAssets} />
                <PreviewPane assets={assets} />
            </div>
        </motion.div>
    );
}

function PreviewPane({ assets }: { assets: any }) {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        setIndex(0);
    }, [assets]);
    return (
        <div className="w-full">
            {assets.filter((asset: any) => asset.selected).length > 1 && <div className="rounded-md shadow-sm bg-white w-full mb-[10px]">
                <div className="flex flex-row p-2 gap-2">
                    <Button variant="outline" size="sm" disabled={index == 0} onClick={() => setIndex(index - 1)}><ArrowLeftIcon size={20} />Previous</Button>
                    <Button variant="outline" size="sm" disabled={index == assets.filter((asset: any) => asset.selected).length - 1} onClick={() => setIndex(index + 1)}><ArrowRightIcon size={20} />Next</Button>
                </div>
            </div>}
            <div className="rounded-md shadow-sm bg-white w-full">
                {assets.filter((asset: any) => asset.selected).length > 0 ? <ItemPage params={{ itemid: assets.filter((asset: any) => asset.selected)[index].id }} /> : <Empty>
                        <EmptyContent>
                            <EmptyMedia variant="icon">
                                <LibraryIcon className="h-10 w-10 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyTitle>Nothing selected</EmptyTitle>
                            <EmptyDescription>
                                Select an asset to view its details
                            </EmptyDescription>
                        </EmptyContent>
                    </Empty>}
            </div>
        </div>
    );
}