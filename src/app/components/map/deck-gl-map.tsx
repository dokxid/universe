import CustomMarker from "@/app/components/map/custom-marker";
import { MapContextMenu } from "@/app/components/map/map-context-menu";
import { getTaggedConnectionDTO } from "@/data/dto/geo-dto";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePrevious } from "@/hooks/use-previous";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { triggerZoomOut } from "@/lib/redux/map/map-slice";
import {
    MAP_TILES,
    setDescriptorOpen,
} from "@/lib/redux/settings/settings-slice";
import { getTagColor } from "@/lib/utils/color-string";
import {
    addSelectedTagParam,
    setSelectedStoryIdParams,
} from "@/lib/utils/param-setter";
import { ExperienceDTO, StoryDTO, UnescoTagDTO } from "@/types/dtos";
import {
    DeckProps,
    LayersList,
    MapViewState,
    PickingInfo,
} from "@deck.gl/core";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ArcLayer } from "deck.gl";
import { EdgeInsets, FlyToOptions } from "maplibre-gl";
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

/*
    react-hooks/exhaustive-deps will cry around here, but we don't want to add maps to
    the dependency array, as it would cause infinite loops and break functionality.
*/
function MapController({
    currentExperience,
    selectedStory,
}: {
    currentExperience: ExperienceDTO;
    selectedStory: StoryDTO | null;
}) {
    const { mainMap: map } = useMap();
    const isMobile = useIsMobile();
    const searchParams = useSearchParams();
    const experience = useMemo(
        () => searchParams.get("exp"),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchParams.get("exp")]
    );
    const mapState = useAppSelector((state) => state.map);
    const navigationState = useAppSelector((state) => state.navigation);
    const prevStoryCenter = usePrevious(selectedStory?.location.coordinates);

    useEffect(() => {
        if (!map) return;
        let center: [number, number], zoom: number, edgeInsets: EdgeInsets;
        let options: FlyToOptions = {};

        if (selectedStory) {
            // case: story_old || !story -> story_new selected
            center = selectedStory.location.coordinates;
            zoom = map.getZoom() < 8 ? 8 : map.getZoom();
            edgeInsets = isMobile
                ? new EdgeInsets(0, 0, 0, 0)
                : new EdgeInsets(0, 0, 0, 450);
        } else {
            // case: story -> !story
            center = prevStoryCenter || currentExperience.center.coordinates;
            zoom = map.getZoom();
            edgeInsets = isMobile
                ? new EdgeInsets(0, 0, 0, 0)
                : navigationState.rightSideBarOpen
                ? new EdgeInsets(0, 0, 0, 0)
                : new EdgeInsets(0, 0, 0, 0);
            options = { maxDuration: 0 };
        }
        map.flyTo({
            center,
            zoom,
            padding: edgeInsets,
            ...options,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStory]);

    useEffect(() => {
        if (!map) return;
        const center = currentExperience.center.coordinates;
        const zoom = currentExperience.initial_zoom;
        const edgeInsets = new EdgeInsets(0, 0, 0, 0);
        map.flyTo({
            center,
            zoom,
            padding: edgeInsets,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [experience]);

    useEffect(() => {
        if (!map) return;
        if (map.getZoom() > 8) {
            map.zoomOut();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapState.zoomOut]);

    useEffect(() => {
        if (!map) return;
        if (mapState.resetView) {
            map.setPitch(0);
            map.setBearing(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapState.resetView]);

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
    experiences: ExperienceDTO[];
    experienceSlug: string;
}) {
    // global state management stuff
    const settingsState = useAppSelector((state) => state.settings);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selectedFilterTags = searchParams.get("tags");
    const isMobile = useIsMobile();

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
            ) as ExperienceDTO;
        }
        const experienceToShow = searchParams.get("exp")
            ? searchParams.get("exp")
            : "universe";
        return experiences.find(
            (exp) => exp.slug === experienceToShow
        ) as ExperienceDTO;
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
            setArcHeight(1.2);
            return;
        }
        setArcHeight(1.2);
        const storiesExceptActive = storiesFiltered.filter(
            (story) => story._id !== activeStory?._id
        );
        const tagFilters = selectedFilterTags
            ? selectedFilterTags.split(",")
            : activeStory.tags;
        const storiesToUse = [activeStory, ...storiesExceptActive];
        const connectionsSanitized = getTaggedConnectionDTO(
            storiesToUse,
            tagFilters
        );
        setTimeout(() => {
            setArcHeight(connectionsSanitized.length > 0 ? 1.2 : 0.6);
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

    const getSameRouteConnections = (
        connections: TagConnection[],
        connection: TagConnection
    ) => {
        const sameRouteConnections = connections.filter(
            (conn) =>
                (conn.from[0] === connection.from[0] &&
                    conn.from[1] === connection.from[1] &&
                    conn.to[0] === connection.to[0] &&
                    conn.to[1] === connection.to[1]) ||
                (conn.from[0] === connection.to[0] &&
                    conn.from[1] === connection.to[1] &&
                    conn.to[0] === connection.from[0] &&
                    conn.to[1] === connection.from[1])
        );
        return sameRouteConnections;
    };

    const getArcHeight = (
        connection: TagConnection,
        index: number,
        connections: TagConnection[]
    ) => {
        // Find all connections between the same two points
        const sameRouteConnections = getSameRouteConnections(
            connections,
            connection
        );

        if (sameRouteConnections.length === 1) {
            return arcHeight; // Single arc, use base height
        }

        // Multiple arcs between same points - create different heights
        const arcIndex = sameRouteConnections.indexOf(connection);
        const totalArcs = sameRouteConnections.length;
        const heightVariation = 0.3; // Adjust this to control how much arcs spread

        // Create alternating heights above and below the base
        const offset = (arcIndex - (totalArcs - 1) / 2) * heightVariation;
        return Math.max(0.1, arcHeight + offset);
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
                widthMinPixels: 3,
                pickable: true,
                onHover: (info) => setHoverInfo(info),
                onClick: (info) => {
                    addSelectedTagParam(
                        pathname,
                        searchParams,
                        info.object?.tag
                    );
                    return true;
                },
                getHeight: (d: TagConnection & { index: number }) =>
                    getArcHeight(d, d.index, connections),
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
                    id="mainMap"
                    initialViewState={INITIAL_VIEW_STATE}
                    onRender={() => {}}
                    mapStyle={
                        MAP_TILES[settingsState.mapTiles] ||
                        settingsState.mapTiles
                    }
                    attributionControl={false}
                    onContextMenu={(e) => {
                        handleContextMenu(e);
                    }}
                    onDblClick={(e) => {
                        handleContextMenu(e);
                    }}
                    projection={settingsState.globeView ? "globe" : "mercator"}
                >
                    <MapController
                        currentExperience={experience}
                        selectedStory={activeStory}
                    />
                    <AttributionControl
                        compact={true}
                        position={"bottom-right"}
                    />
                    {storiesFiltered.map((story, index) => (
                        <Marker
                            longitude={story.location.coordinates[0]}
                            latitude={story.location.coordinates[1]}
                            rotationAlignment={settingsState.markerProjection}
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
                    <DeckGLOverlay
                        pickingRadius={15}
                        layers={layers}
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
                    />
                    {hoverInfo?.object && !isMobile && (
                        <div
                            className={
                                "absolute z-50 pointer-events-none bg-card p-2 rounded-md shadow-md text-sm"
                            }
                            style={{
                                left: hoverInfo.x,
                                top: hoverInfo.y,
                            }}
                        >
                            <p>{`click to filter for:`}</p>
                            <p>{`${hoverInfo.object.tag}`}</p>
                            {settingsState.debug && (
                                <div className={"pt-2"}>
                                    <p className={"text-xs font-mono"}>
                                        {`from: [${hoverInfo.object.from[0].toFixed(
                                            2
                                        )}, ${hoverInfo.object.from[1].toFixed(
                                            2
                                        )}]`}
                                    </p>
                                    <p className={"text-xs font-mono"}>
                                        {`to: [${hoverInfo.object.to[0].toFixed(
                                            2
                                        )}, ${hoverInfo.object.to[1].toFixed(
                                            2
                                        )}]`}
                                    </p>
                                    <p className={"text-xs font-mono"}>
                                        {`tag: ${hoverInfo.object.tag}`}{" "}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Map>
            </div>
        </div>
    );
}
