'use client';

import { RMap, RGeolocateControl } from 'maplibre-react-components'
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MyMap() {
    return (
        <div className="w-screen h-screen">
            <RMap
                mapStyle="https://tiles.stadiamaps.com/styles/stamen_watercolor.json"
                initialCenter={[24.750592, 59.44435]}
                initialZoom={5}
                style={{
                    margin: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#222'
                }}
            >
                <RGeolocateControl
                    showUserLocation={true}
                    showAccuracyCircle={true}
                    trackUserLocation={false}
                />
            </RMap>
        </div>
    );
}