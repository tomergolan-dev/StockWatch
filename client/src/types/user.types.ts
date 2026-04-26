import type { AuthUser } from "./auth.types";

/* Response for current user profile */
export type UserProfileResponse = {
    success: boolean;
    data: AuthUser;
};

/* Payload for updating profile details */
export type UpdateProfilePayload = {
    firstName: string;
    lastName: string;
};

/* Response for password change */
export type ChangePasswordResponse = {
    success: boolean;
    message: string;
};

/* Payload for changing password */
export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};