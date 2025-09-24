declare module "redux-persist/lib/storage" {
    import { WebStorage } from "redux-persist/es/types";
    const storage: WebStorage;
    export default storage;
}

declare module "redux-persist" {
    export * from "redux-persist/es/persistReducer";
    export * from "redux-persist/es/types";
}
