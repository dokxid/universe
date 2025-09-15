import {memo} from "react";
import {MapPin} from "lucide-react";


function CustomMarker() {
    return (
        <MapPin size={30} fill={"#DBA726"} className={"cursor-pointer"}/>
    );
}

export default memo(CustomMarker);