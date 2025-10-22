import { HTMLInputTypeAttribute } from "react";
import { Input } from "./ui/input";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

export function InputField({label, value, setValue, type, style, autoComplete}: {label: string, value: string, setValue: (value: string) => void, type?: HTMLInputTypeAttribute, style?: React.CSSProperties, autoComplete?: HTMLInputTypeAttribute}) {
    return (
        <div style={{padding: "20px 20px 0px 20px", ...style}}>
            <div style={{fontSize: "14px", fontWeight: "500", marginBottom: "10px"}}>{label}</div>
            <Input autoCorrect="off" autoCapitalize="off" style={{backgroundColor: "var(--header-background)"}} value={value} onChange={(e) => setValue(e.target.value)} type={type} autoComplete={autoComplete} />
        </div>
    );
}

export function PrefixedInput({label, value, setValue, prefix, style}: {label: string, value: string, setValue: (value: string) => void, prefix: string, style?: React.CSSProperties}) {
    return (
        <div style={{padding: "20px 20px 0px 20px", ...style}}>
            <div style={{fontSize: "14px", fontWeight: "500", marginBottom: "10px"}}>{label}</div>
            <div className="flex items-center border border-input rounded-md shadow-xs bg-background focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-[color,box-shadow] px-3 h-9 text-base">
                <span style={{color: "var(--qu-text-secondary)"}} className="select-none text-[14px]">{prefix}</span>
                <input autoCorrect="off" autoCapitalize="off" type="text" value={value} onChange={(e) => setValue(e.target.value)} className="outline-none text-[14px] w-full" />
            </div>
        </div>
    );
}

export function SelectInput({label, value, setValue, options}: {label: string, value: string, setValue: (value: string) => void, options: {id: string, name: string, description?: string}[]}) {
    return (
        <div style={{padding: "20px 20px 0px 20px"}}>
            <div style={{fontSize: "14px", fontWeight: "500", marginBottom: "10px"}}>{label}</div>
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger style={{backgroundColor: "var(--header-background)", width: "100%", height: "fit-content"}}>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
                                <div style={{color: "var(--qu-text)"}}>{option.name}</div>
                                {option.description && <div style={{color: "var(--qu-text-secondary)"}}>{option.description}</div>}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export function SuffixedInput({label, value, setValue, suffix, fitInput, pattern, style, type}: {label: string, value: string, setValue: (value: string) => void, suffix: string, fitInput?: boolean, pattern?: string, style?: React.CSSProperties, type?: HTMLInputTypeAttribute}) {
    return (
        <div style={{padding: "20px 20px 0px 20px", ...style}}>
            <div style={{fontSize: "14px", fontWeight: "500", marginBottom: "10px"}}>{label}</div>
            <div className="flex items-center border border-input rounded-md shadow-xs bg-background focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] transition-[color,box-shadow] px-3 h-9 text-base">
                <input autoCorrect="off" autoCapitalize="off" pattern={pattern} type={type} value={value} onChange={(e) => setValue(e.target.value)} className={"outline-none text-[14px]" + (fitInput ? "" : " w-full")} style={{fieldSizing: "content"}} />
                <span style={{color: "var(--qu-text-secondary)"}} className="select-none text-[14px]">{suffix}</span>
            </div>
        </div>
    );
}