import { UserResponse } from "@workos-inc/node";

enum ExceptionReasons {
    INVALID_JWT = "invalid_jwt",
    INVALID_SESSION_COOKIE = "invalid_session_cookie",
    NO_SESSION_COOKIE_PROVIDED = "no_session_cookie_provided",
    INVALID_GRANT = "invalid_grant",
    MFA_ENROLLMENT = "mfa_enrollment",
    ORGANIZATION_NOT_AUTHORIZED = "organization_not_authorized",
    INVALID_ORGANIZATION_ID = "invalid_organization_id",
    ONE_TIME_CODE_PREVIOUSLY_USED = "one_time_code_previously_used",
    ORGANIZATION_SELECTION_REQUIRED = "organization_selection_required",
    SSO_REQUIRED = "sso_required",
    INVALID_PENDING_AUTHENTICATION_TOKEN = "invalid_pending_authentication_token",
}

type Organization = {
    id: string;
    name: string;
};

export type SSORequiredException = {
    status: number;
    error: string;
    rawData: {
        email: string;
        error: string;
        connection_ids: string[];
    };
};

type AuthException = {
    status: number;
    rawData: {
        code: ExceptionReasons;
        message: string;
        pending_authentication_token: string;
        user: UserResponse;
        organizations: Organization[];
    };
    requestID: string;
    name: string;
    message: string;
};

export type { AuthException, ExceptionReasons, Organization };
