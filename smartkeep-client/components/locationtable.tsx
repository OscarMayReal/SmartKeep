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
import { getAuth, useAuth } from "keystone-lib";
import { Checkbox } from "./ui/checkbox";
import { addLocation } from "@/lib/locations";

export function LocationsTable({locationsListHook}: {locationsListHook: any}) {
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        if (locationsListHook.loaded && locationsListHook.data["/locations"].data) {
            setLocations(locationsListHook.data["/locations"].data.map((location: any) => ({
                ...location,
                itemscount: location._count.assets,
            })));
        }
    }, [locationsListHook]);
    const table = useReactTable({
        data: locations,
        columns: [
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "geolocation",
                accessorKey: "geolocation",
            },
            {
                header: "Total Items",
                accessorKey: "itemscount",
            },
        ],
        getCoreRowModel: getCoreRowModel(),
    });
    if (!locationsListHook.loaded) {
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
                        <TableRowWithDrawer key={row.id} row={row} LocationsListHook={locationsListHook} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

const TableRowWithDrawer = ({row, LocationsListHook}: {row: Row<any>, LocationsListHook: any}) => {
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

// function AssetInfoDrawer({open, setOpen, asset, assetsListHook}: {open: boolean, setOpen: (open: boolean) => void, asset: any, assetsListHook: any}) {
//     return (
//         <Drawer handleOnly direction="right" open={open} onOpenChange={setOpen}>
//             <DrawerContent>
//                 <DrawerHeader>
//                     <DrawerTitle>{asset.name}</DrawerTitle>
//                     <DrawerDescription>Manage this asset</DrawerDescription>
//                 </DrawerHeader>
//                 <Separator />
//                 <div className="drawer-mainarea">
//                     <CopyValueRow value={asset.name} title="Name" />
//                     <CopyValueRow value={asset.location} title="Location" />
//                     <CopyValueRow value={asset.barcode} title="Barcode" />
//                     <CopyValueRow value={asset.serialNumber} title="Serial Number" />
//                     <CopyValueRow value={asset.checkedOutBy} title="Checked Out By" />
//                 </div>
//                 <Separator />
//                 <DrawerFooter style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
//                     <Button onClick={() => setOpen(false)}><XIcon size={20} />Close</Button>
//                 </DrawerFooter>
//             </DrawerContent>
//         </Drawer>
//     );
// }

export function AddLocationDrawer({open, setOpen, LocationsListHook, children, asChild=true}: {open: boolean, setOpen: (open: boolean) => void, LocationsListHook: any, children?: React.ReactNode, asChild?: boolean}) {
    const [name, setName] = useState("");
    const [geolocation, setGeolocation] = useState("");
    return (
        <Drawer handleOnly direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild={asChild}>
                {children ? children : <Button variant="outline"><PlusIcon size={20} />Add Location</Button>}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle style={{color: "var(--qu-text)", fontWeight: "500"}}>Add Location</DrawerTitle>
                </DrawerHeader>
                <Separator />
                <div className="drawer-mainarea">
                    <InputField label="Name" value={name} setValue={setName} />
                    <InputField label="Geolocation" value={geolocation} setValue={setGeolocation} />
                </div>
                <Separator />
                <DrawerFooter style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
                    <Button variant="outline" onClick={() => setOpen(false)}><XIcon size={20} />Cancel</Button>
                    <Button onClick={async () => {
                        await addLocation({
                            name,
                            geolocation,
                        });
                        LocationsListHook.reload();
                        setTimeout(() => {
                            setOpen(false);
                        }, 1000);
                    }}><CheckIcon size={20} />Add</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

// export function AssetInfo({asset}: {asset: any}) {
//     return <div className="section">
//         <div className="section-title">Asset Info</div>
//         <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
//             <CopyValueRow noMargin value={asset.name} title="Name" />
//             <CopyValueRow noMargin value={asset.location} title="Location" />
//             <CopyValueRow noMargin value={asset.barcode} title="Barcode" />
//             <CopyValueRow noMargin value={asset.serialNumber} title="Serial Number" />
//         </div>
//     </div>
// }