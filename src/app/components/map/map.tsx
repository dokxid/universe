"use client";

import CustomMarker from "@/app/components/map/custom-marker";
import { DeckGLMap } from "@/app/components/map/deck-gl-map";
import { MapContextMenu } from "@/app/components/map/map-context-menu";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { getTagLines, TaggedConnectionDTO } from "@/data/dto/geo-dto";
import { setFlyPosition, setZoomLevel } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Experience, StoryDTO } from "@/types/api";
import type { Map } from "maplibre-gl";
import { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
    RAttributionControl,
    RLayer,
    RMap,
    RMarker,
    RNavigationControl,
    RSource,
    useMap,
} from "maplibre-react-components";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

export function MLRCMap({
    stories,
    experiences,
    experienceSlug,
}: {
    stories: StoryDTO[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    const map: Map | null = useMap("main-map");
    const searchParams = useSearchParams();
    const experience = useMemo(() => {
        if (searchParams.size === 0)
            return experiences.find((exp) => exp.slug === experienceSlug);
        const exp = experiences.find(
            (exp) => exp.slug === searchParams.get("exp")
        );
        return exp;
    }, [experienceSlug, experiences, searchParams]);
    const [ctxMenuOpen, setCtxMenuOpen] = useState(false);
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
    const [ptrLngLat, setPtrLngLat] = useState<[number, number] | null>(null);
    const [activeStory, setActiveStory] = useState<StoryDTO | null>(null);
    const mapDOM = useRef(null);
    const mapState = useAppSelector((state) => state.map);
    const settingsState = useAppSelector((state) => state.settings);
    const dispatch = useAppDispatch();

    const storiesFiltered = useMemo(() => {
        if (mapState.tags.length === 0) return stories;
        return stories.filter((story) =>
            story.tags.some((tag) => mapState.tags.includes(tag))
        );
    }, [mapState.tags, stories]);

    // Change from ref to state so React can track changes
    const [connections, setConnections] = useState<TaggedConnectionDTO[]>([]);

    useEffect(() => {
        if (!activeStory) {
            setConnections([]);
            return;
        }
        const storiesExceptActive = storiesFiltered.filter(
            (story) => story._id !== activeStory?._id
        );
        const storiesToUse = [activeStory, ...storiesExceptActive];
        const newConnections = getTaggedConnections(
            storiesToUse,
            mapState.tags
        );
        setConnections(newConnections); // This will trigger a re-render
        console.log("Updated connections:", newConnections);
    }, [activeStory, mapState.tags, storiesFiltered]);

    useEffect(() => {
        if (!map) return;
        map.flyTo({
            center: mapState.flyPosition,
            zoom: mapState.zoomLevel,
        });
    }, [map, mapState.flyPosition, mapState.zoomLevel]);

    function getTaggedConnections(
        stories: StoryDTO[],
        tags: string[]
    ): TaggedConnectionDTO[] {
        const dtoToReturn: TaggedConnectionDTO[] = [];
        for (const tag of tags) {
            const filteredStories = stories.filter((story) =>
                story.tags.includes(tag)
            );
            const tagLines = getTagLines(filteredStories);
            dtoToReturn.push({
                tag: tag,
                lineStrings: tagLines,
            });
        }
        return dtoToReturn;
    }

    const handleContextMenu = (e: MapLayerMouseEvent) => {
        e.preventDefault();
        setCoords({ x: e.point.x, y: e.point.y });
        setPtrLngLat([e.lngLat.lng, e.lngLat.lat]);
        setCtxMenuOpen(true);
    };

    const handleStorySelection = (story: StoryDTO) => {
        setActiveStory(story);
        console.log("Selected story:", story);
        for (const tag of connections) {
            for (const line of tag.lineStrings) {
                console.log("LineString for tag", tag.tag, line);
            }
        }
    };

    useEffect(() => {
        if (!experience || experience.slug === "universe") return;
        dispatch(setFlyPosition(experience.center.coordinates));
        dispatch(setZoomLevel(experience.initial_zoom));
    }, [dispatch, experience]);

    const tagColors: Record<string, string> = {
        "Agriculture/Farms": "#22c55e", // green
        Industry: "#3b82f6", // blue
        Transportation: "#f59e0b", // amber
        // Add more colors as needed
    };

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
                <div className={"h-full w-full"}>
                    <RMap
                        mapStyle={settingsState.mapTiles}
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
                        doubleClickZoom={false}
                        onDblClick={handleContextMenu}
                        onContextMenu={handleContextMenu}
                        ref={mapDOM}
                        id="main-map"
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
                            {storiesFiltered.map((story, index) => (
                                <RMarker
                                    longitude={story.location.coordinates[0]}
                                    latitude={story.location.coordinates[1]}
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleStorySelection(story);
                                    }}
                                >
                                    <CustomMarker story={story} />
                                </RMarker>
                            ))}
                        </Suspense>
                        {mapState.showConnections &&
                            connections.map((tag, idx) =>
                                tag.lineStrings.map((line, cidx) => (
                                    <div key={`connection-${idx}-${cidx}`}>
                                        <RSource
                                            id={`connection-${idx}-${cidx}`}
                                            type={"geojson"}
                                            data={line}
                                        />
                                        <RLayer
                                            id={`connection-layer-${idx}-${cidx}`}
                                            type="line"
                                            source={`connection-${idx}-${cidx}`}
                                            paint={{
                                                "line-color":
                                                    tagColors[tag.tag] ||
                                                    "#ff0000",
                                                "line-width": 2,
                                                "line-opacity": 0.8,
                                            }}
                                            layout={{
                                                "line-join": "round",
                                                "line-cap": "round",
                                            }}
                                        />
                                    </div>
                                ))
                            )}
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

export default function MapProvider({
    stories,
    experiences,
    experienceSlug,
}: {
    stories: StoryDTO[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    return (
        // <RMapContextProvider>
        //     <MLRCMap
        //         stories={stories}
        //         experiences={experiences}
        //         experienceSlug={experienceSlug}
        //     ></MLRCMap>
        // </RMapContextProvider>
        <DeckGLMap
            stories={stories}
            experiences={experiences}
            experienceSlug={experienceSlug}
        ></DeckGLMap>
    );
}
