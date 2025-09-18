import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    // added because my node activated from ~/ instead of directory root
    outputFileTracingRoot: path.join(__dirname),

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
