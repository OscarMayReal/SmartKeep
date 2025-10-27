import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { InfoIcon, XIcon } from "lucide-react";
import { info } from "@/lib/info";
import { Button } from "./ui/button";

export function AboutDialog() {
    return (
        <Dialog>
            <DialogTrigger>
                <InfoIcon style={{flexShrink: 0}} color="var(--qu-text)" size={20}/>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>About SmartKeep</DialogTitle>
                    <DialogDescription>Version {info.version}</DialogDescription>
                </DialogHeader>
                <DialogDescription>
                    SmartKeep is a web application that allows you to keep track of your assets. It is open source and can be found on GitHub.
                </DialogDescription>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" style={{color: "var(--qu-text)"}}><XIcon/>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}