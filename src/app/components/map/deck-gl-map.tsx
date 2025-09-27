import CustomMarker from "@/app/components/map/custom-marker";
import { MapContextMenu } from "@/app/components/map/map-context-menu";
import { getTagLines, TaggedConnectionDTO } from "@/data/dto/geo-dto";
import { setSelectedStoryId } from "@/lib/features/map/mapSlice";
import { setDescriptorOpen } from "@/lib/features/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { stringToArrayColor } from "@/lib/utils/color-string";
import { Experience, StoryDTO, UnescoTagDTO } from "@/types/api";
import {
    DeckProps,
    LayersList,
    MapViewState,
    PickingInfo,
} from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ArcLayer } from "deck.gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    AttributionControl,
    Map,
    MapLayerMouseEvent,
    Marker,
    useControl,
    useMap,
} from "react-map-gl/maplibre";

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz

type TagConnection = {
    from: [longitude: number, latitude: number];
    to: [longitude: number, latitude: number];
    tag: string;
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
    const flyBackState = useAppSelector((state) => state.map.flyBack);
    useEffect(() => {
        if (!map || !currentExperience) return;
        map.flyTo({
            center: currentExperience.center.coordinates,
            zoom: currentExperience.initial_zoom,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentExperience]);
    useEffect(() => {
        if (!map) return;
        map.flyTo({
            center: currentExperience.center.coordinates,
            zoom: currentExperience.initial_zoom,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flyBackState]);
    return null;
}

// color mapping for tags
// const getTagColor = (tag: string): [number, number, number] => {
//     const colorMap: { [key: string]: [number, number, number] } = {
//         "Agriculture/Farms": [34, 139, 34], // Forest Green
//         "Boats/Ships": [0, 100, 200], // Blue
//         Clothing: [220, 20, 60], // Crimson
//         Education: [138, 43, 226], // Blue Violet
//         Family: [255, 140, 0], // Dark Orange
//         Fishing: [50, 205, 50], // Lime Green
//         Food: [255, 20, 147], // Deep Pink
//         Hospitals: [255, 0, 0], // Red
//         Housing: [255, 165, 0], // Orange
//         Language: [75, 0, 130], // Indigo
//         Marriage: [255, 105, 180], // Hot Pink
//         // Add more tag colors as needed
//         default: [128, 128, 128], // Gray for unknown tags
//     };

//     return colorMap[tag] || colorMap.default;
// };

export function DeckGLMap({
    tags,
    stories,
    experiences,
    experienceSlug,
}: {
    tags: UnescoTagDTO[];
    stories: StoryDTO[];
    experiences: Experience[];
    experienceSlug: string;
}) {
    // next js router stuff
    const { mainMap: map } = useMap();
    const searchParams = useSearchParams();

    // redux stuff
    const settingsState = useAppSelector((state) => state.settings);
    const mapState = useAppSelector((state) => state.map);

    // react state stuff
    const [hoverInfo, setHoverInfo] = useState<PickingInfo<TagConnection>>();
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
    const [ptrLngLat, setPtrLngLat] = useState<[number, number] | null>(null);
    const [ctxMenuOpen, setCtxMenuOpen] = useState(false);
    const [activeStory, setActiveStory] = useState<StoryDTO | null>(null);
    const [connections, setConnections] = useState<TagConnection[]>([]);
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

    const getTagColor = (tag: string): [number, number, number] => {
        const foundTag = tags.find((t) => t.name === tag);
        return foundTag ? stringToArrayColor(foundTag.color) : [128, 128, 128]; // Default to gray if not found
    };
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
            activeStory.tags
        );
        const connectionsSanitized: TagConnection[] = newConnections.flatMap(
            (conn) =>
                conn.lineStrings.map((lineString) => {
                    const coords = lineString.coordinates;
                    return {
                        from: coords[0] as [number, number],
                        to: coords[coords.length - 1] as [number, number],
                        tag: conn.tag, // Include the tag
                    };
                })
        );
        setConnections([]);
        setConnections(connectionsSanitized);
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
            // colored arcs (different tags different colors, looks bad tho)
            new ArcLayer({
                id: "arcs",
                data: connections,
                getSourcePosition: (d: TagConnection) => d.from,
                getTargetPosition: (d: TagConnection) => d.to,
                getSourceColor: (d: TagConnection) => getTagColor(d.tag),
                getTargetColor: (d: TagConnection) => getTagColor(d.tag),
                getWidth: 3,
                pickable: true,
                onHover: (info) => setHoverInfo(info),
            }),

            //     // monocolor arcs (different tags same color)
            //     new ArcLayer<TagConnection>({
            //         id: "arcs",
            //         data: connections,
            //         getSourcePosition: (d: TagConnection) => d.from,
            //         getTargetPosition: (d: TagConnection) => d.to,
            //         getSourceColor: [0, 128, 200],
            //         getTargetColor: [200, 0, 80],
            //         getWidth: 3,
            //         pickable: true,
            //         onHover: (info) => setHoverInfo(info),
            //     }),
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
                <Map
                    onClick={() => {
                        setActiveStory(null);
                        dispatch(setSelectedStoryId(""));
                        dispatch(setDescriptorOpen(false));
                    }}
                    id="mainMap"
                    initialViewState={INITIAL_VIEW_STATE}
                    onRender={() => {}}
                    mapStyle={settingsState.mapTiles}
                    attributionControl={false}
                    onContextMenu={(e) => {
                        handleContextMenu(e);
                    }}
                    onDblClick={(e) => {
                        handleContextMenu(e);
                    }}
                    projection={settingsState.globeView ? "globe" : "mercator"}
                >
                    <AttributionControl
                        compact={true}
                        position={"bottom-left"}
                    />
                    <MapController currentExperience={experience} />
                    {storiesFiltered.map((story, index) => (
                        <Marker
                            longitude={story.location.coordinates[0]}
                            latitude={story.location.coordinates[1]}
                            key={index}
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                handleStorySelection(story);
                                if (!map) return;
                                map.panTo(story.location.coordinates);
                            }}
                        >
                            <CustomMarker
                                story={story}
                                isActive={activeStory?._id === story._id}
                            />
                        </Marker>
                    ))}
                    <DeckGLOverlay pickingRadius={15} layers={layers} />
                    {hoverInfo?.object && (
                        <div
                            className={
                                "absolute z-50 pointer-events-none bg-card p-2 rounded-md shadow-md text-base"
                            }
                            style={{
                                left: hoverInfo.x,
                                top: hoverInfo.y,
                            }}
                        >
                            {`matching tags: ${hoverInfo.object.tag}`}
                        </div>
                    )}
                </Map>
            </div>
        </div>
    );
}
