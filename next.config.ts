import type { NextConfig } from "next";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
    // added because my node activated from ~/ instead of directory root
    outputFileTracingRoot: join(__dirname),

    experimental: {
        ppr: "incremental",
    },

    async redirects() {
        return [
            // Basic redirect
            {
                source: "/",
                destination: "/universe/map",
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
