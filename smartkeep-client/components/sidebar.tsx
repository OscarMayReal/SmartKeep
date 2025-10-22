"use client";
import { HomeIcon, KeyRoundIcon, LibraryIcon, ListIcon, SidebarCloseIcon, SidebarOpenIcon, UserIcon, UsersIcon } from "lucide-react";
import { createContext, useContext, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "keystone-lib";

const SidebarContext = createContext({ open: true, setOpen: (open: boolean) => {} });

export function Sidebar() {
    const [open, setOpen] = useState(true);
    const session = useAuth({appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID as string, keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL as string});
    return <SidebarContext.Provider value={{ open, setOpen }}>
        <div className={"sidebar" + (open ? " sidebar-open" : " sidebar-closed")}>
            <SidebarHeader/>
            <SidebarItem Icon={HomeIcon} title="Home" url="/app"/>
            <SidebarItem Icon={LibraryIcon} title="Inventory" url="/app/inventory"/>
            <SidebarItem Icon={UsersIcon} title="People" url="/app/people"/>
            <SidebarItem Icon={ListIcon} title="Activity" url="/app/activity"/>
            <div className="flex-1"/>
            <SidebarItem Icon={KeyRoundIcon} title="Manage Users" url={process.env.NEXT_PUBLIC_KEYSTONE_FRONTEND_URL + "/admin/users"}/>
            {session.loaded && session.data?.user && <SidebarItem Icon={UserIcon} title={session.data.user.name} url="/app/profile"/>}
            <div style={{height: "10px"}}/>
        </div>
    </SidebarContext.Provider>;
}

function SidebarHeader() {
    const { open, setOpen } = useContext(SidebarContext);
    return <div className={"sidebar-header" + (open ? " sidebar-header-open" : " sidebar-header-closed")}>
        <img src="/icon.svg" className={"sidebar-header-logo" + (open ? " sidebar-header-logo-open" : " sidebar-header-logo-closed")}/>
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
                    key={`sidebar-animated-` + url}
                    layoutId="sidebar-animated"
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

function TabBarItem({ Icon, title, url }: { Icon: React.JSX.ElementType, title: string, url: string }) {
    const { open } = useContext(SidebarContext);
    const router = useRouter();
    const path = usePathname();
    return <div className={"tabbar-item" + (path == url ? " tabbar-item-active" : "")} onClick={() => router.push(url)}>
        {path == url && <motion.div
            key={`tabbar-animated-` + url}
            layoutId="tabbar-animated"
            className="tabbar-item-animated"
            transition={{
                ease: "easeInOut",
            }}
        />}
        <Icon className={"tabbar-item-icon"} size={20}/>
        <h1 className={"tabbar-item-title"}>{title}</h1>
    </div>
}

export function TabBar() {
    return <div className="tabbar">
        <TabBarItem Icon={HomeIcon} title="Home" url="/app"/>
        <TabBarItem Icon={LibraryIcon} title="Inventory" url="/app/inventory"/>
        <TabBarItem Icon={UsersIcon} title="People" url="/app/people"/>
        <TabBarItem Icon={ListIcon} title="Activity" url="/app/activity"/>
    </div>;
}