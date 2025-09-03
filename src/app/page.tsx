'use client'

import React from "react";
import dynamic from 'next/dynamic'
const MyMap = dynamic(() => import('./components/map'), {
    ssr: false,
})

export default function Home() {
  return (
    <main>
        <div className="absolute">
            <MyMap></MyMap>
        </div>
    </main>
  );
}