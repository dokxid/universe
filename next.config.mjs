// next.config.mjs
import DotenvFlow from "dotenv-flow";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*  
allow more .env files
reference: https://github.com/vercel/next.js/discussions/25764
reason why this is even a thing and still to reconsider: https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production#why-is-node_env-considered-an-antipattern 
*/
DotenvFlow.config({
    node_env: process.env.APP_ENV || process.env.NODE_ENV || "development",
});
const env = {};
Object.keys(process.env).forEach((key) => {
    if (key.startsWith("NEXT_PUBLIC_")) {
        env[key] = process.env[key];
    }
});
console.log("loaded .env file: " + JSON.stringify(process.env.APP_ENV));

const config = {
    output: "standalone",
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
        serverActions: {
            bodySizeLimit: "2mb",
        },
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
                pathname: "/api/files/**",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
    },
};

export default config;
