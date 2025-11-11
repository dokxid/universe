import { LabDTO } from "@/types/dtos";

export default function CurrentLabDescriptor({ lab }: { lab: LabDTO }) {
    return (
        <div className={"flex flex-col text-left w-full text-wrap"}>
            <p className={"text-xs"}>Current lab:</p>
            <p className={"font-bold"}>{lab.name}</p>
            <p className={"text-xs"}>{lab.subtitle}</p>
        </div>
    );
}
