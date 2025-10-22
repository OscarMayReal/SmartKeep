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
import { ArrowDownFromLineIcon, ArrowUpFromLineIcon, CheckIcon, ClipboardCopyIcon, PlusIcon, SaveIcon, SearchIcon, XIcon } from "lucide-react";
import { ConfirmDialog } from "./confirmDialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { addAsset } from "@/lib/assets";
import { InputField } from "./fields";
import { useRouter } from "next/navigation";
import { useAuth } from "keystone-lib";

export function AssetsTable({assetsListHook}: {assetsListHook: any}) {
    const [assets, setAssets] = useState<any>([]);
    useEffect(() => {
        if (assetsListHook.loaded) {
            setAssets(assetsListHook.data["/assets"].data?.map((asset: any) => ({
                ...asset,
            })) || [])
        }
    }, [assetsListHook]);
    const table = useReactTable({
        data: assets,
        columns: [
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Location",
                accessorKey: "location",
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
                accessorKey: "checkedOutBy",
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
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRowWithDrawer key={row.id} row={row} assetsListHook={assetsListHook} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

const TableRowWithDrawer = ({row, assetsListHook}: {row: Row<any>, assetsListHook: any}) => {
    // const [open, setOpen] = useState(false);
    const router = useRouter();
    return (
        <>
            <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                    // <TableCell key={cell.id} onClick={() => setOpen(true)}>
                    <TableCell key={cell.id} onClick={() => router.push(`/app/inventory/${row.original.id}`)}>
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

export function AddAssetDrawer({open, setOpen, AssetsListHook}: {open: boolean, setOpen: (open: boolean) => void, AssetsListHook: any}) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [barcode, setBarcode] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    return (
        <Drawer handleOnly direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline"><PlusIcon size={20} />Add Asset</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle style={{color: "var(--qu-text)", fontWeight: "500"}}>Add Domain</DrawerTitle>
                </DrawerHeader>
                <Separator />
                <div className="drawer-mainarea">
                    <InputField label="Name" value={name} setValue={setName} />
                    <InputField label="Location" value={location} setValue={setLocation} />
                    <InputField label="Barcode" value={barcode} setValue={setBarcode} />
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

export function CopyValueRow({value, title}: {value: string, title: string}) {
    const [copied, setCopied] = useState(false);
    return (
        <div style={{padding: "20px 20px 0px 20px"}}>
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

export function QuickActionsItem({asset}: {asset: any}) {
    const auth = useAuth({
        appId: process.env.NEXT_PUBLIC_KEYSTONE_APP_ID!,
        keystoneUrl: process.env.NEXT_PUBLIC_KEYSTONE_URL!,
    });
    return <div className="section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions-row">
            {/* <Button variant="outline" className="button"><PlusIcon/>Add</Button> */}
            <Button disabled={asset.checkedOut && auth.data?.user.id !== asset.checkedOutBy} variant="outline" className="button"><ArrowUpFromLineIcon/>Check Out</Button>
            <Button disabled={!asset.checkedOut && auth.data?.user.id !== asset.checkedOutBy} variant="outline" className="button"><ArrowDownFromLineIcon/>Check In</Button>
        </div>
    </div>
}
    