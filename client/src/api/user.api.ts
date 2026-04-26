import { axiosClient } from "./axiosClient";
import type {
    ChangePasswordPayload,
    ChangePasswordResponse,
    UpdateProfilePayload,
    UserProfileResponse,
} from "../types/user.types";

/* Fetch authenticated user's profile */
export async function getMyProfile(): Promise<UserProfileResponse> {
    const response = await axiosClient.get<UserProfileResponse>("/api/users/me");
    return response.data;
}

/* Update authenticated user's profile */
export async function updateMyProfile(
    payload: UpdateProfilePayload
): Promise<UserProfileResponse> {
    const response = await axiosClient.put<UserProfileResponse>(
        "/api/users/me",
        payload
    );

    return response.data;
}

/* Change authenticated user's password */
export async function changeMyPassword(
    payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> {
    const response = await axiosClient.put<ChangePasswordResponse>(
        "/api/users/me/password",
        payload
    );

    return response.data;
}