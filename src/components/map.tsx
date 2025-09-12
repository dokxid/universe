'use client';

import {RMap, RAttributionControl, RNavigationControl, useMap} from 'maplibre-react-components'
import 'maplibre-gl/dist/maplibre-gl.css';
import {MapContextMenu} from "@/components/mapContextMenu";
import {useRef, useState} from "react";
import {MapLayerMouseEvent} from "maplibre-gl";
import { type Map } from "maplibre-gl";
import {useAppSelector} from "@/lib/hooks";


export default function MyMap() {

    const [ctxMenuOpen, setCtxMenuOpen] = useState(false)
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
    const [ptrLngLat, setPtrLngLat] = useState<[number, number] | null>(null)
    const mapDOM = useRef(null)
    const mapState = useAppSelector(state => state.map)

    function ChildComponent() {
        // This component is inside RMap.
        // your MapLibre map instance is always defined and cannot be null.
        const map: Map = useMap();
        map.flyTo({
            center: mapState.flyPosition,
            zoom: mapState.zoomLevel,
        })

        return null;
    }
    const handleContextMenu = (e: MapLayerMouseEvent) => {
        e.preventDefault()
        setCoords({x: e.point.x, y: e.point.y})
        setPtrLngLat([e.lngLat.lng, e.lngLat.lat])
        setCtxMenuOpen(true)
    }

    return (
        <>
            <div className="w-full h-full">
                <div className={"absolute z-50"}>
                    <MapContextMenu open={ctxMenuOpen} onOpenChange={setCtxMenuOpen} coords={coords} ptrLngLat={ptrLngLat}/>
                </div>
                <RMap
                    mapStyle="https://tiles.stadiamaps.com/styles/stamen_toner.json"
                    initialCenter={mapState.flyPosition}
                    initialZoom={mapState.zoomLevel}
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
                    <ChildComponent/>
                    <RAttributionControl position={"bottom-left"}></RAttributionControl>
                    <RNavigationControl position={"bottom-left"}></RNavigationControl>
                </RMap>
            </div>
        </>
    )
        ;
}
