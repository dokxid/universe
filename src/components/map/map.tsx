'use client';

import {RAttributionControl, RMap, RMarker, RNavigationControl, useMap} from 'maplibre-react-components'
import 'maplibre-gl/dist/maplibre-gl.css';
import {MapContextMenu} from "@/components/map/mapContextMenu";
import {useRef, useState} from "react";
import {type Map, MapLayerMouseEvent} from "maplibre-gl";
import {useAppSelector} from "@/lib/hooks";
import {useStories} from "@/lib/data_hooks/storiesHook";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import CustomMarker from "@/components/map/customMarker";


export default function MyMap() {

    const [ctxMenuOpen, setCtxMenuOpen] = useState(false)
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null)
    const [ptrLngLat, setPtrLngLat] = useState<[number, number] | null>(null)
    const mapDOM = useRef(null)
    const mapState = useAppSelector(state => state.map)
    const {stories, isLoading} = useStories()

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

    if (isLoading) return <Spinner/>

    return (
        <>
            <div className="w-full h-full">
                <div className={"absolute z-50"}>
                    <MapContextMenu open={ctxMenuOpen} onOpenChange={setCtxMenuOpen} coords={coords}
                                    ptrLngLat={ptrLngLat}/>
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
                    {stories.map((story) =>
                        <RMarker
                            longitude={story.longitude}
                            latitude={story.latitude}
                            key={story._id.toString()}
                        ><CustomMarker story={story}/></RMarker>
                    )}
                    <ChildComponent/>
                    <RAttributionControl position={"bottom-left"}></RAttributionControl>
                    <RNavigationControl position={"bottom-left"}></RNavigationControl>
                </RMap>
            </div>
        </>
    )
        ;
}
