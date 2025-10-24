import { motion } from "framer-motion";
import { AArrowDownIcon, AArrowUpIcon, ArchiveIcon, ArrowDownToLineIcon, ArrowUpFromLineIcon, BarcodeIcon, ClockIcon, KeyboardIcon, MapPinIcon, MoveIcon, PlusIcon, SearchIcon, Trash2Icon, UserIcon } from "lucide-react";
import { useRef, useState } from "react";
import { AddAssetDrawer } from "./assettable";

export function InventoryRibbon({AssetsListHook}: {AssetsListHook: any}) {
    const [selectedTab, setSelectedTab] = useState("Home");
    const [sort, setSort] = useState("nameatoz");
    const [createOpen, createOpenSet] = useState(false);
    const tabs = ["Home", "Filter"];
    return <div className="ribbon-base">
        <RibbonTabRow tabs={tabs} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <RibbonContent>
            {selectedTab === "Home" && <RibbonTabContent>
                <RibbonGroup title="Add">
                    <AddAssetDrawer open={createOpen} setOpen={createOpenSet} AssetsListHook={AssetsListHook} asChild={false}>
                        <RibbonItem Icon={PlusIcon} title="Add Asset"/>
                    </AddAssetDrawer>
                </RibbonGroup>
                <RibbonGroup title="Delete">
                    <RibbonItem Icon={Trash2Icon} title="Delete Asset"/>
                    <RibbonItem Icon={ArchiveIcon} title="Archive Asset"/>
                </RibbonGroup>
                <RibbonGroup title="Manage">
                    <RibbonItem Icon={ArrowUpFromLineIcon} title="Check In"/>
                    <RibbonItem Icon={ArrowDownToLineIcon} title="Check Out"/>
                </RibbonGroup>
                <RibbonGroup title="Location">
                    <RibbonItem Icon={MapPinIcon} title="View Location"/>
                    <RibbonItem Icon={MoveIcon} title="Change Location"/>
                </RibbonGroup>
            </RibbonTabContent>}
            {selectedTab === "Filter" && <RibbonTabContent>
                <RibbonGroup title="Find">
                    <RibbonItem Icon={BarcodeIcon} title="Scan Barcode"/>
                    <RibbonItem Icon={KeyboardIcon} title="Serial Number"/>
                    <RibbonItem Icon={SearchIcon} title="Search Name"/>
                </RibbonGroup>
                <RibbonGroup title="Filter">
                    <RibbonItem Icon={MapPinIcon} title="Asset Location"/>
                    <RibbonItem Icon={UserIcon} title="Checked Out To"/>
                </RibbonGroup>
                <RibbonGroup title="Sort">
                    <RibbonItem Icon={AArrowDownIcon} title="Name (A-Z)" onClick={() => setSort("nameatoz")} active={sort === "nameatoz"}/>
                    <RibbonItem Icon={AArrowUpIcon} title="Name (Z-A)" onClick={() => setSort("nameztoa")} active={sort === "nameztoa"}/>
                    <RibbonItem Icon={ClockIcon} title="Newest First" onClick={() => setSort("newestfirst")} active={sort === "newestfirst"}/>
                    <RibbonItem Icon={ClockIcon} title="Oldest First" onClick={() => setSort("oldestfirst")} active={sort === "oldestfirst"}/>
                </RibbonGroup>
            </RibbonTabContent>}
        </RibbonContent>
    </div>;
}

function RibbonTabContent({children}: {children?: React.ReactNode}) {
    return <motion.div animate={{ x: 0 }} initial={{ x: 20 }} exit={{ x: -20 }} transition={{ duration: 0.15, ease: "easeOut" }} className="ribbon-tab-content">
        {children}
    </motion.div>;
}

function RibbonContent({children}: {children?: React.ReactNode}) {
    return <div className="ribbon-content shadow-sm rounded-md bg-white h-[100px] w-full">
        {children}
    </div>;
}

function RibbonItem({Icon, title, onClick, active}: {Icon: React.JSX.ElementType, title: string, onClick?: () => void, active?: boolean}) {
    return <div className={"ribbon-item" + (active ? " ribbon-item-active" : "")} onClick={onClick}>
        <Icon className="ribbon-item-icon" size={25}/>
        <h1 className="ribbon-item-title">{title}</h1>
    </div>;
}

function RibbonGroup({children, title}: {children?: React.ReactNode, title: string}) {
    return <div className="ribbon-group">
        <p className="ribbon-group-title">{title}</p>
        {children}
    </div>;
}

function RibbonTabRow({tabs, selectedTab, setSelectedTab}: {tabs: string[], selectedTab: string, setSelectedTab: (tab: string) => void}) {
    return <div className="ribbon-tab-row">
        {tabs.map((tab) => (
            <RibbonTab key={tab} tab={tab} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        ))}
    </div>;
}

export function RibbonTab({tab, selectedTab, setSelectedTab}: {tab: string, selectedTab: string, setSelectedTab: (tab: string) => void}) {
    var ref = useRef<HTMLDivElement>(null);
    return <div key={tab} className={"ribbon-tab " + (selectedTab === tab ? "ribbon-tab-selected" : "")} onClick={() => setSelectedTab(tab)} ref={ref}>
        {tab}
        {selectedTab === tab && <motion.div
            key={`ribbon-animated-` + tab}
            layoutId="ribbon-animated"
            className="ribbon-item-animated"
            style={{
                width: ref.current?.clientWidth,
            }}
            transition={{
                ease: "easeInOut",
                duration: 0.15,
            }}
        />}
    </div>;
}