import { Button } from "./ui/button";
import { ArrowDownFromLineIcon, ArrowUpFromLineIcon, PlusIcon } from "lucide-react";

export function QuickActions() {
    return <div className="section">
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions-row">
            <Button variant="outline" className="button"><PlusIcon/>Add Asset</Button>
            <Button variant="outline" className="button"><ArrowUpFromLineIcon/>Check Out</Button>
            <Button variant="outline" className="button"><ArrowDownFromLineIcon/>Check In</Button>
        </div>
    </div>
}
    