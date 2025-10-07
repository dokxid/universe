// next.config.mjs
import DotenvFlow from "dotenv-flow";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// allow more .env files
DotenvFlow.config({
    node_env: process.env.APP_ENV || process.env.NODE_ENV || "development",
});
const env = {};
Object.keys(process.env).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_")) {
        env[key] = process.env[key];
    }
});

const config = {
    env,
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
        globalNotFound: true,
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
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
    },
};

export default config;
