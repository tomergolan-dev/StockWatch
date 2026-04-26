import { AxiosError } from "axios";
import { useState } from "react";
import { X } from "lucide-react";
import { changeMyPassword } from "../../api/user.api";

type PasswordChangeModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

/* Display password change form inside a modal */
function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
    const [isSaving, setIsSaving] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const canSubmit = currentPassword.trim().length > 0 && newPassword.trim().length > 0;

    const getErrorMessage = (error: unknown) => {
        if (error instanceof AxiosError) {
            const responseMessage = error.response?.data?.message;

            if (typeof responseMessage === "string" && responseMessage.trim()) {
                return responseMessage;
            }
        }

        return "Failed to update password.";
    };

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setErrorMessage("");
    };

    const handleClose = () => {
        if (isSaving) {
            return;
        }

        resetForm();
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        setIsSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await changeMyPassword({
                currentPassword,
                newPassword,
            });

            setSuccessMessage(response.message || "Password updated successfully.");
            resetForm();

            window.setTimeout(() => {
                onClose();
                setSuccessMessage("");
            }, 900);
        } catch (error: unknown) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <form className="modal-box profile-password-modal" onSubmit={handleSubmit}>
                <div className="profile-modal-header">
                    <div>
                        <h3>Change password</h3>
                        <p className="modal-subtext">
                            Enter your current password and choose a new password.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="profile-icon-close"
                        onClick={handleClose}
                        disabled={isSaving}
                        aria-label="Close password modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="form-group">
                    <label htmlFor="currentPassword">Current password</label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        placeholder="Current password"
                        disabled={isSaving}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">New password</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="New password"
                        disabled={isSaving}
                    />
                </div>

                {errorMessage ? <p className="form-error profile-message">{errorMessage}</p> : null}

                {successMessage ? (
                    <p className="form-success profile-message">{successMessage}</p>
                ) : null}

                <div className="modal-actions">
                    <button
                        type="button"
                        className="auth-secondary-button"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button profile-primary-button"
                        disabled={isSaving || !canSubmit}
                    >
                        {isSaving ? "Updating..." : "Update password"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PasswordChangeModal;