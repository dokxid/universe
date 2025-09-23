import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    // added because my node activated from ~/ instead of directory root
    outputFileTracingRoot: path.join(__dirname),

    async redirects() {
        return [
            // Basic redirect
            {
                source: "/",
                destination: "/universe/map",
                permanent: true,
            },
            // Wildcard path matching
            {
                source: "/:slug",
                destination: "/:slug/map",
                permanent: true,
            },
        ];
    },

    images: {
        remotePatterns: [
            // images taken from the heritagelab.center site
            {
                protocol: "https",
                hostname: "heritagelab.center",
            },
            // images from s3 bucket
            {
                protocol: "https",
                hostname: "hl-universe-staging.s3.eu-central-1.amazonaws.com",
            },
        ],
    },
};

export default nextConfig;
