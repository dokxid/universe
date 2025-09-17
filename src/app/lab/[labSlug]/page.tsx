'use client'

import React from "react";
import {useParams} from "next/navigation";
import Home from "@/app/page";


export default function LabHome() {

    const params = useParams<{ labSlug: string }>()

    return (
        <Home labSlug={params.labSlug}></Home>
    );
}
