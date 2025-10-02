// next.config.mjs
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    turbopack: {
        rules: {
            "*.svg": {
                loaders: ["@svgr/webpack"],
                as: "*.ts",
            },
        },
        resolveAlias: {
            "maplibre-gl-css": "maplibre-gl/dist/maplibre-gl.css",
        },
    },

    outputFileTracingRoot: join(__dirname),

    experimental: {
        ppr: "incremental",
    },

    async redirects() {
        return [
            {
                source: "/",
                destination: "/universe/map",
                permanent: true,
            },
            {
                source: "/:lab_slug",
                destination: "/:lab_slug/map",
                permanent: true,
            },
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "heritagelab.center",
            },
            {
                protocol: "https",
                hostname: "hl-universe-staging.s3.eu-central-1.amazonaws.com",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default config;
