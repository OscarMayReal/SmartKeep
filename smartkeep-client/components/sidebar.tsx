"use client";
import { HomeIcon, LibraryIcon, ListIcon, SidebarCloseIcon, SidebarOpenIcon, UsersIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

const SidebarContext = createContext({ open: true, setOpen: (open: boolean) => {} });

export function Sidebar() {
    const [open, setOpen] = useState(true);
    return <SidebarContext.Provider value={{ open, setOpen }}>
        <div className={"sidebar" + (open ? " sidebar-open" : " sidebar-closed")}>
            <SidebarHeader/>
            <SidebarItem Icon={HomeIcon} title="Home" url="/app"/>
            <SidebarItem Icon={LibraryIcon} title="Inventory" url="/app/inventory"/>
            <SidebarItem Icon={UsersIcon} title="People" url="/app/people"/>
            <SidebarItem Icon={ListIcon} title="Activity" url="/app/activity"/>
        </div>
    </SidebarContext.Provider>;
}

function SidebarHeader() {
    const { open, setOpen } = useContext(SidebarContext);
    return <div className={"sidebar-header" + (open ? " sidebar-header-open" : " sidebar-header-closed")}>
        <h1 className={"sidebar-header-title" + (open ? " sidebar-header-title-open" : " sidebar-header-title-closed")}>SmartKeep</h1>
        <div style={{ flex: 1 }}/>
        {open ? <SidebarCloseIcon size={20} className="sidebar-header-icon" onClick={() => setOpen(!open)}/> : <SidebarOpenIcon size={20} className="sidebar-header-icon" onClick={() => setOpen(!open)}/>}
    </div>;
}

function SidebarItem({ Icon, title, url }: { Icon: React.JSX.ElementType, title: string, url: string }) {
    const { open } = useContext(SidebarContext);
    const router = useRouter();
    const path = usePathname();
    return <Tooltip>
        <TooltipTrigger asChild>
            <div className={"sidebar-item" + (open ? " sidebar-item-open" : " sidebar-item-closed") + (path == url ? " sidebar-item-active" : "")} onClick={() => router.push(url)}>
                {path == url && <motion.div
                    key={`tabbar-animated-` + url}
                    layoutId="tabbar-animated"
                    className="sidebar-item-animated"
                    transition={{
                        ease: "easeInOut",

                    }}
                />}
                <Icon className={"sidebar-item-icon"} size={20}/>
                <h1 className={"sidebar-item-title" + (open ? " sidebar-item-title-open" : " sidebar-item-title-closed")}>{title}</h1>
            </div>
        </TooltipTrigger>
        {!open && <TooltipContent side="right">{title}</TooltipContent>}
    </Tooltip>
}