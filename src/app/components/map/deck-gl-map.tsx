import CustomMarker from "@/app/components/map/custom-marker";
import { MapContextMenu } from "@/app/components/map/map-context-menu";
import { getTagLines, TaggedConnectionDTO } from "@/data/dto/geo-dto";
import { setSelectedStoryId } from "@/lib/features/map/mapSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Experience, StoryDTO } from "@/types/api";
import { DeckProps, LayersList, MapViewState } from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ArcLayer } from "deck.gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    Map,
    MapLayerMouseEvent,
    MapProvider,
    Marker,
    useControl,
    useMap,
} from "react-map-gl/maplibre";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz

type DataType = {
    from: [longitude: number, latitude: number];
    to: [longitude: number, latitude: number];
};

function DeckGLOverlay(props: DeckProps) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

function MapController({
    currentExperience,
}: {
    currentExperience: Experience;
}) {
    const { mainMap: map } = useMap();
    useEffect(() => {
        if (!map || !currentExperience) return;
        map.flyTo({
            center: currentExperience.center.coordinates,
            zoom: currentExperience.initial_zoom,
        });
    }, [map, currentExperience]);
    return null;
}

export function DeckGLMap({
    stories,
    experiences,
    experienceSlug,
}: {
    stories: StoryDTO[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    // next js router stuff
    const searchParams = useSearchParams();

    // redux stuff
    const settingsState = useAppSelector((state) => state.settings);
    const mapState = useAppSelector((state) => state.map);

    // react state stuff
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
    const [ptrLngLat, setPtrLngLat] = useState<[number, number] | null>(null);
    const [ctxMenuOpen, setCtxMenuOpen] = useState(false);
    const [activeStory, setActiveStory] = useState<StoryDTO | null>(null);
    const [connections, setConnections] = useState<DataType[]>([]);
    const dispatch = useAppDispatch();

    // too many react hooks
    const experience = useMemo(() => {
        if (searchParams.size === 0) {
            return experiences.find(
                (exp) => exp.slug === experienceSlug
            ) as Experience;
        } else {
            return experiences.find(
                (exp) => exp.slug === searchParams.get("exp")
            ) as Experience;
        }
    }, [experienceSlug, experiences, searchParams]);

    const storiesFiltered = useMemo(() => {
        if (mapState.tags.length === 0) return stories;
        return stories.filter((story) =>
            story.tags.some((tag) => mapState.tags.includes(tag))
        );
    }, [mapState.tags, stories]);

    useEffect(() => {
        if (!activeStory) {
            console.log("No active story, clearing connections");
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
        const connectionsSanitized: DataType[] = newConnections.flatMap(
            (conn) =>
                conn.lineStrings.map((lineString) => {
                    const coords = lineString.coordinates;
                    return {
                        from: coords[0] as [number, number],
                        to: coords[coords.length - 1] as [number, number],
                    };
                })
        );
        setConnections(connectionsSanitized); // This will trigger a re-render
    }, [activeStory, mapState.tags, storiesFiltered]);

    const INITIAL_VIEW_STATE: MapViewState = {
        longitude: mapState.flyPosition[0],
        latitude: mapState.flyPosition[1],
        zoom: mapState.zoomLevel,
    };

    const handleContextMenu = (e: MapLayerMouseEvent) => {
        e.preventDefault();
        setCoords({ x: e.point.x, y: e.point.y });
        setPtrLngLat([e.lngLat.lng, e.lngLat.lat]);
        setCtxMenuOpen(true);
    };

    const handleStorySelection = (story: StoryDTO) => {
        setActiveStory(story);
        dispatch(setSelectedStoryId(story._id));
    };

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

    const layers: LayersList = useMemo(
        () => [
            // new GeoJsonLayer({
            //     id: "tag_connections",
            //     data: {
            //         type: "FeatureCollection",
            //         features: connections.flatMap((conn) =>
            //             conn.lineStrings.map((lineString, index) => ({
            //                 type: "Feature",
            //                 geometry: lineString,
            //                 properties: {
            //                     tag: conn.tag,
            //                     index: index,
            //                 },
            //             }))
            //         ),
            //     },
            //     pickable: false,
            //     stroked: true,
            //     filled: false,
            //     lineWidthMinPixels: 2,
            //     getLineColor: [0, 128, 200],
            //     getLineWidth: 2,
            //     updateTriggers: {
            //         data: connections, // Force update when connections change
            //     },
            // }),
            new ArcLayer({
                id: "arcs",
                data: connections,
                getSourcePosition: (d: DataType) => d.from,
                getTargetPosition: (d: DataType) => d.to,
                getSourceColor: [0, 128, 200],
                getTargetColor: [200, 0, 80],
                getWidth: 3,
            }),
        ],
        [connections] // Re-create layers when connections change
    );

    return (
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
                <MapProvider>
                    <Map
                        id="mainMap"
                        initialViewState={INITIAL_VIEW_STATE}
                        onRender={() => {}}
                        mapStyle={settingsState.mapTiles}
                        onContextMenu={(e) => {
                            handleContextMenu(e);
                        }}
                    >
                        <MapController currentExperience={experience} />
                        {storiesFiltered.map((story, index) => (
                            <Marker
                                longitude={story.location.coordinates[0]}
                                latitude={story.location.coordinates[1]}
                                key={index}
                                onClick={() => {
                                    handleStorySelection(story);
                                }}
                            >
                                <CustomMarker
                                    story={story}
                                    isActive={activeStory?._id === story._id}
                                />
                            </Marker>
                        ))}
                        <DeckGLOverlay layers={layers} />
                    </Map>
                </MapProvider>
            </div>
        </div>
    );
}
