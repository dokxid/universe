"use client";

import CustomMarker from "@/app/components/map/custom-marker";
import { MapContextMenu } from "@/app/components/map/map-context-menu";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { setFlyPosition, setZoomLevel } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Experience, Story } from "@/types/api";
import { type Map, MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { RAttributionControl, RMap, RMarker, RNavigationControl, useMap } from "maplibre-react-components";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

export default function MyMap({
    stories,
    experiences,
    experienceSlug,
}: {
    stories: Story[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    const searchParams = useSearchParams();
    const experience = useMemo(() => {
        const exp = experiences.find(
            (exp) => exp.slug === (searchParams.get("exp") ?? "universe")
        );
        if (!exp) {
            throw new Error(
                "Experience not found, not even fallback 'universe'"
            );
        }
        return exp;
    }, [searchParams.get("exp")]);
    const [ctxMenuOpen, setCtxMenuOpen] = useState(false);
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
    const [ptrLngLat, setPtrLngLat] = useState<[number, number] | null>(null);
    const mapDOM = useRef(null);
    const mapState = useAppSelector((state) => state.map);
    const dispatch = useAppDispatch();

    function ChildComponent() {
        // This component is inside RMap.
        // your MapLibre map instance is always defined and cannot be null.
        const map: Map = useMap();
        useEffect(() => {
            map.flyTo({
                center: mapState.flyPosition,
                zoom: mapState.zoomLevel,
            });
        }, [mapState.flyPosition, mapState.zoomLevel]);
        return null;
    }

    const handleContextMenu = (e: MapLayerMouseEvent) => {
        e.preventDefault();
        setCoords({ x: e.point.x, y: e.point.y });
        setPtrLngLat([e.lngLat.lng, e.lngLat.lat]);
        setCtxMenuOpen(true);
    };

    useEffect(() => {
        if (experience.slug === "universe") return;
        dispatch(setFlyPosition(experience.center.coordinates));
        dispatch(setZoomLevel(experience.initial_zoom));
    }, [experience]);

    return (
        <>
            <div className={"w-full h-full"}>
                <div className={"absolute z-50"}>
                    <MapContextMenu
                        open={ctxMenuOpen}
                        onOpenChange={setCtxMenuOpen}
                        coords={coords}
                        ptrLngLat={ptrLngLat}
                    />
                </div>
                <div className={"sepia h-full w-full brightness-50"}>
                    <RMap
                        mapStyle="https://tiles.stadiamaps.com/styles/stamen_toner.json"
                        initialCenter={mapState.flyPosition}
                        initialZoom={mapState.zoomLevel}
                        initialAttributionControl={false}
                        // dragRotate={false}
                        style={{
                            margin: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "var(--primary)",
                        }}
                        onContextMenu={handleContextMenu}
                        ref={mapDOM}
                    >
                        <Suspense
                            fallback={
                                <div
                                    className={
                                        "flex w-full h-full justify-center items-center"
                                    }
                                >
                                    <Spinner />
                                </div>
                            }
                        >
                            {stories.map((story, index) => (
                                <RMarker
                                    longitude={story.longitude}
                                    latitude={story.latitude}
                                    key={index}
                                >
                                    <CustomMarker
                                        story={story}
                                        experienceSlug={experienceSlug}
                                    />
                                </RMarker>
                            ))}
                        </Suspense>
                        <ChildComponent />
                        <RAttributionControl
                            position={"bottom-left"}
                        ></RAttributionControl>
                        <RNavigationControl
                            position={"bottom-left"}
                        ></RNavigationControl>
                    </RMap>
                </div>
            </div>
        </>
    );
}
