import bcrypt from "bcryptjs";
import User from "../models/user.model";

type UpdateProfileInput = {
    firstName: string;
    lastName: string;
};

type ChangePasswordInput = {
    currentPassword: string;
    newPassword: string;
};

/* Get user profile without password hash */
export async function getMyProfile(userId: string) {
    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

/* Update authenticated user's profile */
export async function updateMyProfile(
    userId: string,
    data: UpdateProfileInput
) {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            firstName: data.firstName,
            lastName: data.lastName,
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-passwordHash");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

/* Change authenticated user's password */
export async function changeMyPassword(
    userId: string,
    data: ChangePasswordInput
) {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.passwordHash
    );

    if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    user.passwordHash = newPasswordHash;
    await user.save();

    return {
        success: true,
        message: "Password updated successfully",
    };
}