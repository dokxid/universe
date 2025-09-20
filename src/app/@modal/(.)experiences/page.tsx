import {Dialog} from "@/app/components/modal/dialog";
import {ListExperiencesDialog} from "@/app/components/modal/listExperiencesDialog";

export default function Page() {
    return (
        <Dialog
            title="Story experiences"
            description="Explore our Co-Labs built story experiences. They have their own seperate website, to customize their experience a bit more."
        >
            <ListExperiencesDialog/>
        </Dialog>
    );
}
