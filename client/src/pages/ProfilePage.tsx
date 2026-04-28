import { AxiosError } from "axios";
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyProfile } from "../api/user.api";
import PasswordChangeModal from "../features/profile/PasswordChangeModal";
import ProfileDetailsCard from "../features/profile/ProfileDetailsCard";
import { useAuth } from "../hooks/useAuth";

/* Display the authenticated user's profile page */
function ProfilePage() {
    const { updateUser } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        document.title = "StockWatch | My Profile";
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await getMyProfile();
                updateUser(response.data);
            } catch (error: unknown) {
                let serverMessage = "Failed to load profile.";

                if (error instanceof AxiosError) {
                    const responseMessage = error.response?.data?.message;

                    if (typeof responseMessage === "string" && responseMessage.trim()) {
                        serverMessage = responseMessage;
                    }
                }

                setErrorMessage(serverMessage);
            } finally {
                setIsLoading(false);
            }
        };

        void loadProfile();
    }, [updateUser]);

    return (
        <>
            <section className="profile-page">
                <div className="profile-hero">
                    <div className="profile-copy">
                        <p className="dashboard-search-eyebrow">Account Settings</p>
                        <h1 className="page-title">Profile</h1>
                        <p className="page-description">
                            Manage your account details and security settings.
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="profile-state">
                        <p className="page-description">Loading profile...</p>
                    </div>
                ) : null}

                {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

                {!isLoading && !errorMessage ? (
                    <div className="profile-content-grid single">
                        <ProfileDetailsCard />

                        <article className="profile-card profile-password-summary-card">
                            <div className="profile-card-header clean">
                                <div>
                                    <h2 className="profile-section-title">Security</h2>
                                    <p className="profile-section-description">
                                        Keep your account protected by updating your password
                                        when needed.
                                    </p>
                                </div>
                            </div>

                            <div className="profile-security-preview">
                                <div className="profile-security-icon">
                                    <KeyRound size={22} />
                                </div>

                                <div>
                                    <p className="profile-security-title">Password</p>
                                    <p className="profile-security-text">
                                        Change your password using your current password.
                                    </p>
                                </div>
                            </div>

                            <div className="profile-card-footer">
                                <button
                                    type="button"
                                    className="profile-secondary-button profile-full-button"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                >
                                    <KeyRound size={16} />
                                    <span>Change password</span>
                                </button>
                            </div>
                        </article>
                    </div>
                ) : null}
            </section>

            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </>
    );
}

export default ProfilePage;