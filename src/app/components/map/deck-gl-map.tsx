import CustomMarker from "@/app/components/map/custom-marker";
import { MapContextMenu } from "@/app/components/map/map-context-menu";
import { getTagLines, TaggedConnectionDTO } from "@/data/dto/geo-dto";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { triggerZoomOut } from "@/lib/redux/map/map-slice";
import { setDescriptorOpen } from "@/lib/redux/settings/settings-slice";
import { getTagColor } from "@/lib/utils/color-string";
import { setSelectedStoryIdParams } from "@/lib/utils/param-setter";
import { Experience, StoryDTO, UnescoTagDTO } from "@/types/dtos";
import {
    DeckProps,
    LayersList,
    MapViewState,
    PickingInfo,
} from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ArcLayer } from "deck.gl";
import { EdgeInsets } from "maplibre-gl";
import { usePathname, useSearchParams } from "next/navigation";
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
    selectedStory,
}: {
    currentExperience: Experience;
    selectedStory: StoryDTO | null;
}) {
    const { mainMap: map } = useMap();
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();
    const experience = searchParams.get("exp");
    const mapState = useAppSelector((state) => state.map);

    useEffect(() => {
        let center: [number, number], zoom: number, edgeInsets: EdgeInsets;
        if (selectedStory) {
            center = selectedStory.location.coordinates;
            zoom = 8;
            edgeInsets = isMobile
                ? new EdgeInsets(0, 0, 0, 0)
                : new EdgeInsets(0, 0, 0, 450);
        } else if (experience && experience !== "universe") {
            center = currentExperience.center.coordinates;
            zoom = currentExperience.initial_zoom;
            edgeInsets = new EdgeInsets(0, 0, 0, 0);
        } else {
            return;
        }
        map?.flyTo({
            center,
            zoom,
            padding: edgeInsets,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [experience, selectedStory]);

    useEffect(() => {
        if (!map) return;
        map.zoomOut();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapState.zoomOut]);

    return null;
}

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
    // global state management stuff
    const settingsState = useAppSelector((state) => state.settings);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedFilterTags = searchParams.get("tags");
    const isMobile = useIsMobile();
    const mapStyleUrl = settingsState.mapTiles;
    console.log("mapStyleUrl", mapStyleUrl);

    // react state stuff
    const [arcHeight, setArcHeight] = useState(0);
    const [hoverInfo, setHoverInfo] = useState<PickingInfo<TagConnection>>();
    const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
    const [ptrLngLat, setPtrLngLat] = useState<[number, number] | null>(null);
    const [ctxMenuOpen, setCtxMenuOpen] = useState(false);
    const [activeStory, setActiveStory] = useState<StoryDTO | null>(
        stories.find((story) => story._id === searchParams.get("story")) || null
    );
    const [connections, setConnections] = useState<TagConnection[]>([]);
    const dispatch = useAppDispatch();

    // set correct experience
    const experience = useMemo(() => {
        if (experienceSlug !== "universe") {
            return experiences.find(
                (exp) => exp.slug === experienceSlug
            ) as Experience;
        }
        const experienceToShow = searchParams.get("exp")
            ? searchParams.get("exp")
            : "universe";
        return experiences.find(
            (exp) => exp.slug === experienceToShow
        ) as Experience;
    }, [experienceSlug, experiences, searchParams]);

    const storiesFiltered = useMemo(() => {
        if (selectedFilterTags === null) return stories;
        return stories.filter((story) =>
            story.tags.some((tag) => selectedFilterTags.includes(tag))
        );
    }, [selectedFilterTags, stories]);

    useEffect(() => {
        if (searchParams.get("story") === "") {
            setActiveStory(null);
        } else {
            setActiveStory(
                stories.find(
                    (story) => story._id === searchParams.get("story")
                ) || null
            );
        }
    }, [searchParams, stories]);

    useEffect(() => {
        if (!activeStory) {
            setConnections([]);
            setArcHeight(0.6);
            return;
        }
        setArcHeight(0.6);
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
        setTimeout(() => {
            setArcHeight(connectionsSanitized.length > 0 ? 1 : 0.6);
        }, 100);
        setConnections(connectionsSanitized);
    }, [activeStory, selectedFilterTags, storiesFiltered]);

    const INITIAL_VIEW_STATE: MapViewState = activeStory
        ? {
              longitude: activeStory.location.coordinates[0],
              latitude: activeStory.location.coordinates[1],
              zoom: 8,
          }
        : {
              longitude: experience.center.coordinates[0],
              latitude: experience.center.coordinates[1],
              zoom: experience.initial_zoom,
          };

    const handleContextMenu = (e: MapLayerMouseEvent) => {
        e.preventDefault();
        setCoords({ x: e.point.x, y: e.point.y });
        setPtrLngLat([e.lngLat.lng, e.lngLat.lat]);
        setCtxMenuOpen(true);
    };

    const handleStorySelection = (story: StoryDTO) => {
        setActiveStory(story);
        setSelectedStoryIdParams(pathname, searchParams, story._id);
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
            //         features: connections.map((conn, index) => ({
            //             type: "Feature",
            //             geometry: {
            //                 type: "LineString",
            //                 coordinates: [conn.from, conn.to],
            //             },
            //             properties: {
            //                 tag: conn.tag,
            //                 index: index,
            //             },
            //         })),
            //     },
            //     pickable: true,
            //     stroked: true,
            //     filled: false,
            //     lineWidthMinPixels: 3,
            //     getLineColor: [0, 128, 200],
            //     getLineWidth: 3,
            //     // onHover: (info) => {
            //     //     const infoSanitized: PickingInfo<TagConnection> = {
            //     //         ...info,
            //     //         object: {
            //     //             from: info.object.features.geometry.coordinates[0],
            //     //             to: info.object.features.geometry.coordinates[1],
            //     //             tag: info.object.features.properties.tag,
            //     //         },
            //     //     };
            //     //     setHoverInfo(infoSanitized);
            //     // },
            //     updateTriggers: {
            //         data: connections, // Force update when connections change
            //     },
            // }),
            // colored arcs (different tags different colors, looks bad tho)
            new ArcLayer({
                id: "arcs",
                data: connections,
                greatCircle: true,
                getSourcePosition: (d: TagConnection) => d.from,
                getTargetPosition: (d: TagConnection) => d.to,
                getSourceColor: (d: TagConnection) => getTagColor(tags, d.tag),
                getTargetColor: (d: TagConnection) => getTagColor(tags, d.tag),
                getWidth: 3,
                pickable: true,
                onHover: (info) => setHoverInfo(info),
                getHeight: arcHeight,
                transitions: {
                    getHeight: {
                        duration: 1000,
                        easing: (t: number) => 1 - Math.pow(1 - t, 3), // Ease-out cubic
                    },
                },
            }),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [connections, arcHeight] // Re-create layers when connections change
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
                    reuseMaps={true}
                    onClick={() => {
                        if (activeStory) {
                            setActiveStory(null);
                            setSelectedStoryIdParams(
                                pathname,
                                searchParams,
                                ""
                            );
                            dispatch(triggerZoomOut());
                        }
                        dispatch(setDescriptorOpen(false));
                    }}
                    id="mainMap"
                    initialViewState={INITIAL_VIEW_STATE}
                    onRender={() => {}}
                    mapStyle={mapStyleUrl}
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
                        position={"bottom-right"}
                    />
                    <MapController
                        currentExperience={experience}
                        selectedStory={activeStory}
                    />
                    {storiesFiltered.map((story, index) => (
                        <Marker
                            longitude={story.location.coordinates[0]}
                            latitude={story.location.coordinates[1]}
                            key={index}
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                handleStorySelection(story);
                            }}
                        >
                            <CustomMarker
                                story={story}
                                isActive={activeStory?._id === story._id}
                            />
                        </Marker>
                    ))}
                    <DeckGLOverlay pickingRadius={15} layers={layers} />
                    {hoverInfo?.object && !isMobile && (
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
