import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { updateMyProfile } from "../../api/user.api";
import { useAuth } from "../../hooks/useAuth";

/* Display and edit authenticated user's personal details */
function ProfileDetailsCard() {
    const { user, updateUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const hasChanges =
        firstName.trim() !== (user?.firstName || "") ||
        lastName.trim() !== (user?.lastName || "");

    useEffect(() => {
        if (!isEditing) {
            setFirstName(user?.firstName || "");
            setLastName(user?.lastName || "");
        }
    }, [user, isEditing]);

    const getErrorMessage = (error: unknown) => {
        if (error instanceof AxiosError) {
            const responseMessage = error.response?.data?.message;

            if (typeof responseMessage === "string" && responseMessage.trim()) {
                return responseMessage;
            }
        }

        return "Failed to update profile.";
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleCancel = () => {
        setFirstName(user?.firstName || "");
        setLastName(user?.lastName || "");
        setIsEditing(false);
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!hasChanges) {
            return;
        }

        setIsSaving(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await updateMyProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
            });

            updateUser(response.data);
            setIsEditing(false);
            setSuccessMessage("Profile updated successfully.");
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form className="profile-card profile-details-card" onSubmit={handleSubmit}>
            <div className="profile-card-header clean">
                <div>
                    <h2 className="profile-section-title">Personal details</h2>
                    <p className="profile-section-description">
                        Update your displayed name. Your email is used for login and cannot
                        be edited here.
                    </p>
                </div>
            </div>

            <div className="profile-form-grid">
                <div className="form-group">
                    <label htmlFor="profileFirstName">First name</label>
                    <input
                        id="profileFirstName"
                        className={!isEditing ? "profile-readonly-input" : ""}
                        value={firstName}
                        onChange={(event) => setFirstName(event.target.value)}
                        disabled={!isEditing || isSaving}
                        placeholder="First name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profileLastName">Last name</label>
                    <input
                        id="profileLastName"
                        className={!isEditing ? "profile-readonly-input" : ""}
                        value={lastName}
                        onChange={(event) => setLastName(event.target.value)}
                        disabled={!isEditing || isSaving}
                        placeholder="Last name"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="profileEmail">Email</label>
                    <input
                        id="profileEmail"
                        className="profile-readonly-input"
                        value={user?.email || ""}
                        disabled
                        readOnly
                    />
                </div>
            </div>

            {errorMessage ? <p className="form-error profile-message">{errorMessage}</p> : null}

            {successMessage ? (
                <p className="form-success profile-message">{successMessage}</p>
            ) : null}

            <div className="profile-card-footer">
                {!isEditing ? (
                    <button
                        type="button"
                        className="profile-secondary-button"
                        onClick={handleStartEdit}
                    >
                        <Pencil size={16} />
                        <span>Edit profile</span>
                    </button>
                ) : (
                    <div className="profile-actions">
                        <button
                            type="button"
                            className="profile-secondary-button"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            <X size={16} />
                            <span>Cancel</span>
                        </button>

                        <button
                            type="submit"
                            className="primary-button profile-primary-button"
                            disabled={isSaving || !hasChanges}
                        >
                            <Save size={16} />
                            <span>{isSaving ? "Saving..." : "Save changes"}</span>
                        </button>
                    </div>
                )}
            </div>
        </form>
    );
}

export default ProfileDetailsCard;