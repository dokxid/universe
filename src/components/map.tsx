'use client';

import {RMap, RAttributionControl, RNavigationControl} from 'maplibre-react-components'
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MyMap() {
    return (
        <div className="w-screen h-screen">
            <RMap
                // mapStyle = "https://tiles.stadiamaps.com/styles/stamen_watercolor.json"
                mapStyle = "https://tiles.stadiamaps.com/styles/stamen_toner.json"
                initialCenter = {[24.750592, 59.44435]}
                initialZoom = {5}
                initialAttributionControl={false}
                dragRotate = {false}

                style={{
                    margin: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#222'
                }}
            >
                <RAttributionControl position={"bottom-left"}></RAttributionControl>
                <RNavigationControl position={"bottom-left"}></RNavigationControl>
            </RMap>
        </div>
    );
}
