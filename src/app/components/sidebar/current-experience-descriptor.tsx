import { LabDTO } from "@/types/dtos";

export default function CurrentExperienceDescriptor({ lab }: { lab: LabDTO }) {
    return (
        <div className={"flex flex-col text-left w-full text-wrap"}>
            <p className={"text-xs"}>Current experience:</p>
            <p className={"font-bold"}>{lab.name}</p>
            <p className={"text-xs"}>{lab.subtitle}</p>
        </div>
    );
}
