"use client"
import { AddUserToApp, CreateApp, createDomain, getUserByUsername, removeUserFromApp, updateApp, useAdminAppsList, useTenantsList, useUsersList, verifyDomain } from "@/lib/admin";
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, Row } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { ArrowDownFromLineIcon, ArrowUpFromLineIcon, CheckIcon, ClipboardCopyIcon, EditIcon, MapPinIcon, PlusIcon, SaveIcon, SearchIcon, XIcon } from "lucide-react";
import { ConfirmDialog } from "./confirmDialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { addAsset, MoveAssetToLocation } from "@/lib/assets";
import { BarcodeScannerInput, InputField, SelectInput } from "./fields";
import { useRouter } from "next/navigation";
import { getAuth, useAuth } from "keystone-lib";
import { Checkbox } from "./ui/checkbox";
import { useWindowSize } from "@/lib/screensize";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useRequests } from "@/lib/useRequests";
import { info } from "@/lib/info";

// Dynamic import for react-leaflet components to prevent SSR issues
const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', width: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' }}>Loading map...</div>
});

export function AssetsTable({assetsListHook, assets, setAssets, sort, setSort}: {assetsListHook: any, assets: any, setAssets: (assets: any) => void, sort: string, setSort: (sort: string) => void}) {
    useEffect(() => {
        if (assetsListHook.loaded && assetsListHook.data["/assets"]?.data.length > 0) {
            console.log(assetsListHook.data["/assets"].data)
            let processedAssets = assetsListHook.data["/assets"].data?.map((asset: any) => ({
                selected: false,
                locationName: asset.location?.name,
                checkedOutByModified: asset.checkedOut ? asset.checkedOutBy : "",
                ...asset,
            })) || [];

            // Apply sorting
            if (sort === "nameatoz") {
                processedAssets.sort((a: any, b: any) => a.name.localeCompare(b.name));
            } else if (sort === "nameztoa") {
                processedAssets.sort((a: any, b: any) => b.name.localeCompare(a.name));
            } else if (sort === "newestfirst") {
                processedAssets.sort((a: any, b: any) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            } else if (sort === "oldestfirst") {
                processedAssets.sort((a: any, b: any) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime());
            }

            setAssets(processedAssets);
        }
    }, [assetsListHook, sort]);
    const table = useReactTable({
        data: assets,
        columns: [
            {
                header: "",
                accessorKey: "selected",
                cell: ({row}) => <Checkbox checked={row.original.selected} onCheckedChange={(e) => {setAssets(assets.map((asset: any) => {
                    if (asset.id === row.original.id) {
                        return {
                            ...asset,
                            selected: e,
                        }
                    }
                    return asset;
                }))}} onClick={(e) => {e.stopPropagation()}} />,
                size: 36,
                maxSize: 36,
            },
            {
                header: "Name",
                accessorKey: "name",
                sortingFn: "alphanumeric"
            },
            {
                header: "Location",
                accessorKey: "locationName",
            },
            {
                header: "Barcode",
                accessorKey: "barcode",
            },
            {
                header: "Serial Number",
                accessorKey: "serialNumber",
            },
            {
                header: "Checked Out",
                accessorKey: "checkedOut",
            },
            {
                header: "Checked Out By",
                accessorKey: "checkedOutByModified",
            },
            {
                header: "Created At",
                accessorKey: "addedAt",
                sortingFn: "datetime",
                cell: ({row}) => new Date(row.original.addedAt).toLocaleString(),
            },
        ],
        getCoreRowModel: getCoreRowModel(),
    });
    if (!assetsListHook.loaded) {
        return <div>Loading...</div>;
    }
    return (
        <div className="overflow-hidden rounded-md border bg-card text-card-foreground shadow-sm w-full">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow style={{ color: "var(--qu-text)" }} key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead style={{ color: "var(--qu-text)" }} key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRowWithDrawer key={row.id} row={row} assetsListHook={assetsListHook} assets={assets} setAssets={setAssets} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

const TableRowWithDrawer = ({row, assetsListHook, assets, setAssets}: {row: Row<any>, assetsListHook: any, assets: any, setAssets: (assets: any) => void}) => {
    const screenwidth = useWindowSize();
    // const [open, setOpen] = useState(false);
    const router = useRouter();
    return (
        <>
            <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                    // <TableCell key={cell.id} onClick={() => setOpen(true)}>
                    <TableCell style={{ color: "var(--qu-text)" }} key={cell.id} onClick={() => screenwidth.width < 1120 ? router.push(`/app/inventory/${row.original.id}`) : setAssets(assets.map((asset: any) => {
                        if (asset.id === row.original.id) {
                            return {
                                ...asset,
                                selected: !asset.selected,
                            }
                        }
                        return asset;
                    }))}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
            </TableRow>
            {/* <AssetInfoDrawer open={open} setOpen={setOpen} asset={row.original} assetsListHook={assetsListHook} /> */}
        </>
    );
}

function AssetInfoDrawer({open, setOpen, asset, assetsListHook}: {open: boolean, setOpen: (open: boolean) => void, asset: any, assetsListHook: any}) {
    return (
        <Drawer handleOnly direction="right" open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{asset.name}</DrawerTitle>
                    <DrawerDescription>Manage this asset</DrawerDescription>
                </DrawerHeader>
                <Separator />
                <div className="drawer-mainarea">
                    <CopyValueRow value={asset.name} title="Name" />
                    <CopyValueRow value={asset.location} title="Location" />
                    <CopyValueRow value={asset.barcode} title="Barcode" />
                    <CopyValueRow value={asset.serialNumber} title="Serial Number" />
                    <CopyValueRow value={asset.checkedOutBy} title="Checked Out By" />
                </div>
                <Separator />
                <DrawerFooter style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                    <Button onClick={() => setOpen(false)}><XIcon size={20} />Close</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export function AddAssetDrawer({open, setOpen, AssetsListHook, children, asChild=true}: {open: boolean, setOpen: (open: boolean) => void, AssetsListHook: any, children?: React.ReactNode, asChild?: boolean}) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [barcode, setBarcode] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    return (
        <Drawer handleOnly direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild={asChild}>
                {children ? children : <Button variant="outline"><PlusIcon size={20} />Add Asset</Button>}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle style={{color: "var(--qu-text)", fontWeight: "500"}}>Add Asset</DrawerTitle>
                </DrawerHeader>
                <Separator />
                <div className="drawer-mainarea">
                    <InputField label="Name" value={name} setValue={setName} />
                    {AssetsListHook.loaded && AssetsListHook.data["/locations"].data.length > 0 && <SelectInput label="Location" value={location} setValue={setLocation} options={AssetsListHook.data["/locations"].data.map((location: any) => ({id: location.id, name: location.name}))} />}
                    {/* <InputField label="Barcode" value={barcode} setValue={setBarcode} /> */}
                    <BarcodeScannerInput value={barcode} title="Barcode" setValue={setBarcode} />
                    <InputField label="Serial Number" value={serialNumber} setValue={setSerialNumber} />
                </div>
                <Separator />
                <DrawerFooter style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                    <Button variant="outline" onClick={() => setOpen(false)}><XIcon size={20} />Cancel</Button>
                    <Button onClick={async () => {
                        await addAsset({
                            name,
                            location,
                            barcode,
                            serialNumber,
                        });
                        AssetsListHook.reload();
                        setTimeout(() => {
                            setOpen(false);
                        }, 1000);
                    }}><CheckIcon size={20} />Add</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export function CopyValueRow({value, title, noMargin}: {value: string, title: string, noMargin?: boolean}) {
    const [copied, setCopied] = useState(false);
    return (
        <div style={{padding: noMargin ? "0px" : "20px 20px 0px 20px"}}>
            <div style={{fontSize: "14px", fontWeight: "500", marginBottom: "10px"}}>{title}</div>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px"}}>
                <Input value={value} readOnly style={{flex: 1, backgroundColor: "var(--header-background)", color: "var(--qu-text)"}} />
                <Button variant="outline" onClick={() => {
                    navigator.clipboard.writeText(value);
                    setCopied(true);
                    setTimeout(() => {
                        setCopied(false);
                    }, 2000);
                }}>
                    {copied ? <><CheckIcon size={20} />Copied</> : <><ClipboardCopyIcon size={20} />Copy</>}
                </Button>
            </div>
        </div>
    );
}

export function QuickActionsItem({asset, dataHook}: {asset: any, dataHook: any}) {
    const auth = useAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    return <div className="section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions-row">
            {/* <Button variant="outline" className="button"><PlusIcon/>Add</Button> */}
            <Button disabled={asset.checkedOut || auth.data?.user.id !== asset.checkedOutBy && asset.checkedOutBy !== null} variant="outline" className="button" onClick={async () => {
                await checkAssetInOrOut({asset, checkedOut: true});
                dataHook.reload();
            }}><ArrowUpFromLineIcon/>Check Out</Button>
            <Button disabled={!asset.checkedOut || auth.data?.user.id !== asset.checkedOutBy && asset.checkedOutBy !== null} variant="outline" className="button" onClick={async () => {
                await checkAssetInOrOut({asset, checkedOut: false});
                dataHook.reload();
            }}><ArrowDownFromLineIcon/>Check In</Button>
        </div>
    </div>
}

export function AssetInfo({asset}: {asset: any}) {
    return <div className="section">
        <div className="section-title">Asset Info</div>
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {asset.name && <CopyValueRow noMargin value={asset.name} title="Name" />}
            {asset.location && <CopyValueRow noMargin value={asset.location?.name} title="Location" />}
            {asset.barcode && <CopyValueRow noMargin value={asset.barcode} title="Barcode" />}
            {asset.serialNumber && <CopyValueRow noMargin value={asset.serialNumber} title="Serial Number" />}
        </div>
    </div>
}
    
export async function checkAssetInOrOut({asset, checkedOut}: {asset: any, checkedOut: boolean}) {
    const auth = await getAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL! + "/assets/" + asset.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${auth.data?.sessionId}`,
        },
        body: JSON.stringify({checkedOutBy: auth.data?.user.id, checkedOut}),
    });
    return await response.json();
}

export function MoveAssetToLocationDialog({items, children, dataHook}: {items: any[], children?: React.ReactNode, dataHook: any}) {
    const [open, setOpen] = useState(false);
    const [locationId, setLocationId] = useState("");
    const locations = useRequests({
        requests: [
            {
                url: "/locations",
                resType: "json",
            }
        ]
    });
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Move Asset{items.length > 1 ? "s" : ""} to Location</DialogTitle>
                <DialogDescription>Move {items.length} asset{items.length > 1 ? "s" : ""} to a different location</DialogDescription>
            </DialogHeader>
            <Separator />
            {locations.loaded && <SelectInput noMargin label="Location" value={locationId} setValue={setLocationId} options={locations.data["/locations"].data.map((location: any) => ({id: location.id, name: location.name}))} />}
            <Separator />
            <DialogFooter style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                <Button variant="outline" onClick={() => setOpen(false)}><XIcon size={20} />Cancel</Button>
                <Button onClick={async () => {
                    for (const item of items) {
                        await MoveAssetToLocation({assetId: item.id, locationId});
                    }
                    dataHook.reload();
                    setOpen(false);
                    setLocationId("");
                }}><SaveIcon size={20} />Save</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export function LocationQuickView({location}: {location: any}) {
    const router = useRouter();
    return <div className="section">
        <div className="section-title">Location Info</div>
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <CopyValueRow noMargin value={location.name} title="Name" />
            {location.geolocation && <DynamicMap center={location.geolocation.split(", ").map(Number) as [number, number]} />}
            <Button variant="outline" onClick={() => {
                router.push("/app/locations/" + location.id);
            }}><MapPinIcon size={20} />View Location</Button>
        </div>
    </div>
}

export function AssetTableFooter() {
    return (
        <span style={{display: "flex", flexDirection: "column", alignItems: "center", color: "var(--qu-text-secondary)", fontSize: "16px", marginTop: "10px"}}>
            Quntem SmartKeep • Version {info.version} • <span style={{textDecoration: "underline"}}><a href="https://github.com/quntem/smartkeep" target="_blank" rel="noreferrer">GitHub</a></span>
        </span>
    );
}