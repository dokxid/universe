'use client';

import {RMap, RAttributionControl, RNavigationControl} from 'maplibre-react-components'
import 'maplibre-gl/dist/maplibre-gl.css';
import {MapContextMenu} from "@/components/mapContextMenu";
import React, {useRef, useState} from "react";
import {MapLayerMouseEvent} from "maplibre-gl";


export default function MyMap() {

    const [ctxMenuOpen, setCtxMenuOpen] = useState(false)
    const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(null)
    const [ptrLngLat, setPtrLngLan] = useState<[number, number] | null>(null)
    const mapDOM = useRef(null)

    const handleContextMenu = (e: MapLayerMouseEvent) => {
        e.preventDefault()
        setCoords({x: e.point.x, y: e.point.y})
        setPtrLngLan([e.lngLat.lng, e.lngLat.lat])
        setCtxMenuOpen(true)
    }

    return (
        <>
            <div className="w-screen h-screen">
                <MapContextMenu open={ctxMenuOpen} onOpenChange={setCtxMenuOpen} coords={coords} ptrLngLat={ptrLngLat}
                                className={"absolute z-50"}/>
                <RMap
                    // mapStyle = "https://tiles.stadiamaps.com/styles/stamen_watercolor.json"
                    mapStyle="https://tiles.stadiamaps.com/styles/stamen_toner.json"
                    initialCenter={[24.750592, 59.44435]}
                    initialZoom={5}
                    initialAttributionControl={false}
                    // dragRotate={false}
                    style={{
                        margin: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#222'
                    }}
                    onContextMenu={handleContextMenu}
                    ref={mapDOM}
                >
                    <RAttributionControl position={"bottom-left"}></RAttributionControl>
                    <RNavigationControl position={"bottom-left"}></RNavigationControl>
                </RMap>
            </div>
        </>
    )
        ;
}
