import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [{
            protocol: "https",
            hostname: "heritagelab.center",
        }, {
            protocol: "https",
            hostname: "hl-universe-staging.s3.eu-central-1.amazonaws.com",
        }]
    },
};

export default nextConfig;
